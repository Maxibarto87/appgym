import { useState, useEffect } from 'react'
import { getCuotas, createCuota, getSocios } from '../services/api'

export default function CuotasPage() {
  const [cuotas, setCuotas] = useState([])
  const [socios, setSocios] = useState([])
  const [cargando, setCargando] = useState(true)

  const initialFormState = {
    id_socio: '',
    mes: '',
    vencimiento: '',
    precio: ''
  }

  const [form, setForm] = useState(initialFormState)

  const cargarDatos = () => {
    setCargando(true)
    Promise.all([getCuotas(), getSocios()])
      .then(([resCuotas, resSocios]) => {
        setCuotas(resCuotas.data || [])
        setSocios(resSocios.data || [])
        setCargando(false)
      })
      .catch(error => {
        console.error('Error al cargar datos:', error)
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const cuotaAEnviar = {
      id_socio: parseInt(form.id_socio, 10),
      mes: parseInt(form.mes, 10), // O String(form.mes) según corresponda con DTO de la API
      vencimiento: form.vencimiento,
      precio: parseFloat(form.precio)
    }

    createCuota(cuotaAEnviar)
      .then(() => {
        alert('¡Cuota generada con éxito!')
        setForm(initialFormState)
        cargarDatos()
      })
      .catch(error => {
        console.error('Error al generar la cuota:', error)
        alert('Error al generar la cuota. Revisa los datos ingresados.')
      })
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <h2>📋 Gestión de Cuotas</h2>

      <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Generar Nueva Cuota</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
          
          <label>Socio:</label>
          <select name="id_socio" value={form.id_socio} onChange={handleChange} required>
            <option value="" disabled>Seleccione un Socio</option>
            {socios.map(s => {
              const socioId = s.id_socio || s.idSocio || s.id
              return (
                <option key={socioId} value={socioId}>
                  {s.nombre || s.Nombre} {s.apellido || s.Apellido}
                </option>
              )
            })}
          </select>

          <label>Mes (1 al 12):</label>
          <input 
            type="number" 
            name="mes" 
            placeholder="Ej: 5 (para Mayo)" 
            min="1" 
            max="12" 
            value={form.mes} 
            onChange={handleChange} 
            required 
          />

          <label>Fecha de Vencimiento:</label>
          <input 
            type="date" 
            name="vencimiento" 
            value={form.vencimiento} 
            onChange={handleChange} 
            required 
          />

          <label>Precio / Importe ($):</label>
          <input 
            type="number" 
            name="precio" 
            placeholder="Ej: 15000" 
            step="0.01" 
            value={form.precio} 
            onChange={handleChange} 
            required 
          />

          <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
            Generar Cuota
          </button>
        </form>
      </div>

      <h3>Listado de Cuotas</h3>
      {cargando ? (
        <p>Cargando cuotas...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>ID Cuota</th>
              <th>ID Socio</th>
              <th>Mes</th>
              <th>Vencimiento</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((c, index) => (
              <tr key={c.id_Cuota || c.idCuota || index}>
                <td>{c.id_Cuota || c.idCuota || index + 1}</td>
                <td>{c.id_socio || c.idSocio}</td>
                <td>{c.mes}</td>
                <td>{c.vencimiento ? new Date(c.vencimiento).toLocaleDateString() : '-'}</td>
                <td>${c.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}