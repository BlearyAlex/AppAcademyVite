import Table from "../../components/Table"

import useStoreEntrada from "../../store/useStoreEntradas"

import { Pencil, Trash, Eye, CirclePlus } from "lucide-react"

import Modal from "../../components/Modal"

import Breadcrumbs from "../../components/Breadcrumbs "

import { useNavigate } from "react-router-dom"

import { useEffect, useState } from "react"

import toast from "react-hot-toast"
import useToastStore from "../../store/toastStore"

import { formatearFechaHora } from '../../utils/formatearFechaHora.js'

export default function Entradas() {

    const { entradas, fetchEntradas, loading, fetchError, deleteEntrada } = useStoreEntrada();
    const { showToast } = useToastStore();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedEntradaId, setSelectedEntradaId] = useState(null);

    // Edit Entrada
    const handleEdit = (entrada) => {
        console.log("Entrada a editar:", entrada)

        navigate(`/entradas/edit/${entrada.entradaId}`)
    }

    // View Entrada
    const handleView = (entrada) => {
        console.log("Entradas a ver:", entrada)

        navigate(`/entradas/view/${entrada.entradaId}`)
    }

    // Delete Entrada
    const handleDelete = async (entradaId) => {
        console.log(entradaId)
        if (selectedEntradaId) {
            toast.promise(
                deleteEntrada(entradaId),
                {
                    loading: 'Eliminando entrada...',
                    success: () => {
                        // Aquí usamos el store de Zustand para mostrar el toast
                        showToast('Entrada eliminado con éxito!', 'success');
                        navigate('/entradas'); // Redirige a la lista de productos
                        fetchEntradas()
                        return 'Entrada eliminado con éxito!'; // Mensaje de éxito
                    },
                    error: () => {
                        // También usamos el store de Zustand aquí
                        showToast('No se pudo eliminar la entrada.', 'error');
                        return 'No se pudo eliminar la entrada.'; // Mensaje de error
                    },

                }
            );
            setOpen(false);
        }
    }

    // Fetch Entradas
    useEffect(() => {
        fetchEntradas();
    }, [fetchEntradas]);

    const columns = [
        { header: "Folio", accessorKey: "folio" },
        { header: "Total Productos", accessorKey: "totalProductosEntrada" },
        {
            header: "Fecha de Emision",
            accessorKey: "fechaDeEmision",
            cell: ({ getValue }) => {
                const fechaHora = formatearFechaHora(getValue());

                // Separar fecha y hora
                const [fecha, horaConAmPm] = fechaHora.split(', '); // Asegúrate de que esto coincida con el formato

                return (
                    <div className="px-2 py-0 rounded-lg bg-fuchsia-100/60 text-center font-semibold flex flex-col">
                        <span className="text-fuchsia-500 text uppercase">{horaConAmPm}</span>
                        <span className="text-fuchsia-500">{fecha}</span>
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
                            setSelectedEntradaId(row.original.entradaId);
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
                    { label: 'Entradas', link: '/entradas' }
                ]}
            />

            <Table
                data={entradas}
                columns={columns}
                fetchProducts={fetchEntradas}
                loading={loading}
                error={fetchError}
                actionButton={{
                    label: "Crear Entrada",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/entradas/createentrada",
                }}
                titles={{
                    title: "Entradas",
                    subtitle: "Lista de todos las entradas."
                }}
            />

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <Trash size={56} className="mx-auto text-red-500" />
                    <div className="mx-auto my-4 w-48">
                        <h3 className="text-lg font-black text-gray-800">Confirmar Eliminacion</h3>
                        <p className="text-sm text-gray-500">
                            Estas seguro de eliminar esta entrada?
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="w-full p-2 bg-red-100/60 text-red-500 rounded hover:bg-red-200 font-semibold transition duration-200"
                            onClick={() => handleDelete(selectedEntradaId)}
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
