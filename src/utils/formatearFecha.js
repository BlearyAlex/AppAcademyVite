export const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);

    // Opciones para mostrar la fecha en formato "2 de julio de 1999"
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return fecha.toLocaleString('es-MX', opciones);
};
