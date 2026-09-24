export default function Navbar({ setVistaActual }) {
  return (
    <nav style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
      <button onClick={() => setVistaActual('socios')}>Socios</button>
      <button onClick={() => setVistaActual('planes')}>Planes</button>
      <button onClick={() => setVistaActual('cuotas')}>Cuotas</button>
      <button onClick={() => setVistaActual('pagos')}>Cobrar Cuota</button>
      
    </nav>
  )
}