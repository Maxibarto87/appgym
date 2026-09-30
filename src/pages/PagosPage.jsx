import { useState, useEffect } from 'react'
import { getSocios, getCuotas, registrarPago } from '../services/api'

// Métodos de pago estáticos
const METODOS_PAGO = [
  { id_Metodo: 1, nombre: 'Efectivo' },
  { id_Metodo: 2, nombre: 'Transferencia' },
  { id_Metodo: 3, nombre: 'Tarjeta de Débito' },
  { id_Metodo: 4, nombre: 'Tarjeta de Crédito' },
]

export default function PagosPage() {
  const [socios, setSocios] = useState([])
  const [cuotas, setCuotas] = useState([])
  const [metodos] = useState(METODOS_PAGO)

  const [pago, setPago] = useState({
    id_socio: '',
    id_Cuota: '',
    id_Metodo: '',
    importe: ''
  })

  // Cargar socios al montar el componente
  useEffect(() => {
    getSocios()
      .then(res => setSocios(res.data || res || []))
      .catch(err => console.error('Error al cargar socios:', err))
  }, [])

  // Al seleccionar un socio, filtramos o traemos sus cuotas
  const handleSocioChange = (e) => {
    const idSocio = e.target.value
    setPago({ ...pago, id_socio: idSocio, id_Cuota: '' })

    if (idSocio) {
      getCuotas()
        .then(res => {
          const listaCuotas = res.data || res || []
          // Filtrar cuotas correspondientes al socio seleccionado
          const cuotasSocio = listaCuotas.filter(
            c => (c.id_socio || c.idSocio) === parseInt(idSocio, 10)
          )
          setCuotas(cuotasSocio)
        })
        .catch(err => console.error('Error al cargar cuotas:', err))
    } else {
      setCuotas([])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const pagoAEnviar = {
      id_socio: parseInt(pago.id_socio, 10),
      id_Cuota: parseInt(pago.id_Cuota, 10),
      id_Metodo: parseInt(pago.id_Metodo, 10),
      importe: parseFloat(pago.importe)
    }

    registrarPago(pagoAEnviar)
      .then(() => {
        alert('Pago registrado con éxito')
        setPago({ id_socio: '', id_Cuota: '', id_Metodo: '', importe: '' })
      })
      .catch(err => {
        console.error('Error al registrar pago:', err)
        alert('Error al registrar el pago')
      });
  }

  return (
    <div>
      <h2>Cobro de Cuotas</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* Selección de Socio */}
        <select value={pago.id_socio} onChange={handleSocioChange} required>
          <option value="" disabled>Seleccione Socio</option>
          {socios.map(s => {
            const id = s.id_socio || s.idSocio || s.id
            return (
              <option key={id} value={id}>
                {s.nombre || s.Nombre} {s.apellido || s.Apellido}
              </option>
            )
          })}
        </select>

        {/* Selección de Cuota Pendiente */}
        <select value={pago.id_Cuota} onChange={e => setPago({ ...pago, id_Cuota: e.target.value })} required>
          <option value="" disabled>Seleccione Cuota Pendiente</option>
          {cuotas.map(c => {
            const idC = c.id_Cuota || c.idCuota
            return (
              <option key={idC} value={idC}>
                Mes: {c.mes} - Vencimiento: {c.vencimiento ? new Date(c.vencimiento).toLocaleDateString() : '-'}
              </option>
            )
          })}
        </select>

        {/* Selección de Método de Pago */}
        <select value={pago.id_Metodo} onChange={e => setPago({ ...pago, id_Metodo: e.target.value })} required>
          <option value="" disabled>Seleccione Método de Pago</option>
          {metodos.map(m => (
            <option key={m.id_Metodo} value={m.id_Metodo}>
              {m.nombre}
            </option>
          ))}
        </select>

        {/* Importe */}
        <input 
          type="number" 
          step="0.01" 
          placeholder="Monto Importe" 
          value={pago.importe} 
          onChange={e => setPago({ ...pago, importe: e.target.value })} 
          required 
        />

        <button type="submit">Confirmar Cobro</button>
      </form>
    </div>
  )
}