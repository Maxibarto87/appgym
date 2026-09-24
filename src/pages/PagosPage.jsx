import { useState, useEffect } from 'react'
import { getSocios, getCuotas, getMetodos, registrarPago } from '../services/api'

export default function PagosPage() {
  const [socios, setSocios] = useState([])
  const [cuotas, setCuotas] = useState([])
  const [metodos, setMetodos] = useState([])
  
  const [pago, setPago] = useState({
    fecha: new Date().toISOString(),
    importe: 0,
    id_socio: '',
    id_Cuota: '',
    id_Metodo: ''
  })

  useEffect(() => {
    getSocios().then(res => setSocios(res.data))
    getCuotas().then(res => setCuotas(res.data))
    getMetodos().then(res => setMetodos(res.data))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    registrarPago(pago).then(() => alert('Pago registrado con éxito'))
  }

  return (
    <div>
      <h2>Cobro de Cuotas</h2>
      <form onSubmit={handleSubmit}>
        <select onChange={e => setPago({...pago, id_socio: e.target.value})} required defaultValue="">
          <option value="" disabled>Seleccione Socio</option>
          {socios.map(s => <option key={s.id_socio} value={s.id_socio}>{s.nombre} {s.apellido}</option>)}
        </select>

        <select onChange={e => setPago({...pago, id_Cuota: e.target.value})} required defaultValue="">
          <option value="" disabled>Seleccione Cuota Pendiente</option>
          {cuotas.map(c => <option key={c.id_Cuota} value={c.id_Cuota}>Mes: {c.mes} - Vencimiento: {c.vencimiento}</option>)}
        </select>

        <select onChange={e => setPago({...pago, id_Metodo: e.target.value})} required defaultValue="">
          <option value="" disabled>Seleccione Método de Pago</option>
          {metodos.map(m => <option key={m.id_Metodo} value={m.id_Metodo}>{m.nombre}</option>)}
        </select>

        <input type="number" placeholder="Monto Importe" onChange={e => setPago({...pago, importe: e.target.value})} required />

        <button type="submit">Confirmar Cobro</button>
      </form>
    </div>
  )
}