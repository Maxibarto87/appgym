import { useState } from 'react'
import Navbar from './components/Navbar'
import SociosPage from './pages/SociosPage'
import PlanesPage from './pages/PlanesPage'
import CuotasPage from './pages/CuotasPage'
import PagosPage from './pages/PagosPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  // 1. Leemos si hay sesión activa en localStorage
  const [estaAutenticado, setEstaAutenticado] = useState(() => {
    return localStorage.getItem('token') ? true : false
  })

  // Controla la sección actual si ya inició sesión ('socios', 'planes', etc.)
  const [vistaActual, setVistaActual] = useState('socios')

  // Estado para alternar entre 'login' y 'registro' cuando no está autenticado
  const [vistaAuth, setVistaAuth] = useState('login')

  // 2. Función para cerrar sesión correctamente
  const handleCerrarSesion = () => {
    localStorage.removeItem('token') // Borramos el token guardado
    setEstaAutenticado(false)
  }

  // 3. Si no está autenticado, muestra el Login o Registro según 'vistaAuth'
  if (!estaAutenticado) {
    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>🏋️ AppGym - Acceso al Sistema</h1>
        
        {vistaAuth === 'login' ? (
          <LoginPage 
            onLoginExitoso={(datos) => {
              if (datos?.token) {
                localStorage.setItem('token', datos.token)
              }
              setEstaAutenticado(true)
            }} 
            onIrARegistro={() => setVistaAuth('registro')} 
          />
        ) : (
          <RegisterPage 
            onRegistroExitoso={() => setVistaAuth('login')} 
            onIrALogin={() => setVistaAuth('login')} 
          />
        )}
      </div>
    )
  }

  // 4. Si ya inició sesión, muestra el sistema completo
  return (
    <div>
      <Navbar 
        vistaActual={vistaActual} 
        setVistaActual={setVistaActual} 
        onCerrarSesion={handleCerrarSesion} 
      />
      
      <main style={{ padding: '20px' }}>
        {vistaActual === 'socios' && <SociosPage />}
        {vistaActual === 'planes' && <PlanesPage />}
        {vistaActual === 'cuotas' && <CuotasPage />}
        {vistaActual === 'pagos' && <PagosPage />}
      </main>
    </div>
  )
}