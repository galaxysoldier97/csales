import Swal from 'sweetalert2'

export async function handleActionResult(actionResult, options) {
  const { ok, mensaje } = actionResult
  if (!ok) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    })
  } else {
    await Swal.fire({
      icon: 'success',
      title: 'Cambio Exitoso',
      ...options
    })
  }
}
