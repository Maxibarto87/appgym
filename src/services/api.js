import axios from 'axios'

// URL Base apuntando a tu puerto 5513
const API = axios.create({
  baseURL: 'http://localhost:5513/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && token !== 'sesion_activa') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// === USUARIOS Y AUTH ===
export const getUsuarios = () => API.get('/usuarios')
export const getUsuarioById = (id) => API.get(`/usuarios/${id}`)

export const registrarUsuario = (usuario) => API.post('/usuarios', {
  nombre: usuario.nombre || usuario.Nombre,
  clave: usuario.clave || usuario.Clave,
  Nombre: usuario.nombre || usuario.Nombre,
  Clave: usuario.clave || usuario.Clave
})

export const loginUsuario = (credenciales) => API.post('/Auth/login', credenciales)

// === SOCIOS ===
export const getSocios = () => API.get('/Socios')
export const getSocioById = (id) => API.get(`/Socios/${id}`)

export const createSocio = (socio) => {
  const planIdNumerico = Number(socio.id_plan || socio.IdPlan || socio.planId || 0)

  return API.post('/Socios', {
    nombre: socio.nombre || socio.Nombre,
    apellido: socio.apellido || socio.Apellido,
    dni: socio.dni || socio.Dni,
    tel: socio.tel || socio.telefono || socio.Telefono,
    telefono: socio.tel || socio.telefono || socio.Telefono,
    
    // Enviamos id_plan en snake_case para que coincida con la columna 'id_plan' de SQL Server
    id_plan: planIdNumerico,
    idPlan: planIdNumerico,
    IdPlan: planIdNumerico
  })
}

export const updateSocio = (id, socio) => API.put(`/Socios/${id}`, socio)
export const deleteSocio = (id) => API.delete(`/Socios/${id}`)

// === PLANES ===
export const getPlanes = () => API.get('/Plan')
export const getPlanById = (id) => API.get(`/Plan/${id}`)
export const createPlan = (plan) => API.post('/Plan', plan)
export const updatePlan = (id, plan) => API.put(`/Plan/${id}`, plan)
export const deletePlan = (id) => API.delete(`/Plan/${id}`)

// === CUOTAS ===
export const getCuotas = () => API.get('/Cuotas')
export const getCuotaById = (id) => API.get(`/Cuotas/${id}`)

export const createCuota = (cuota) => API.post('/Cuotas', {
  id_socio: Number(cuota.idSocio || cuota.IdSocio || cuota.id_socio),
  idSocio: Number(cuota.idSocio || cuota.IdSocio || cuota.id_socio),
  IdSocio: Number(cuota.idSocio || cuota.IdSocio || cuota.id_socio),
  monto: Number(cuota.monto || cuota.Monto),
  Monto: Number(cuota.monto || cuota.Monto),
  fechaVencimiento: cuota.fechaVencimiento || cuota.FechaVencimiento || new Date().toISOString()
})

export const updateCuota = (id, cuota) => API.put(`/Cuotas/${id}`, cuota)
export const deleteCuota = (id) => API.delete(`/Cuotas/${id}`)

// === PAGOS ===
export const getPagos = () => API.get('/Pagos')
export const getPagoById = (id) => API.get(`/Pagos/${id}`)
export const createPago = (pago) => API.post('/Pagos', pago)
export const registrarPago = (pago) => API.post('/Pagos', pago)
export const updatePago = (id, pago) => API.put(`/Pagos/${id}`, pago)
export const deletePago = (id) => API.delete(`/Pagos/${id}`)

// === METODOS DE PAGO ===
export const getMetodos = () => API.get('/Metodos') // Corregido a plural para que coincida con MetodosController
export const getMetodoById = (id) => API.get(`/Metodos/${id}`)

// === RELACIONES ===
export const getSociosPlanesBySocio = (idSocio) => API.get(`/SociosPlanes/socio/${idSocio}`)
export const getCuotasPlanes = () => API.get('/CuotasPlanes')

export default API