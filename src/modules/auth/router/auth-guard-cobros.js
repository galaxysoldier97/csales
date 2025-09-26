
import {AuthStore} from '@/stores/AuthStore'


const isAuthenticatedGuardCobros = async( to, from, next ) => {
    const { checkAuth } = AuthStore() 
    const { ok,rol } =  await checkAuth()

    if ( ( ok ) && (rol=='Cobros')) next()
    else {
        window.location.href = 'https://192.168.231.176/portalco/index.php/viewapp/';
    }
}

export default isAuthenticatedGuardCobros