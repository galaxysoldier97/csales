import {AuthStore} from '@/stores/AuthStore'
 
const isAuthenticatedGuard = async( to, from, next ) => {
    const { checkAuth } = AuthStore() 
    const { ok } =  await checkAuth()
 

    if ( ok ) {
        next()
    } else {
        next({ name: 'login' }) // Redirigir al usuario a la ruta de login
    }
}

export default isAuthenticatedGuard