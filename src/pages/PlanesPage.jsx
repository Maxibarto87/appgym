import { useState, useEffect } from 'react'
import { getPlanes, createPlan, deletePlan } from '../services/api'
import './PlanesPage.css'

export default function PlanesPage() {
  const [planes, setPlanes] = useState([])
  const [form, setForm] = useState({ 
    nombre: '', 
    tipo: 'Musculación', 
    precio: '' 
  })

  const cargarPlanes = () => {
    getPlanes()
      .then(res => setPlanes(res.data))
      .catch(err => console.error("Error al cargar planes:", err))
  }

  useEffect(() => { cargarPlanes() }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form, precio: Number(form.precio) }

    createPlan(payload).then(() => {
      alert('Plan guardado exitosamente')
      setForm({ nombre: '', tipo: 'Musculación', precio: '' })
      cargarPlanes()
    })
  }

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este plan?')) {
      deletePlan(id).then(() => {
        alert('Plan eliminado correctamente')
        cargarPlanes()
      }).catch(err => console.error(err))
    }
  }

  return (
    <div className="pricing-page">
      {/* Formulario para agregar planes */}
      <div className="admin-form-container">
        <h3>Agregar nuevo plan</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <input 
            placeholder="Nombre del Plan (Ej: PLAN PLUS)" 
            value={form.nombre} 
            onChange={e => setForm({...form, nombre: e.target.value})} 
            required 
          />
          <select 
            value={form.tipo} 
            onChange={e => setForm({...form, tipo: e.target.value})}
            required
          >
            <option value="Musculación">Musculación / Gimnasio</option>
            <option value="Zumba">Zumba / Baile</option>
            <option value="Crossfit">Crossfit / Funcional</option>
            <option value="Pase Libre">Pase Libre Full</option>
          </select>
          <input 
            type="number" 
            placeholder="Precio" 
            value={form.precio} 
            onChange={e => setForm({...form, precio: e.target.value})} 
            required 
          />
          <button type="submit" className="btn-save">Guardar Plan</button>
        </form>
      </div>

      {/* Grilla de Tarjetas horizontales */}
      <div className="cards-wrapper">
        {planes.map((p, index) => {
          const idPlan = p.id_plan || p.id
          const esDestacado = p.destacado || index === 1

          return (
            <div key={idPlan} className={`custom-card ${esDestacado ? 'highlighted-card' : ''}`}>
              <button className="card-delete-btn" onClick={() => handleEliminar(idPlan)} title="Eliminar plan">
                ✕
              </button>

              {esDestacado && <div className="yellow-badge">Popular</div>}

              <div className="card-header">
                <span className="card-period">MENSUAL</span>
                <h2 className="card-title">{p.nombre.toUpperCase()}</h2>
              </div>

              <div className="card-price-box">
                <span className="price-symbol">$</span>
                <span className="price-amount">{Number(p.precio).toLocaleString('es-AR')}</span>
                <span className="price-period">/mes</span>
              </div>

            
            </div>
          )
        })}
      </div>
    </div>
  )
}