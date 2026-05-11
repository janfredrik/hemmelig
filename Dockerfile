# Stage 1 — build frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2 — build backend (embed frontend dist)
FROM golang:1.23-alpine AS backend
WORKDIR /app
COPY backend/ .
# Embed the compiled frontend
COPY --from=frontend /app/dist ./static
# go mod tidy generates go.sum on first build (no local Go required)
RUN go mod tidy && CGO_ENABLED=0 go build -ldflags="-w -s" -o hemmelig .

# Stage 3 — minimal runtime image (~15 MB)
FROM alpine:3.20
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app
COPY --from=backend /app/hemmelig .
VOLUME ["/data"]
EXPOSE 3000
ENTRYPOINT ["/app/hemmelig"]
