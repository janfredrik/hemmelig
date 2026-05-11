import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SecretCreated from './pages/SecretCreated'
import ViewSecret from './pages/ViewSecret'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/created/:id" element={<SecretCreated />} />
        <Route path="/secret/:id" element={<ViewSecret />} />
      </Routes>
    </BrowserRouter>
  )
}
