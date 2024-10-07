import { useEffect } from "react"

import Table from "../../components/Table"

import useStoreBrand from "../../store/useStoreBrands"

import {
    Pencil,
    Trash,
    CirclePlus
} from "lucide-react"

import Breadcrumbs from "../../components/Breadcrumbs "

import { useNavigate } from "react-router-dom"
import useToastStore from "../../store/toastStore"

import toast from "react-hot-toast"

export default function Brands() {

    const navigate = useNavigate()

    const { brands, fetchBrands, loading, error, deleteBrand } = useStoreBrand()
    const { showToast } = useToastStore()

    //! EditProduct
    const handleEdit = (marca) => {
        console.log("marcas a editar:", marca)

        navigate(`/marcas/edit/${marca.marcaId}`)
    }

    //! DeleteProduct
    const handleDelete = async (marcaId) => {
        toast.promise(
            deleteBrand(marcaId),
            {
                loading: 'Eliminando marca...',
                success: () => {
                    // Aquí usamos el store de Zustand para mostrar el toast
                    showToast('Marca eliminado con éxito!', 'success');
                    navigate('/marcas'); // Redirige a la lista de productos
                    fetchBrands()
                    return 'Marca eliminado con éxito!'; // Mensaje de éxito
                },
                error: () => {
                    // También usamos el store de Zustand aquí
                    showToast('No se pudo eliminar la marca.', 'error');
                    return 'No se pudo eliminar la marca.'; // Mensaje de error
                },

            }
        );
    }

    //! FetchProducts
    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const columns = [
        { header: "ID", accessorKey: "marcaId" },
        { header: "Nombre de Categoria", accessorKey: "nombre" },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} data-tooltip-id="editTooltip" data-tooltip-content="Editar" className="px-2 py-1 text-indigo-500"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button onClick={() => handleDelete(row.original.marcaId)} data-tooltip-id="deleteTooltip" data-tooltip-content="Eliminar" className="px-2 py-1 text-red-500"><Trash size={20} strokeWidth={2.5} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 rounded-lg shadow-md p-4">
            <Breadcrumbs
                items={[
                    { label: 'Inicio', link: '/' },
                    { label: 'Marcas', link: '/marcas' }
                ]}
            />
            <Table
                data={brands}
                columns={columns}
                fetchProducts={fetchBrands}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Marca",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/marcas/createmarca",
                }}
                titles={{
                    title: "Marcas",
                    subtitle: "Lista de todos las marcas."
                }}
            />
        </div>
    )
}
