import { useState, useEffect } from 'react'
import { getSocios, getPlanes, createSocio, updateSocio, deleteSocio } from '../services/api'

export default function SociosPage() {
  const [socios, setSocios] = useState([])
  const [planes, setPlanes] = useState([])
  const [mensajeError, setMensajeError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Estado para controlar la edición / cambio de plan
  const [socioEditando, setSocioEditando] = useState(null)
  const [modoEdicion, setModoEdicion] = useState('') // 'editar' | 'cambiar_plan'

  const [form, setForm] = useState({ 
    nombre: '', 
    apellido: '', 
    dni: '', 
    telefono: '',
    email: '',
    fecha_nacimiento: ''
  })

  const cargarDatos = () => {
    setCargando(true)
    
    // Cargar Socios
    getSocios()
      .then(res => {
        const datos = Array.isArray(res) ? res : (res?.data || [])
        setSocios(datos)
      })
      .catch(err => {
        console.error('Error al obtener socios:', err)
        setSocios([])
      })

    // Cargar Planes
    getPlanes()
      .then(res => {
        const datos = Array.isArray(res) ? res : (res?.data || [])
        setPlanes(datos)
      })
      .catch(err => {
        console.error('Error al obtener planes:', err)
        setPlanes([])
      })
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarDatos()
  }, [])

 const handleSubmit = (e) => {
  e.preventDefault()
  setMensajeError('')

  // Validar que se seleccione o asigne un plan (por defecto o desde el form)
  const idPlanSeleccionado = Number(form.id_plan) || (planes.length > 0 ? Number(planes[0].id_plan || planes[0].idPlan || planes[0].id) : null)

  if (!idPlanSeleccionado) {
    alert('Debes seleccionar un plan válido para registrar al socio.')
    return
  }

  const payload = {
    // Nombres exactos mapeando tanto CamelCase, PascalCase como el nombre de la BD
    nombre: form.nombre,
    Nombre: form.nombre,

    apellido: form.apellido,
    Apellido: form.apellido,

    dni: form.dni.trim(),
    DNI: form.dni.trim(),
    Dni: form.dni.trim(),

    tel: form.telefono,
    Tel: form.telefono,
    telefono: form.telefono,

    email: form.email,
    Email: form.email,

    fechaNacimiento: form.fecha_nacimiento,
    FechaNacimiento: form.fecha_nacimiento,
    fecha_nacimiento: form.fecha_nacimiento,

    id_plan: idPlanSeleccionado,
    idPlan: idPlanSeleccionado,
    Id_plan: idPlanSeleccionado
  }

  createSocio(payload)
    .then(() => {
      alert('Socio registrado con éxito')
      setForm({ nombre: '', apellido: '', dni: '', telefono: '', email: '', fecha_nacimiento: '', id_plan: '' })
      cargarDatos()
    })
    .catch((error) => {
      console.error('Error al registrar socio:', error.response?.data || error)
      setMensajeError(
        error.response?.data?.message || 
        (typeof error.response?.data === 'string' ? error.response?.data : '') ||
        'Error al guardar socio: verifica que el email y todos los campos requeridos estén completos.'
      )
    })
}
  // --- Manejo del Navbar y Sesión ---
  const handleNavegar = (seccion) => {
    console.log(`Navegando a: ${seccion}`)
  }

  const handleCerrarSesion = () => {
    if (window.confirm('¿Seguro que deseas cerrar sesión?')) {
      localStorage.clear()
      window.location.href = '/login'
    }
  }

  // --- Funciones para obtener propiedades independientemente de minúsculas/mayúsculas ---
  const obtenerTelefono = (socio) => {
    return socio.telefono || socio.Telefono || socio.tel || socio.Tel || '-'
  }

  const obtenerEmail = (socio) => {
    return socio.email || socio.Email || socio.mail || socio.Mail || '-'
  }

  // --- Funciones para abrir modales ---

  const abrirEditar = (socio) => {
    const planId = socio.id_plan || socio.idPlan || socio.IdPlan || ''
    setModoEdicion('editar')
    setSocioEditando({
      id_socio: socio.id_socio || socio.idSocio || socio.IdSocio || socio.id,
      nombre: socio.nombre || socio.Nombre || '',
      apellido: socio.apellido || socio.Apellido || '',
      dni: socio.dni || socio.Dni || socio.DNI || '',
      telefono: socio.telefono || socio.Telefono || socio.tel || socio.Tel || '',
      email: socio.email || socio.Email || socio.mail || socio.Mail || '',
      fecha_nacimiento: (socio.fecha_nacimiento || socio.FechaNacimiento || socio.fechaNacimiento) 
        ? (socio.fecha_nacimiento || socio.FechaNacimiento || socio.fechaNacimiento).split('T')[0] 
        : '',
      activo: socio.activo ?? socio.Activo ?? true,
      id_plan: planId
    })
  }

  const abrirCambiarPlan = (socio) => {
    const planId = socio.id_plan || socio.idPlan || socio.IdPlan || ''
    setModoEdicion('cambiar_plan')
    setSocioEditando({
      id_socio: socio.id_socio || socio.idSocio || socio.IdSocio || socio.id,
      nombre: socio.nombre || socio.Nombre || '',
      apellido: socio.apellido || socio.Apellido || '',
      dni: socio.dni || socio.Dni || socio.DNI || '',
      telefono: socio.telefono || socio.Telefono || socio.tel || socio.Tel || '',
      email: socio.email || socio.Email || socio.mail || socio.Mail || '',
      id_plan: planId
    })
  }

  const handleGuardarEdicion = (e) => {
    e.preventDefault()

    const idSocio = socioEditando.id_socio
    const payload = { ...socioEditando }

    if (modoEdicion === 'cambiar_plan') {
      if (!socioEditando.id_plan) {
        alert('Debes seleccionar un plan válido')
        return
      }
      payload.id_plan = Number(socioEditando.id_plan)
      payload.idPlan = Number(socioEditando.id_plan)
    }

    updateSocio(idSocio, payload)
      .then(() => {
        alert(modoEdicion === 'cambiar_plan' ? 'Plan cambiado con éxito' : 'Socio actualizado correctamente')
        setSocioEditando(null)
        setModoEdicion('')
        cargarDatos()
      })
      .catch(err => {
        console.error('Error al actualizar socio:', err)
        alert('No se pudo guardar los cambios')
      })
  }

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este socio?')) {
      deleteSocio(id)
      .then(() => {
        alert('Socio eliminado con éxito')
        cargarDatos()
      })
      .catch(err => {
        console.error('Error al eliminar socio:', err)
        alert('No se pudo eliminar el socio')
      })
    }
  }

  const obtenerNombrePlan = (socio) => {
    if (socio.plan?.nombre) return socio.plan.nombre
    if (socio.Plan?.Nombre) return socio.Plan.Nombre

    const planIdSocio = socio.id_plan || socio.idPlan || socio.IdPlan
    const planEncontrado = planes.find(p => Number(p.id_plan || p.idPlan || p.IdPlan || p.id) === Number(planIdSocio))
    
    return planEncontrado ? (planEncontrado.nombre || planEncontrado.Nombre || planEncontrado.descripcion || planEncontrado.Descripcion) : 'Sin Plan'
  }

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      
      {/* Barra de Navegación Superior (Nav) */}
      <nav style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '14px 28px',
        backgroundColor: '#1e1e1e',
        borderBottom: '1px solid #333',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#4CAF50' }}>
          Gym Bart
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button 
            onClick={() => handleNavegar('socios')}
            style={{
              background: 'none', border: 'none', color: '#4CAF50', 
              fontWeight: 'bold', fontSize: '15px', cursor: 'pointer',
              borderBottom: '2px solid #4CAF50', paddingBottom: '2px'
            }}
          >
         </button>

          
        </div>
      </nav>

      <div style={{ padding: '0 20px 20px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Gestión de Socios</h2>

        {mensajeError && (
          <p style={{ color: '#ff5252', fontWeight: 'bold', textAlign: 'center' }}>{mensajeError}</p>
        )}

        {/* Formulario de Registro */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }} autoComplete="off">
          <input 
            placeholder="Nombre" 
            value={form.nombre}
            onChange={e => setForm({...form, nombre: e.target.value})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: '#fff' }}
          />
          <input 
            placeholder="Apellido" 
            value={form.apellido}
            onChange={e => setForm({...form, apellido: e.target.value})} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: '#fff' }}
          />
          <input 
            placeholder="DNI" 
            value={form.dni}
            maxLength={8}
            minLength={8}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '')
              setForm({...form, dni: val})
            }} 
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: '#fff' }}
          />
          <input 
            placeholder="Teléfono" 
            type="tel"
            value={form.telefono}
            maxLength={12}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '')
              setForm({...form, telefono: val})
            }} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: '#fff' }}
          />
          <input 
            placeholder="Email" 
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} 
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: '#fff' }}
          />
          <input 
            type="date"
            value={form.fecha_nacimiento}
            onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} 
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#222', color: '#fff' }}
          />
          
          <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#444', color: '#fff', cursor: 'pointer' }}>
            Registrar Socio
          </button>
        </form>

        {/* Tabla de Socios */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #444' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e1e1e', color: '#fff', textAlign: 'center' }}>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Nombre</th>
              <th style={{ padding: '12px', border: '1px solid #444' }}>DNI</th>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Teléfono</th>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Plan Elegido</th>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '16px' }}>Cargando datos...</td>
              </tr>
            ) : socios.length > 0 ? (
              socios.map((s, idx) => {
                const socioId = s.id_socio || s.idSocio || s.IdSocio || s.id || idx
                const nombreCompleto = `${s.nombre || s.Nombre || ''} ${s.apellido || s.Apellido || ''}`.trim()
                const dniSocio = s.dni || s.Dni || s.DNI || '-'

                return (
                  <tr key={socioId} style={{ textAlign: 'center', borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>{nombreCompleto}</td>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>{dniSocio}</td>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>{obtenerTelefono(s)}</td>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>{obtenerEmail(s)}</td>
                    <td style={{ padding: '10px', border: '1px solid #444' }}><strong>{obtenerNombrePlan(s)}</strong></td>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => abrirEditar(s)}
                          style={{ backgroundColor: '#2196F3', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => abrirCambiarPlan(s)}
                          style={{ backgroundColor: '#FF9800', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Cambiar Plan
                        </button>
                        <button 
                          onClick={() => handleEliminar(socioId)}
                          style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
                  No hay socios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal Interactivo de Edición o Cambio de Plan */}
        {socioEditando && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{ background: '#222', color: '#fff', padding: '24px', borderRadius: '8px', minWidth: '340px', border: '1px solid #444' }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
                {modoEdicion === 'cambiar_plan' ? 'Cambiar Plan de Socio' : 'Editar Datos del Socio'}
              </h3>
              
              <form onSubmit={handleGuardarEdicion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {modoEdicion === 'editar' ? (
                  <>
                    <input 
                      placeholder="Nombre" 
                      value={socioEditando.nombre} 
                      onChange={e => setSocioEditando({...socioEditando, nombre: e.target.value})} 
                      required 
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                    />
                    <input 
                      placeholder="Apellido" 
                      value={socioEditando.apellido} 
                      onChange={e => setSocioEditando({...socioEditando, apellido: e.target.value})} 
                      required 
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                    />
                    <input 
                      placeholder="DNI" 
                      value={socioEditando.dni} 
                      maxLength={8}
                      minLength={8}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '')
                        setSocioEditando({...socioEditando, dni: val})
                      }} 
                      required 
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                    />
                    <input 
                      placeholder="Teléfono" 
                      value={socioEditando.telefono} 
                      maxLength={12}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '')
                        setSocioEditando({...socioEditando, telefono: val})
                      }} 
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                    />
                    <input 
                      placeholder="Email" 
                      type="email"
                      value={socioEditando.email} 
                      onChange={e => setSocioEditando({...socioEditando, email: e.target.value})} 
                      required
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                    />
                    <input 
                      type="date"
                      value={socioEditando.fecha_nacimiento} 
                      onChange={e => setSocioEditando({...socioEditando, fecha_nacimiento: e.target.value})} 
                      required
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                    />
                  </>
                ) : (
                  <>
                    <p style={{ margin: '0 0 10px 0', fontSize: '15px' }}>
                      Socio: <strong>{socioEditando.nombre} {socioEditando.apellido}</strong>
                    </p>
                    <label style={{ fontSize: '14px', color: '#bbb' }}>Seleccione el nuevo plan:</label>
                    <select 
                      value={socioEditando.id_plan} 
                      onChange={e => setSocioEditando({...socioEditando, id_plan: e.target.value})}
                      required
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                    >
                      <option value="">Seleccione Plan</option>
                      {planes.map(p => {
                        const planId = p.id_plan || p.idPlan || p.IdPlan || p.id
                        const nombrePlan = p.nombre || p.Nombre || p.descripcion || p.Descripcion || `Plan #${planId}`
                        const precioPlan = (p.precio !== undefined || p.Precio !== undefined) ? ` - $${p.precio ?? p.Precio}` : ''
                        return (
                          <option key={planId} value={planId}>
                            {nombrePlan}{precioPlan}
                          </option>
                        )
                      })}
                    </select>
                  </>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button type="submit" style={{ flex: 1, backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Guardar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setSocioEditando(null); setModoEdicion(''); }}
                    style={{ flex: 1, backgroundColor: '#666', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}