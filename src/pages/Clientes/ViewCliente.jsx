import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useParams } from "react-router-dom";

import { WholeWord, House, Mail, Calendar, Phone } from "lucide-react";

import useStoreCliente from "../../store/useStoreClientes";
import { formatearFechaHora } from "../../utils/formatearFechaHora";

// Yup
const schema = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre es obligatorio."),
    email: yup.string().email("El correo no es valido."),
    telefono: yup.string().required("El teléfono es obligatorio."),
    direccion: yup.string(),
});

export default function ViewCliente() {

    const { clienteId } = useParams()

    const cliente = useStoreCliente((state) => state.cliente);
    const fetchClienteById = useStoreCliente((state) => state.fetchClienteById);
    const loading = useStoreCliente((state) => state.loading);

    // React-hook-form
    const { reset } = useForm({
        resolver: yupResolver(schema),
    })

    // UseEffect
    useEffect(() => {
        if (fetchClienteById) {
            console.log("Fetching product with ID:", clienteId);
            fetchClienteById(clienteId)
        }
    }, [clienteId, fetchClienteById]);

    useEffect(() => {
        if (cliente) {
            reset(cliente)
        }
    }, [cliente, reset])

    // Formatear Fecha y Hora
    const fechaHora = formatearFechaHora(cliente.fechaRegistro);


    if (loading) return <p>Cargando...</p>;

    if (!cliente) return <p>Producto no encontrado</p>;

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Clientes', link: '/clientes' },
                        { label: 'Ver Cliente', link: '' }
                    ]}
                />
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Detalles de Cliente</h2>
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
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{cliente.nombreCompleto}</td>
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
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{cliente.direccion}</td>
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
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{cliente.email}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <Calendar size={20} />
                                            </span>
                                            Fecha Registro
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{fechaHora}</td>
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
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{cliente.telefono}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h1>Image</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
