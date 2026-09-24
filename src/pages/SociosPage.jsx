import { useState, useEffect } from 'react'
import { getSocios, getPlanes, createSocio } from '../services/api'

export default function SociosPage() {
  const [socios, setSocios] = useState([])
  const [planes, setPlanes] = useState([])
  const [mensajeError, setMensajeError] = useState('')
  
  const [form, setForm] = useState({ 
    nombre: '', 
    apellido: '', 
    dni: '', 
    tel: '', 
    id_plan: '' 
  })

  const cargarDatos = () => {
    getSocios()
      .then(res => setSocios(res.data || []))
      .catch(err => console.error('Error al obtener socios:', err))

    getPlanes()
      .then(res => setPlanes(res.data || []))
      .catch(err => console.error('Error al obtener planes:', err))
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setMensajeError('')

    if (!form.id_plan) {
      setMensajeError('Por favor selecciona un plan válido.')
      return
    }

    const dniLimpio = form.dni.trim().slice(0, 8)

    createSocio({
      ...form,
      dni: dniLimpio,
      id_plan: Number(form.id_plan)
    })
      .then(() => {
        alert('Socio registrado con éxito')
        setForm({ nombre: '', apellido: '', dni: '', tel: '', id_plan: '' })
        cargarDatos()
      })
      .catch((error) => {
        console.error('Error al registrar socio:', error.response?.data)
        setMensajeError('Error al guardar socio: verifica que el DNI no supere los 8 dígitos.')
      })
  }

  // Función helper para obtener el nombre del plan asignado
  const obtenerNombrePlan = (socio) => {
    // 1. Si la API de .NET devuelve el objeto de navegación (ej: socio.plan.nombre o socio.idPlanNavigation.nombre)
    if (socio.plan && socio.plan.nombre) return socio.plan.nombre
    if (socio.Plan && socio.Plan.Nombre) return socio.Plan.Nombre

    // 2. Si solo devuelve el ID del plan, lo buscamos en el array 'planes'
    const planIdSocio = socio.id_plan || socio.idPlan || socio.IdPlan
    const planEncontrado = planes.find(p => (p.id_plan || p.idPlan || p.id) === Number(planIdSocio))
    
    return planEncontrado ? (planEncontrado.nombre || planEncontrado.Nombre) : 'Sin Plan'
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Socios</h2>

      {mensajeError && (
        <p style={{ color: '#f44336', fontWeight: 'bold' }}>{mensajeError}</p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          placeholder="Nombre" 
          value={form.nombre}
          onChange={e => setForm({...form, nombre: e.target.value})} 
          required 
        />
        <input 
          placeholder="Apellido" 
          value={form.apellido}
          onChange={e => setForm({...form, apellido: e.target.value})} 
          required 
        />
        <input 
          placeholder="DNI (máx. 8 dígitos)" 
          value={form.dni}
          maxLength={8}
          onChange={e => setForm({...form, dni: e.target.value})} 
        />
        <input 
          placeholder="Teléfono" 
          value={form.tel}
          onChange={e => setForm({...form, tel: e.target.value})} 
        />
        
        <select 
          value={form.id_plan} 
          onChange={e => setForm({...form, id_plan: e.target.value})} 
          required
        >
          <option value="">Seleccione Plan</option>
          {planes.map(p => {
            const planId = p.id_plan || p.idPlan || p.id
            return (
              <option key={planId} value={planId}>
                {p.nombre || p.Nombre}
              </option>
            )
          })}
        </select>
        
        <button type="submit">Registrar Socio</button>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Plan Elegido</th>
          </tr>
        </thead>
        <tbody>
          {socios.length > 0 ? (
            socios.map(s => (
              <tr key={s.id_socio || s.idSocio || s.id}>
                <td>{s.nombre || s.Nombre} {s.apellido || s.Apellido}</td>
                <td>{s.dni || s.Dni}</td>
                <td>{s.tel || s.telefono || s.Telefono}</td>
                <td><strong>{obtenerNombrePlan(s)}</strong></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No hay socios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}