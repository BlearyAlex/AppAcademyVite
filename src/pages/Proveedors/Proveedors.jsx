import { useEffect, useState } from "react"

import Table from "../../components/Table"

import {
    Pencil,
    Trash,
    CirclePlus
} from "lucide-react"

import Breadcrumbs from "../../components/Breadcrumbs "

import Modal from "../../components/Modal"

import { useNavigate } from "react-router-dom"
import useStoreProvider from '../../store/useStoreProviders'

import useToastStore from "../../store/toastStore"

import toast from "react-hot-toast"

export default function Proveedors() {

    //! Params
    const navigate = useNavigate()

    //!Stores
    const { fetchProviders, providers, deleteProvider, loading, error } = useStoreProvider()
    console.log(providers)
    const { showToast } = useToastStore()

    //! EditProvider
    const handleEdit = (provider) => {
        console.log("marcas a editar:", provider)

        navigate(`/proveedores/edit/${provider.proveedorId}`)
    }

    const [open, setOpen] = useState(false);
    const [selectedProviderId, setSelectedProviderId] = useState(null);

    //! DeleteProduct
    const handleDelete = async (proveedorId) => {
        if (selectedProviderId) {
            toast.promise(
                deleteProvider(proveedorId),
                {
                    loading: 'Eliminando proveedor...',
                    success: () => {
                        showToast('Proveedor eliminado con éxito!', 'success');
                        navigate('/proveedores'); // Redirige a la lista de productos
                        fetchProviders()
                        return 'Proveedor eliminado con éxito!'; // Mensaje de éxito
                    },
                    error: (err) => {
                        showToast(err.message || 'No se pudo eliminar el proveedor.', 'error');
                        return err.message || 'No se pudo eliminar el proveedor.';
                    },
                }
            );

            setOpen(false);
        }
    }

    //! FetchsProviders
    useEffect(() => {
        fetchProviders()
    }, [fetchProviders])

    //!Columns
    const columns = [
        { header: "Nombre de Proveedor", accessorKey: "nombre" },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} data-tooltip-id="editTooltip" data-tooltip-content="Editar" className="px-2 py-1 text-indigo-500"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button
                        onClick={() => {
                            setSelectedProviderId(row.original.proveedorId);
                            setOpen(true);
                        }}
                        className="px-2 py-1 text-red-500"
                    >
                        <Trash size={20} strokeWidth={2.25} />
                    </button>
                </div>
            )
        }
    ];


    return (
        <div className="bg-gray-50 rounded-lg shadow-md p-4">
            <Breadcrumbs
                items={[
                    { label: 'Inicio', link: '/' },
                    { label: 'Proveedores', link: '/proveedores' }
                ]}
            />
            <Table
                data={providers}
                columns={columns}
                fetchProducts={fetchProviders}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Proveedor",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/proveedores/createproveedor",
                }}
                titles={{
                    title: "Proveedores",
                    subtitle: "Lista de todos los proveedores."
                }}
            />

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <Trash size={56} className="mx-auto text-red-500" />
                    <div className="mx-auto my-4 w-48">
                        <h3 className="text-lg font-black text-gray-800">Confirmar Eliminacion</h3>
                        <p className="text-sm text-gray-500">
                            Estas seguro de eliminar esta categoria?
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="w-full p-2 bg-red-100/60 text-red-500 rounded hover:bg-red-200 font-semibold transition duration-200"
                            onClick={() => handleDelete(selectedProviderId)}
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
