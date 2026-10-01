import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SociosPage from './pages/SociosPage'
import PlanesPage from './pages/PlanesPage' 
import CuotasPage from './pages/CuotasPage'
import PagosPage from './pages/PagosPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* Barra de navegación superior */}
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
      </nav>

      {/* Definición de rutas */}
      <Routes>
        <Route path="/" element={<SociosPage />} />
        <Route path="/socios" element={<SociosPage />} />
        <Route path="/planes" element={<PlanesPage />} />
        <Route path="/cuotas" element={<CuotasPage />} />
        
        {/* Agregada la ruta para /cobrar usando PagosPage */}
        <Route path="/cobrar" element={<PagosPage />} />
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