package main

import (
	"database/sql"
	"embed"
	"encoding/json"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"
)

//go:embed all:static
var embeddedStatic embed.FS

// ── DB setup ─────────────────────────────────────────────────────────────────

func initDB(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS secrets (
			id                    TEXT PRIMARY KEY,
			encrypted_data        TEXT NOT NULL,
			password_hash         TEXT,
			max_views             INTEGER NOT NULL DEFAULT 1,
			view_count            INTEGER NOT NULL DEFAULT 0,
			expires_at            INTEGER NOT NULL,
			created_at            INTEGER NOT NULL,
			is_password_protected INTEGER NOT NULL DEFAULT 0
		);
		CREATE INDEX IF NOT EXISTS idx_expires ON secrets(expires_at);
	`)
	return err
}

func cleanExpired(db *sql.DB) {
	if _, err := db.Exec("DELETE FROM secrets WHERE expires_at < ?", time.Now().Unix()); err != nil {
		log.Printf("cleanup: %v", err)
	}
}

// ── Request / response types ──────────────────────────────────────────────────

type createReq struct {
	EncryptedData       string `json:"encryptedData"`
	MaxViews            int    `json:"maxViews"`
	ExpiresIn           int    `json:"expiresIn"` // seconds
	Password            string `json:"password"`
	IsPasswordProtected bool   `json:"isPasswordProtected"`
}

type revealReq struct {
	Password string `json:"password"`
}

// ── Helpers ───────────────────────────────────────────────────────────────────

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(v)
}

func errJSON(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

func nullStr(s string) any {
	if s == "" {
		return nil
	}
	return s
}

func boolInt(b bool) int {
	if b {
		return 1
	}
	return 0
}

// ── Handlers ──────────────────────────────────────────────────────────────────

func handleCreate(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req createReq
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.EncryptedData == "" {
			errJSON(w, http.StatusBadRequest, "invalid request")
			return
		}

		if req.MaxViews < 1 {
			req.MaxViews = 1
		} else if req.MaxViews > 100 {
			req.MaxViews = 100
		}
		if req.ExpiresIn < 3600 {
			req.ExpiresIn = 3600
		} else if req.ExpiresIn > 2592000 {
			req.ExpiresIn = 2592000
		}

		isProtected := req.IsPasswordProtected && req.Password != ""
		var passwordHash string
		if isProtected {
			hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
			if err != nil {
				errJSON(w, http.StatusInternalServerError, "server error")
				return
			}
			passwordHash = string(hash)
		}

		id := uuid.New().String()
		now := time.Now().Unix()
		if _, err := db.Exec(
			`INSERT INTO secrets VALUES (?,?,?,?,0,?,?,?)`,
			id, req.EncryptedData, nullStr(passwordHash),
			req.MaxViews, now+int64(req.ExpiresIn), now, boolInt(isProtected),
		); err != nil {
			log.Printf("insert secret: %v", err)
			errJSON(w, http.StatusInternalServerError, "server error")
			return
		}

		writeJSON(w, http.StatusCreated, map[string]string{"id": id})
	}
}

func handleMeta(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		var isProtected, maxViews, viewCount int
		var expiresAt int64
		err := db.QueryRow(
			`SELECT is_password_protected, max_views, view_count, expires_at FROM secrets WHERE id = ?`, id,
		).Scan(&isProtected, &maxViews, &viewCount, &expiresAt)

		if err == sql.ErrNoRows {
			errJSON(w, http.StatusNotFound, "secret not found")
			return
		}
		if err != nil {
			errJSON(w, http.StatusInternalServerError, "server error")
			return
		}
		if time.Now().Unix() > expiresAt {
			db.Exec("DELETE FROM secrets WHERE id = ?", id)
			errJSON(w, http.StatusGone, "secret expired")
			return
		}

		writeJSON(w, http.StatusOK, map[string]any{
			"id":                  id,
			"isPasswordProtected": isProtected == 1,
			"remainingViews":      maxViews - viewCount,
			"expiresAt":           time.Unix(expiresAt, 0).Format(time.RFC3339),
		})
	}
}

func handleReveal(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		var req revealReq
		json.NewDecoder(r.Body).Decode(&req)

		var encryptedData string
		var passwordHash sql.NullString
		var maxViews, viewCount, isProtected int
		var expiresAt int64

		err := db.QueryRow(
			`SELECT encrypted_data, password_hash, max_views, view_count, expires_at, is_password_protected
			 FROM secrets WHERE id = ?`, id,
		).Scan(&encryptedData, &passwordHash, &maxViews, &viewCount, &expiresAt, &isProtected)

		if err == sql.ErrNoRows {
			errJSON(w, http.StatusNotFound, "secret not found or already burned")
			return
		}
		if err != nil {
			errJSON(w, http.StatusInternalServerError, "server error")
			return
		}

		if time.Now().Unix() > expiresAt {
			db.Exec("DELETE FROM secrets WHERE id = ?", id)
			errJSON(w, http.StatusGone, "secret expired")
			return
		}
		if viewCount >= maxViews {
			db.Exec("DELETE FROM secrets WHERE id = ?", id)
			errJSON(w, http.StatusGone, "secret burned")
			return
		}

		if isProtected == 1 {
			if req.Password == "" {
				errJSON(w, http.StatusUnauthorized, "password required")
				return
			}
			if bcrypt.CompareHashAndPassword([]byte(passwordHash.String), []byte(req.Password)) != nil {
				errJSON(w, http.StatusUnauthorized, "incorrect password")
				return
			}
		}

		newCount := viewCount + 1
		if newCount >= maxViews {
			db.Exec("DELETE FROM secrets WHERE id = ?", id)
		} else {
			db.Exec("UPDATE secrets SET view_count = ? WHERE id = ?", newCount, id)
		}

		writeJSON(w, http.StatusOK, map[string]string{"encryptedData": encryptedData})
	}
}

func handleBurn(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		db.Exec("DELETE FROM secrets WHERE id = ?", chi.URLParam(r, "id"))
		w.WriteHeader(http.StatusNoContent)
	}
}

// spaHandler serves static files and falls back to index.html for client-side routing.
func spaHandler(fsys fs.FS) http.HandlerFunc {
	server := http.FileServer(http.FS(fsys))
	return func(w http.ResponseWriter, r *http.Request) {
		p := strings.TrimPrefix(r.URL.Path, "/")
		if p == "" {
			p = "index.html"
		}
		f, err := fsys.Open(p)
		if err != nil {
			data, err := fs.ReadFile(fsys, "index.html")
			if err != nil {
				http.Error(w, "not found", http.StatusNotFound)
				return
			}
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Write(data)
			return
		}
		f.Close()
		server.ServeHTTP(w, r)
	}
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "/data/hemmelig.db"
	}

	if dir := dbPath[:strings.LastIndex(dbPath, "/")+1]; dir != "" {
		os.MkdirAll(dir, 0755)
	}

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	db.SetMaxOpenConns(1) // SQLite single-writer
	defer db.Close()

	db.Exec("PRAGMA journal_mode=WAL")
	db.Exec("PRAGMA synchronous=NORMAL")
	db.Exec("PRAGMA busy_timeout=5000")

	if err := initDB(db); err != nil {
		log.Fatalf("init db: %v", err)
	}

	go func() {
		cleanExpired(db)
		for range time.Tick(time.Hour) {
			cleanExpired(db)
		}
	}()

	r := chi.NewRouter()
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	}))

	r.Route("/api/v1", func(r chi.Router) {
		r.Post("/secrets", handleCreate(db))
		r.Get("/secrets/{id}", handleMeta(db))
		r.Post("/secrets/{id}/reveal", handleReveal(db))
		r.Delete("/secrets/{id}", handleBurn(db))
	})

	staticFS, err := fs.Sub(embeddedStatic, "static")
	if err != nil {
		log.Fatalf("static fs: %v", err)
	}
	r.Get("/*", spaHandler(staticFS))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Printf("Listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
