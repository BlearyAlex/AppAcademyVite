import { useEffect } from "react"

import Table from "../../components/Table"

import {
    Pencil,
    Trash,
    CirclePlus
} from "lucide-react"

import Breadcrumbs from "../../components/Breadcrumbs "

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


    //! DeleteProduct
    const handleDelete = async (proveedorId) => {
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
    }

    //! FetchsProviders
    useEffect(() => {
        fetchProviders()
    }, [fetchProviders])

    //!Columns
    const columns = [
        { header: "ID", accessorKey: "proveedorId" },
        { header: "Nombre de Proveedor", accessorKey: "nombre" },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} data-tooltip-id="editTooltip" data-tooltip-content="Editar" className="px-2 py-1 text-indigo-500"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button onClick={() => handleDelete(row.original.proveedorId)} data-tooltip-id="deleteTooltip" data-tooltip-content="Eliminar" className="px-2 py-1 text-red-500"><Trash size={20} strokeWidth={2.5} /></button>
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
        </div>
    )

}
