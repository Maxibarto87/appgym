import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import SociosPage from './pages/SociosPage'
import PlanesPage from './pages/PlanesPage'
import CuotasPage from './pages/CuotasPage'
import PagosPage from './pages/PagosPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Componente para proteger las rutas privadas
function RutaProtegida({ children }) {
  const token = localStorage.getItem('token') || localStorage.getItem('usuario')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Estilos de los links y botón
const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '8px 12px',
  backgroundColor: '#333',
  borderRadius: '4px',
  border: '1px solid #555'
}

const btnLogoutStyle = {
  padding: '8px 16px',
  backgroundColor: '#d9534f',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
}

// Barra de navegación
function NavBar() {
  const navigate = useNavigate()
  const estaAutenticado = Boolean(localStorage.getItem('token') || localStorage.getItem('usuario'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  // Si no hay sesión iniciada, no muestra la barra de navegación
  if (!estaAutenticado) return null

  return (
    <nav style={{ 
      display: 'flex', 
      gap: '15px', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '15px', 
      backgroundColor: '#1a1a1a' 
    }}>
      <Link to="/socios" style={linkStyle}>Socios</Link>
      <Link to="/planes" style={linkStyle}>Planes</Link>
      <Link to="/cuotas" style={linkStyle}>Cuotas</Link>
      <Link to="/cobrar" style={linkStyle}>Pagos</Link>

      <button onClick={handleLogout} style={btnLogoutStyle}>
        Cerrar Sesión
      </button>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Protegidas */}
        <Route path="/socios" element={<RutaProtegida><SociosPage /></RutaProtegida>} />
        <Route path="/planes" element={<RutaProtegida><PlanesPage /></RutaProtegida>} />
        <Route path="/cuotas" element={<RutaProtegida><CuotasPage /></RutaProtegida>} />
        <Route path="/cobrar" element={<RutaProtegida><PagosPage /></RutaProtegida>} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// IMPORTANTE: Esta exportación resuelve el error
export default App;