import { BrowserRouter, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import SociosPage from './pages/SociosPage'
import PlanesPage from './pages/PlanesPage' 
import CuotasPage from './pages/CuotasPage'
import PagosPage from './pages/PagosPage'
import LoginPage from './pages/LoginPage'
import './App.css'

// Layout privado: Muestra el Navbar y valida la autenticación
function LayoutPrivado({ token, onLogout }) {
  // Si no hay token de sesión, redirige inmediatamente a /login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      {/* Barra de navegación superior (sólo visible para usuarios autenticados) */}
      <nav style={{ display: 'flex', gap: '10px', justifyContent: 'center', padding: '15px', backgroundColor: '#1a1a1a' }}>
        <Link to="/socios">
          <button style={btnStyle}>Socios</button>
        </Link>
        <Link to="/planes">
          <button style={btnStyle}>Planes</button>
        </Link>
        <Link to="/cuotas">
          <button style={btnStyle}>Cuotas</button>
        </Link>
        <Link to="/cobrar">
          <button style={btnStyle}>Cobrar Cuota</button>
        </Link>
        <button style={{ ...btnStyle, backgroundColor: '#c0392b' }} onClick={onLogout}>
          Cerrar Sesión
        </button>
      </nav>

      {/* Renderiza el componente de la ruta activa */}
      <Outlet />
    </div>
  )
}

export default function App() {
  // Estado para leer y mantener el token guardado en localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública del Login */}
        <Route 
          path="/login" 
          element={
            token ? <Navigate to="/socios" replace /> : <LoginPage onLogin={handleLogin} />
          } 
        />

        {/* Grupo de rutas protegidas bajo el LayoutPrivado */}
        <Route element={<LayoutPrivado token={token} onLogout={handleLogout} />}>
          <Route path="/" element={<Navigate to="/socios" replace />} />
          <Route path="/socios" element={<SociosPage />} />
          <Route path="/planes" element={<PlanesPage />} />
          <Route path="/cuotas" element={<CuotasPage />} />
          <Route path="/cobrar" element={<PagosPage />} />
        </Route>

        {/* Comodín para redirigir cualquier ruta inexistente */}
        <Route path="*" element={<Navigate to={token ? "/socios" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// Estilo básico para los botones de la barra de navegación
const btnStyle = {
  backgroundColor: '#444',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer'
}