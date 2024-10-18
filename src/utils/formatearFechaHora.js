export const formatearFechaHora = (fechaISO) => {
    const fecha = new Date(fechaISO);

    const opciones = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return fecha.toLocaleString('es-MX', opciones);

};