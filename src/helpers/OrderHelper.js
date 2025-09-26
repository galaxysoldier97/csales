
export const getStatusOrder = (status) => {
    switch (status) { 
        case '6003':
            return 'Inicio';
        case '6004':
            return 'Propuesta enviada';
        case '6005':
            return 'Esperando por cliente';
        case '6006':
            return 'Orden aprobada';
        case '6007':
            return 'Esperando pago';
        case '6008':
            return 'Procesando';
        case '6009':
            return 'Orden completada';
        case '6010':
            return 'Orden cancelada';
        case '6011':
            return 'Error';
        case '6225':
            return 'Propuesta rechazada';
        case '6226':
            return 'Propuesta vencida';
        case '6325':
            return 'Esperando firma';
        case '6865':
            return 'Sin serie numerica';
        case '6187':
            return 'Agendar visita';
        case '6188':
            return 'Visita agendada';
        case '6265':
            return 'Pendiente de firma';
        default:
            return ''; 
}
}