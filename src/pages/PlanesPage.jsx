import { useState, useEffect } from 'react'
import { getPlanes, createPlan } from '../services/api'

export default function PlanesPage() {
  const [planes, setPlanes] = useState([])
  const [form, setForm] = useState({ nombre: '', precio: 0 })

  const cargarPlanes = () => {
    getPlanes().then(res => setPlanes(res.data))
  }

  useEffect(() => { cargarPlanes() }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    createPlan(form).then(() => {
      alert('Plan guardado')
      setForm({ nombre: '', precio: 0 })
      cargarPlanes()
    })
  }

  return (
    <div>
      <h2>Gestión de Planes</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
        <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
        <button type="submit">Guardar Plan</button>
      </form>

      <ul>
        {planes.map(p => (
          <li key={p.id_plan}>{p.nombre} - ${p.precio}</li>
        ))}
      </ul>
    </div>
  )
}