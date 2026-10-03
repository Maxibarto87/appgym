import { useState, useEffect } from 'react'
import { getSocios, getCuotas, getPagos, registrarPago } from '../services/api'

export default function PagosPage() {
  const [socios, setSocios] = useState([])
  const [todasLasCuotas, setTodasLasCuotas] = useState([])
  const [todosLosPagos, setTodosLosPagos] = useState([])

  const [pago, setPago] = useState({
    idSocio: '',
    idCuota: '',
    idMetodo: '1', // Por defecto 1 (Efectivo)
    importe: ''
  })

  // Cargar datos iniciales
  const cargarDatos = async () => {
    try {
      const [resSocios, resCuotas, resPagos] = await Promise.all([
        getSocios(),
        getCuotas(),
        getPagos()
      ])
      setSocios(resSocios.data || resSocios || [])
      setTodasLasCuotas(resCuotas.data || resCuotas || [])
      setTodosLosPagos(resPagos.data || resPagos || [])
    } catch (err) {
      console.error('Error al cargar datos:', err)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // Al seleccionar cuota, auto-completar importe sugerido (Debe)
  const handleCuotaChange = (e) => {
    const idC = parseInt(e.target.value, 10)
    const cuotaSel = todasLasCuotas.find(c => (c.idCuota || c.id_Cuota || c.IdCuota || c.id) === idC)
    
    // Calcular cuánto se ha pagado de esta cuota (Haber)
    const pagadoHastaAhora = todosLosPagos
      .filter(p => (p.idCuota || p.id_Cuota || p.IdCuota) === idC)
      .reduce((acc, curr) => acc + (curr.importe || curr.Importe || 0), 0)

    const debe = cuotaSel ? (cuotaSel.precio || cuotaSel.Precio || 0) : 0
    const saldoPendiente = debe - pagadoHastaAhora

    setPago({
      ...pago,
      idCuota: idC,
      importe: saldoPendiente > 0 ? saldoPendiente : ''
    })
  }

  const handleSocioChange = (e) => {
    const idSocio = e.target.value
    setPago({ ...pago, idSocio, idCuota: '', importe: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Estructura adaptada enviando id_Metodo entero requerido por C# y SQL Server
    const pagoAEnviar = {
      id_socio: parseInt(pago.idSocio, 10),
      id_Cuota: parseInt(pago.idCuota, 10),
      id_Metodo: parseInt(pago.idMetodo, 10) || 1, // Se envía el ID numérico
      importe: parseFloat(pago.importe),
      fecha: new Date().toISOString()
    }

    registrarPago(pagoAEnviar)
      .then(() => {
        alert('¡Pago registrado con éxito!')
        setPago({ idSocio: pago.idSocio, idCuota: '', idMetodo: '1', importe: '' })
        cargarDatos()
      })
      .catch(err => {
        console.error('Error detallado al registrar pago:', err.response?.data || err)
        const detalleError = err.response?.data || err.message || 'Error interno del servidor'
        alert(`Error al registrar el pago: ${typeof detalleError === 'string' ? detalleError : JSON.stringify(detalleError)}`)
      })
  }

  // Filtrar cuotas del socio seleccionado
  const cuotasDelSocio = todasLasCuotas.filter(
    c => (c.idSocio || c.id_socio || c.IdSocio) === parseInt(pago.idSocio, 10)
  )

  // Calcular Debe, Haber y Estado para cada cuota del socio seleccionado
  const estadoCuotasSocio = cuotasDelSocio.map(c => {
    const idC = c.idCuota || c.id_Cuota || c.IdCuota || c.id
    const debe = c.precio || c.Precio || 0
    const haber = todosLosPagos
      .filter(p => (p.idCuota || p.id_Cuota || p.IdCuota) === idC)
      .reduce((acc, curr) => acc + (curr.importe || curr.Importe || 0), 0)
    const saldo = debe - haber

    return {
      ...c,
      debe,
      haber,
      saldo,
      estado: saldo <= 0 ? 'PAGADO' : haber > 0 ? 'PARCIAL' : 'PENDIENTE'
    }
  })

  // Cuotas pendientes para el dropdown
  const cuotasPendientes = estadoCuotasSocio.filter(c => c.saldo > 0)

  return (
    <div style={{ textAlign: 'left', padding: '20px' }}>
      <h2>💵 Registrar Cobro / Pago</h2>

      {/* FORMULARIO DE REGISTRO */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px', background: '#222', padding: '15px', borderRadius: '8px' }}>
        
        {/* Socio */}
        <select value={pago.idSocio} onChange={handleSocioChange} required style={{ padding: '8px' }}>
          <option value="" disabled>Seleccione Socio</option>
          {socios.map(s => {
            const id = s.idSocio || s.id_socio || s.id || s.IdSocio
            return (
              <option key={id} value={id}>
                {s.nombre || s.Nombre} {s.apellido || s.Apellido}
              </option>
            )
          })}
        </select>

        {/* Cuota Pendiente */}
        <select value={pago.idCuota} onChange={handleCuotaChange} required disabled={!pago.idSocio} style={{ padding: '8px' }}>
          <option value="" disabled>
            {!pago.idSocio ? 'Primero seleccione un socio' : cuotasPendientes.length === 0 ? 'No tiene cuotas pendientes' : 'Seleccione Cuota Pendiente'}
          </option>
          {cuotasPendientes.map(c => {
            const idC = c.idCuota || c.id_Cuota || c.IdCuota || c.id
            const fechaVenc = c.vencimiento || c.Vencimiento ? new Date(c.vencimiento || c.Vencimiento).toLocaleDateString() : '-'
            return (
              <option key={idC} value={idC}>
                Mes {c.mes || c.Mes} - Venc: {fechaVenc} (Resta: ${c.saldo})
              </option>
            )
          })}
        </select>

        {/* Método de Pago (Desplegable con ID numérico) */}
        <select 
          value={pago.idMetodo} 
          onChange={e => setPago({ ...pago, idMetodo: e.target.value })} 
          required 
          style={{ padding: '8px', minWidth: '180px' }}
        >
          <option value="1">Efectivo</option>
          <option value="2">Transferencia</option>
          <option value="3">Débito / Crédito</option>
        </select>

        {/* Importe */}
        <input 
          type="number" 
          step="0.01" 
          placeholder="Monto Importe" 
          value={pago.importe} 
          onChange={e => setPago({ ...pago, importe: e.target.value })} 
          required 
          style={{ padding: '8px', width: '130px' }}
        />

        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Confirmar Cobro
        </button>
      </form>

      {/* ESTADO DE CUOTAS DEL SOCIO SELECCIONADO */}
      {pago.idSocio && (
        <div style={{ marginBottom: '30px' }}>
          <h3>📋 Estado de Cuenta del Socio (Debe / Haber)</h3>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1e1e1e', color: '#fff' }}>
            <thead>
              <tr style={{ background: '#333' }}>
                <th>N° Cuota</th>
                <th>Mes</th>
                <th>Vencimiento</th>
                <th>Debe (Total Cuota)</th>
                <th>Haber (Pagado)</th>
                <th>Saldo Pendiente</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {estadoCuotasSocio.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>El socio no tiene cuotas generadas.</td>
                </tr>
              ) : (
                estadoCuotasSocio.map(c => {
                  const idC = c.idCuota || c.id_Cuota || c.IdCuota || c.id
                  return (
                    <tr key={idC}>
                      <td>{idC}</td>
                      <td>Mes {c.mes || c.Mes}</td>
                      <td>{c.vencimiento || c.Vencimiento ? new Date(c.vencimiento || c.Vencimiento).toLocaleDateString() : '-'}</td>
                      <td style={{ color: '#ff6b6b' }}>${c.debe}</td>
                      <td style={{ color: '#51cf66' }}>${c.haber}</td>
                      <td><strong>${c.saldo}</strong></td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: c.estado === 'PAGADO' ? '#2b8a3e' : c.estado === 'PARCIAL' ? '#e67e22' : '#c92a2a',
                          color: '#fff'
                        }}>
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* HISTORIAL GENERAL DE PAGOS */}
      <div>
        <h3>📜 Historial Reciente de Pagos Realizados</h3>
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#333', color: '#fff' }}>
              <th>ID Pago</th>
              <th>Socio</th>
              <th>N° Cuota</th>
              <th>Método de Pago</th>
              <th>Importe</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {todosLosPagos.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No hay registros de pagos.</td>
              </tr>
            ) : (
              todosLosPagos.map((p, idx) => {
                const socioObj = socios.find(s => (s.idSocio || s.id_socio || s.id || s.IdSocio) === (p.idSocio || p.id_socio || p.IdSocio))

                return (
                  <tr key={p.idPago || p.id_pago || p.IdPago || idx}>
                    <td>{p.idPago || p.id_pago || p.IdPago || idx + 1}</td>
                    <td>{socioObj ? `${socioObj.nombre || socioObj.Nombre} ${socioObj.apellido || socioObj.Apellido}` : `Socio #${p.idSocio || p.id_socio || p.IdSocio}`}</td>
                    <td>Cuota #{p.idCuota || p.id_Cuota || p.IdCuota}</td>
                    <td>{p.metodo || p.formaPago || p.Metodo || p.FormaPago || (p.id_Metodo === 1 ? 'Efectivo' : p.id_Metodo === 2 ? 'Transferencia' : 'Tarjeta')}</td>
                    <td style={{ color: '#51cf66', fontWeight: 'bold' }}>${p.importe || p.Importe}</td>
                    <td>{p.fecha || p.Fecha ? new Date(p.fecha || p.Fecha).toLocaleDateString() : 'Reciente'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}