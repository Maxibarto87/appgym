import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5513/api', // Ajusta el puerto y la URL según tu backend
})

// === SOCIOS ===
export const getSocios = () => API.get('/Socios')
export const getSocioById = (id) => API.get(`/Socios/${id}`)
export const deleteSocio = (id) => API.delete(`/Socios/${id}`)

export const createSocio = (socio) => {
  const planIdNumerico = Number(socio.id_plan || socio.IdPlan || socio.planId || socio.idPlan || 0)

  return API.post('/Socios', {
    nombre: socio.nombre || socio.Nombre,
    apellido: socio.apellido || socio.Apellido,
    dni: socio.dni || socio.Dni || socio.DNI,
    tel: socio.tel || socio.telefono || socio.Telefono,
    email: socio.email || socio.Email || socio.mail || socio.Mail,
    fechaNacimiento: socio.fechaNacimiento || socio.fecha_nacimiento || socio.FechaNacimiento,
    id_plan: planIdNumerico,
    idPlan: planIdNumerico
  })
}

export const updateSocio = (id, socio) => {
  const planIdNumerico = Number(socio.id_plan || socio.IdPlan || socio.planId || socio.idPlan || 0)

  return API.put(`/Socios/${id}`, {
    nombre: socio.nombre || socio.Nombre,
    apellido: socio.apellido || socio.Apellido,
    dni: socio.dni || socio.Dni || socio.DNI,
    tel: socio.tel || socio.telefono || socio.Telefono,
    email: socio.email || socio.Email || socio.mail || socio.Mail,
    fechaNacimiento: socio.fechaNacimiento || socio.fecha_nacimiento || socio.FechaNacimiento,
    id_plan: planIdNumerico,
    idPlan: planIdNumerico
  })
}

// === PLANES ===
export const getPlanes = () => API.get('/Plans')
export const getPlanById = (id) => API.get(`/Plans/${id}`)
export const createPlan = (plan) => API.post('/Plans', plan)
export const deletePlan = (id) => API.delete(`/Plans/${id}`)

// === SOCIOS PLANES ===
export const getSociosPlanes = () => API.get('/SociosPlanes')

// === CUOTAS ===
export const getCuotas = () => API.get('/Cuotas')
export const getCuotaById = (id) => API.get(`/Cuotas/${id}`)
export const createCuota = (cuota) => API.post('/Cuotas', cuota)
export const updateCuota = (id, cuota) => API.put(`/Cuotas/${id}`, cuota)
export const deleteCuota = (id) => API.delete(`/Cuotas/${id}`)

// === CUOTAS PLANES ===
export const getCuotasPlanes = () => API.get('/CuotasPlanes')
export const createCuotaPlan = (cuotaPlan) => API.post('/CuotasPlanes', cuotaPlan)

// === PAGOS ===
export const getPagos = () => API.get('/Pagos')
export const getPagoById = (id) => API.get(`/Pagos/${id}`)
export const createPago = (pago) => API.post('/Pagos', pago)
export const registrarPago = (pago) => API.post('/Pagos', pago) // Alias por si lo usas con este nombre
export const updatePago = (id, pago) => API.put(`/Pagos/${id}`, pago)
export const deletePago = (id) => API.delete(`/Pagos/${id}`)

export default API