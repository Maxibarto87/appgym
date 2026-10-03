import { useState, useEffect } from 'react'
import { 
  getCuotas, 
  createCuota, 
  getSocios, 
  getPlanes, 
  getSociosPlanes, 
  getCuotasPlanes, 
  createCuotaPlan 
} from '../services/api'

export default function CuotasPage() {
  const [cuotas, setCuotas] = useState([])
  const [socios, setSocios] = useState([])
  const [planes, setPlanes] = useState([])
  const [sociosPlanes, setSociosPlanes] = useState([])
  const [cuotasPlanes, setCuotasPlanes] = useState([])
  const [cargando, setCargando] = useState(true)

  const initialFormState = {
    id_socio: '',
    mes: '',
    vencimiento: '',
    precio: ''
  }

  const [form, setForm] = useState(initialFormState)

  // Carga inicial de datos de la API
  const cargarDatos = () => {
    setCargando(true)
    Promise.all([
      getCuotas(),
      getSocios(),
      getPlanes(),
      getSociosPlanes(),
      getCuotasPlanes()
    ])
      .then(([resCuotas, resSocios, resPlanes, resSociosPlanes, resCuotasPlanes]) => {
        setCuotas(resCuotas.data || [])
        setSocios(resSocios.data || [])
        setPlanes(resPlanes.data || [])
        setSociosPlanes(resSociosPlanes.data || [])
        setCuotasPlanes(resCuotasPlanes.data || [])
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

  // Al seleccionar un socio, calcula automáticamente el precio sumando sus planes activos
  const handleSocioChange = (e) => {
    const socioId = parseInt(e.target.value, 10)
    
    // Buscar los planes que tiene asignados el socio
    const planesDelSocio = sociosPlanes
      .filter(sp => (sp.id_socio || sp.idSocio) === socioId)
      .map(sp => sp.id_plan || sp.idPlan)

    // Sumar el precio total de esos planes
    const precioTotal = planes.reduce((acc, p) => {
      const pId = p.id_plan || p.idPlan
      if (planesDelSocio.includes(pId)) {
        return acc + (p.precio || p.Precio || 0)
      }
      return acc
    }, 0)

    setForm({
      ...form,
      id_socio: socioId,
      precio: precioTotal > 0 ? precioTotal : form.precio
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const cuotaAEnviar = {
      id_socio: parseInt(form.id_socio, 10),
      mes: parseInt(form.mes, 10),
      vencimiento: form.vencimiento,
      precio: parseFloat(form.precio)
    }

    try {
      // 1. Crear la Cuota
      const resCuota = await createCuota(cuotaAEnviar)
      const cuotaCreada = resCuota.data
      const idCuotaGenerada = cuotaCreada?.id_Cuota || cuotaCreada?.idCuota || cuotaCreada?.id

      // 2. Obtener planes asociados al socio seleccionado
      const planesDelSocio = sociosPlanes
        .filter(sp => (sp.id_socio || sp.idSocio) === parseInt(form.id_socio, 10))
        .map(sp => sp.id_plan || sp.idPlan)

      // 3. Crear registros en CuotasPlanes por cada plan del socio
      if (idCuotaGenerada && planesDelSocio.length > 0) {
        const promesasCuotasPlanes = planesDelSocio.map(idPlan => 
          createCuotaPlan({
            id_Cuota: idCuotaGenerada,
            id_plan: idPlan
          })
        )
        await Promise.all(promesasCuotasPlanes)
      }

      alert('¡Cuota y CuotasPlanes generados con éxito!')
      setForm(initialFormState)
      cargarDatos()
    } catch (error) {
      console.error('Error al procesar la cuota:', error)
      alert('Error al generar la cuota. Revisa la consola para más detalles.')
    }
  }

  return (
    <div style={{ textAlign: 'left', padding: '20px' }}>
      <h2>📋 Gestión de Cuotas y CuotasPlanes</h2>

      {/* FORMULARIO */}
      <div style={{ background: '#222', color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Generar Nueva Cuota</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
          
          <label>Socio:</label>
          <select name="id_socio" value={form.id_socio} onChange={handleSocioChange} required style={{ padding: '8px' }}>
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
            style={{ padding: '8px' }}
          />

          <label>Fecha de Vencimiento:</label>
          <input 
            type="date" 
            name="vencimiento" 
            value={form.vencimiento} 
            onChange={handleChange} 
            required 
            style={{ padding: '8px' }}
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
            style={{ padding: '8px' }}
          />

          <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px', borderRadius: '4px' }}>
            Generar Cuota y Asignar Planes
          </button>
        </form>
      </div>

      {/* TABLAS */}
      {cargando ? (
        <p>Cargando información...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* TABLA CUOTAS */}
          <div>
            <h3>Listado de Cuotas</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#333', color: '#fff' }}>
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
                    <td>{c.id_Cuota || c.idCuota}</td>
                    <td>{c.id_socio || c.idSocio}</td>
                    <td>{c.mes || c.Mes}</td>
                    <td>{c.vencimiento ? new Date(c.vencimiento).toLocaleDateString() : '-'}</td>
                    <td>${c.precio || c.Precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLA CUOTAS PLANES */}
          <div>
            <h3>Listado de CuotasPlanes</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#333', color: '#fff' }}>
                  <th>ID Cuota</th>
                  <th>ID Plan</th>
                </tr>
              </thead>
              <tbody>
                {cuotasPlanes.map((cp, index) => (
                  <tr key={index}>
                    <td>{cp.id_Cuota || cp.idCuota}</td>
                    <td>{cp.id_plan || cp.idPlan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  )
}