import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useParams } from "react-router-dom";

import { WholeWord, House, Mail, Calendar, Phone } from "lucide-react";

import useStoreStudent from '../../store/useStoreStudents'
import { formatearFechaHora } from "../../utils/formatearFechaHora";
import { formatearFecha } from "../../utils/formatearFecha";

// Yup
const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
    apellido: yup.string().required("El apellido es obligatorio."),
    telefono: yup.string()
        .required("El teléfono es obligatorio."),
    estadoEstudiante: yup.number()
        .oneOf([0, 1], "El estado es obligatorio"),
});

export default function ViewStudent() {

    const { studentId } = useParams();
    const { student, fetchStudentWithColegiaturas, loading } = useStoreStudent();

    // React-hook-form
    const { reset } = useForm({
        resolver: yupResolver(schema),
    })

    // UseEffect
    useEffect(() => {
        if (fetchStudentWithColegiaturas) {
            console.log("Fetching student with ID:", studentId);
            fetchStudentWithColegiaturas(studentId)
        }
    }, [studentId, fetchStudentWithColegiaturas]);

    useEffect(() => {
        if (student) {
            reset(student)
        }
    }, [student, reset])

    // Formatear Fecha y Hora
    const fecha = formatearFecha(student?.fechaNacimiento)
    const fechaHora = formatearFechaHora(student?.colegiaturas.fechaPago)

    if (loading) return <p>Cargando...</p>;

    if (!student) return <p>Estudiante no encontrado</p>;

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Estudiantes', link: '/estudiantes' },
                        { label: 'Ver Estudiante', link: '' }
                    ]}
                />
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Detalles del Estudiante</h2>
                </div>

                {/* from */}
                <div className="bg-white mt-6 grid grid-cols-2 items-start gap-4 rounded-lg shadow-md">
                    <div className="flex p-10">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <WholeWord size={20} />
                                            </span>
                                            Nombre
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{student.nombre}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <WholeWord size={20} />
                                            </span>
                                            Apellido
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{student.apellido}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <House size={20} />
                                            </span>
                                            Direccion
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{student.direccion}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <Mail size={20} />
                                            </span>
                                            Correo
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{student.correo ? student.correo : "No tiene correo"}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <Calendar size={20} />
                                            </span>
                                            Fecha Nacimiento
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{fecha}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <Phone size={20} />
                                            </span>
                                            Telefono
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{student.telefono}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className="w-full h-64 overflow-hidden rounded-lg flex items-center justify-center pt-10">
                        <img
                            src={student.imageUrl
                                ? `http://localhost:8080${student.imageUrl}`
                                : '/imagen.png'} // Imagen predeterminada
                            alt="Producto"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                // Fallback en caso de error cargando la imagen
                                e.target.onerror = null;
                                e.target.src = '/imagen.png';
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-center bg-white mt-6 rounded-lg shadow-md p-10">
                    <table className="w-full text-center items-center">
                        <thead>
                            <tr className="bg-gray-100 text-[#6c7592]">
                                <th>Mes</th>
                                <th>Estado Colegiatura</th>
                                <th>Fecha de Pago</th>
                                <th>Monto Total</th>
                                <th>Saldo Pendiente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.colegiaturas && student.colegiaturas.length > 0 ? (
                                student.colegiaturas.map((colegiatura) => {
                                    const { mes, estadoColegiatura, montoTotal, saldoPendiente, fechaPago } = colegiatura;

                                    // Lógica para manejar el mes y las clases dinámicamente
                                    let mesClass = '';
                                    switch (mes) {
                                        case "Enero":
                                            mesClass = "bg-emerald-100/60 text-emerald-500";
                                            break;
                                        case "Febrero":
                                            mesClass = "bg-yellow-100/60 text-yellow-500";
                                            break;
                                        case "Marzo":
                                            mesClass = "bg-red-100/60 text-red-500";
                                            break;
                                        case "Abril":
                                            mesClass = "bg-pink-100/60 text-pink-500";
                                            break;
                                        case "Mayo":
                                            mesClass = "bg-rose-100/60 text-rose-500";
                                            break;
                                        case "Junio":
                                            mesClass = "bg-fuchsia-100/60 text-fuchsia-500";
                                            break;
                                        case "Julio":
                                            mesClass = "bg-purple-100/60 text-purple-500";
                                            break;
                                        case "Agosto":
                                            mesClass = "bg-violet-100/60 text-violet-500";
                                            break;
                                        case "Septiembre":
                                            mesClass = "bg-indigo-100/60 text-indigo-500";
                                            break;
                                        case "Octubre":
                                            mesClass = "bg-blue-100/60 text-blue-500";
                                            break;
                                        case "Noviembre":
                                            mesClass = "bg-sky-100/60 text-sky-500";
                                            break;
                                        case "Diciembre":
                                            mesClass = "bg-cyan-100/60 text-cyan-500";
                                            break;
                                        default:
                                            mesClass = "bg-gray-100/60 text-gray-500"; // Color por defecto
                                    }

                                    // Lógica para manejar el estado de la colegiatura
                                    let estadoClass = '';
                                    switch (estadoColegiatura) {
                                        case "Pendiente":
                                            estadoClass = "bg-orange-100/60 text-orange-500";
                                            break;
                                        case "Pagado":
                                            estadoClass = "bg-emerald-100/60 text-emerald-500";
                                            break;
                                        case "Vencido":
                                            estadoClass = "bg-red-100/60 text-red-500";
                                            break;
                                        default:
                                            estadoClass = "bg-gray-100/60 text-gray-500"; // Color por defecto
                                    }

                                    // Formatear la fecha de pago
                                    const fechaHora = new Date(fechaPago).toLocaleDateString();

                                    return (
                                        <tr key={colegiatura.colegiaturaId}>
                                            <td className="border px-4 py-2">
                                                <span className={`font-semibold px-2 py-0 rounded-lg items-center ${mesClass}`}>
                                                    {mes}
                                                </span>
                                            </td>
                                            <td className="border px-4 py-2">
                                                <span className={`font-semibold px-2 py-0 rounded-lg items-center ${estadoClass}`}>
                                                    {estadoColegiatura}
                                                </span>
                                            </td>
                                            <td className="border px-4 py-2">{fechaHora}</td>
                                            <td className="border px-4 py-2">${montoTotal.toFixed(2)}</td>
                                            <td className="border px-4 py-2 font-semibold">${saldoPendiente.toFixed(2)}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="border px-4 py-2 text-center">No hay colegiaturas disponibles</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}
