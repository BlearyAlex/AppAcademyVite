import Table from "../../components/Table"

import useStoreCliente from '../../store/useStoreClientes'

import {
    Pencil,
    Trash,
    Eye,
    CirclePlus
} from "lucide-react"

import Modal from "../../components/Modal"

import Breadcrumbs from "../../components/Breadcrumbs "

import { useNavigate } from "react-router-dom"

import { useEffect, useState } from "react"

import toast from "react-hot-toast"
import useToastStore from "../../store/toastStore"

import { formatearFechaHora } from "../../utils/formatearFechaHora"

export default function Clientes() {

    const { clientes, fetchClientes, loading, error, deleteCliente } = useStoreCliente();
    console.log(clientes)
    const { showToast } = useToastStore();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedClienteId, setSelectedClienteId] = useState(null);

    // Edit Cliente
    const handleEdit = (cliente) => {
        console.log(cliente)
        console.log("Navegando a editar cliente con ID:", cliente.clienteId);
        navigate(`/clientes/edit/${cliente.clienteId}`)
    }

    // ViewProduct
    const handleView = (cliente) => {
        navigate(`/clientes/view/${cliente.clienteId}`)
    }

    // DeleteProduct
    const handleDelete = async (clienteId) => {
        if (selectedClienteId) {
            toast.promise(
                deleteCliente(clienteId),
                {
                    loading: 'Eliminando cliente...',
                    success: () => {
                        // Aquí usamos el store de Zustand para mostrar el toast
                        showToast('Cliente eliminado con éxito!', 'success');
                        navigate('/clientes'); // Redirige a la lista de productos
                        fetchClientes()
                        return 'Cliente eliminado con éxito!'; // Mensaje de éxito
                    },
                    error: () => {
                        // También usamos el store de Zustand aquí
                        showToast('No se pudo eliminar el cliente.', 'error');
                        return 'No se pudo eliminar el cliente.'; // Mensaje de error
                    },

                }
            );
            setOpen(false);
        }
    }

    // FetchProducts
    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    const columns = [
        { header: "Nombre", accessorKey: "nombreCompleto" },
        { header: "Correo", accessorKey: "email" },
        {
            header: "Fecha de Registro",
            accessorKey: "fechaRegistro",
            cell: ({ getValue }) => {
                const fechaHora = formatearFechaHora(getValue());

                // Separar fecha y hora
                const [fecha, horaConAmPm] = fechaHora.split(', '); // Asegúrate de que esto coincida con el formato

                return (
                    <div className="px-2 py-0 rounded-lg bg-indigo-100/60 text-center font-semibold flex flex-col">
                        <span className="text-indigo-500 text uppercase">{horaConAmPm}</span>
                        <span className="text-indigo-500">{fecha}</span>
                    </div>
                );
            },
        },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} className="px-2 py-1 text-indigo-500"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button
                        onClick={() => {
                            setSelectedClienteId(row.original.clienteId);
                            setOpen(true);
                        }}
                        className="px-2 py-1 text-red-500"
                    >
                        <Trash size={20} strokeWidth={2.25} />
                    </button>
                    <button onClick={() => handleView(row.original)} className="px-2 py-1 text-emerald-500"><Eye size={20} strokeWidth={2.25} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 rounded-lg shadow-md p-4">
            <Breadcrumbs
                items={[
                    { label: 'Inicio', link: '/' },
                    { label: 'Clientes', link: '/clientes' }
                ]}
            />

            <Table
                data={clientes}
                columns={columns}
                fetchProducts={fetchClientes}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Cliente",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/clientes/createcliente",
                }}
                titles={{
                    title: "Clientes",
                    subtitle: "Lista de todos los clientes."
                }}
            />

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <Trash size={56} className="mx-auto text-red-500" />
                    <div className="mx-auto my-4 w-48">
                        <h3 className="text-lg font-black text-gray-800">Confirmar Eliminacion</h3>
                        <p className="text-sm text-gray-500">
                            Estas seguro de eliminar este cliente
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="w-full p-2 bg-red-100/60 text-red-500 rounded hover:bg-red-200 font-semibold transition duration-200"
                            onClick={() => handleDelete(selectedClienteId)}
                        >
                            Delete
                        </button>
                        <button
                            className="w-full p-2 bg-emerald-100/60 text-emerald-500 rounded hover:bg-emerald-200 font-semibold transition duration-200"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
