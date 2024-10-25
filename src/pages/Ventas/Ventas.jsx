import Table from "../../components/Table"

import {
    Pencil,
    Trash,
    Eye,
    CirclePlus
} from "lucide-react"

import useStoreVenta from '../../store/useStoreVentas'

import Modal from "../../components/Modal"

import Breadcrumbs from "../../components/Breadcrumbs "

import { useNavigate } from "react-router-dom"

import { useEffect, useState } from "react"

import toast from "react-hot-toast"
import useToastStore from "../../store/toastStore"

import { formatearFechaHora } from "../../utils/formatearFechaHora"
import useStoreCliente from "../../store/useStoreClientes"

export default function Ventas() {

    const { ventas, fetchVentas, loading, error, deleteVenta } = useStoreVenta();
    console.log(ventas)
    const { clientes, fetchClientes } = useStoreCliente();
    console.log(clientes)
    const { showToast } = useToastStore();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedVentaId, setSelectedVentaId] = useState(null);

    // Edit Cliente
    const handleEdit = (venta) => {
        console.log(venta)
        console.log("Navegando a editar cliente con ID:", venta.ventaId);
        navigate(`/ventas/edit/${venta.ventaId}`)
    }

    // ViewProduct
    const handleView = (venta) => {
        navigate(`/ventas/view/${venta.ventaId}`)
    }


    // DeleteProduct
    const handleDelete = async (ventaId) => {
        if (selectedVentaId) {
            toast.promise(
                deleteVenta(ventaId),
                {
                    loading: 'Eliminando venta...',
                    success: () => {
                        // Aquí usamos el store de Zustand para mostrar el toast
                        showToast('Venta eliminado con éxito!', 'success');
                        navigate('/ventas'); // Redirige a la lista de productos
                        fetchClientes()
                        return 'Venta eliminado con éxito!'; // Mensaje de éxito
                    },
                    error: () => {
                        // También usamos el store de Zustand aquí
                        showToast('No se pudo eliminar la venta.', 'error');
                        return 'No se pudo eliminar la venta.'; // Mensaje de error
                    },

                }
            );
            setOpen(false);
        }
    }


    // GetNombreCliente
    const getClienteName = (clienteId) => {
        const cliente = clientes.find(cliente => cliente.clienteId === clienteId);
        return cliente ? cliente.nombreCompleto : 'Desconocido';
    }

    // FetchProducts
    useEffect(() => {
        fetchVentas();
    }, [fetchVentas]);

    // FetcClientes
    useEffect(() => {
        fetchClientes()
    }, [fetchClientes])

    const columns = [
        {
            header: "Cliente",
            accessorKey: "clienteId",
            cell: ({ getValue }) => getClienteName(getValue())
        },
        { header: "Estado de Venta", accessorKey: "estadoVenta" },
        { header: "Monto Total", accessorKey: "monto" },
        {
            header: "Fecha de Venta",
            accessorKey: "fechaCompra",
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
                            setSelectedVentaId(row.original.ventaId);
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
                data={ventas}
                columns={columns}
                fetchProducts={fetchClientes}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Venta",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/ventas/createventa",
                }}
                titles={{
                    title: "Ventas",
                    subtitle: "Lista de todas las ventas."
                }}
            />

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <Trash size={56} className="mx-auto text-red-500" />
                    <div className="mx-auto my-4 w-48">
                        <h3 className="text-lg font-black text-gray-800">Confirmar Eliminacion</h3>
                        <p className="text-sm text-gray-500">
                            Estas seguro de eliminar esta venta
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="w-full p-2 bg-red-100/60 text-red-500 rounded hover:bg-red-200 font-semibold transition duration-200"
                            onClick={() => handleDelete(selectedVentaId)}
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
