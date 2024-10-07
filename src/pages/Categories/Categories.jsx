import { useEffect } from "react"

import Table from "../../components/Table"

import {
    Pencil,
    Trash,
    CirclePlus
} from "lucide-react"

import Breadcrumbs from "../../components/Breadcrumbs "

import { useNavigate } from "react-router-dom"

import useStoreCategory from "../../store/useStoreCategories"

import useToastStore from "../../store/toastStore"

import toast from "react-hot-toast"

export default function Categories() {

    //! Params
    const navigate = useNavigate()

    //!Stores
    const { fetchCategories, categories, deleteCategory, loading, error } = useStoreCategory()
    console.log(categories)
    const { showToast } = useToastStore()

    //! EditProvider
    const handleEdit = (category) => {
        console.log("marcas a editar:", category)

        navigate(`/categorias/edit/${category.categoriaId}`)
    }


    //! DeleteProduct
    const handleDelete = async (categoriaId) => {
        toast.promise(
            deleteCategory(categoriaId),
            {
                loading: 'Eliminando categoria...',
                success: () => {
                    showToast('Categoria eliminado con éxito!', 'success');
                    navigate('/categorias'); // Redirige a la lista de productos
                    fetchCategories()
                    return 'Categoria eliminado con éxito!'; // Mensaje de éxito
                },
                error: (err) => {
                    showToast(err.message || 'No se pudo eliminar la categoria.', 'error');
                    return err.message || 'No se pudo eliminar la categoria.';
                },

            }
        );
    }

    //! FetchsProviders
    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    //!Columns
    const columns = [
        { header: "ID", accessorKey: "categoriaId" },
        { header: "Nombre de Proveedor", accessorKey: "nombre" },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} data-tooltip-id="editTooltip" data-tooltip-content="Editar" className="px-2 py-1 text-indigo-500"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button onClick={() => handleDelete(row.original.categoriaId)} data-tooltip-id="deleteTooltip" data-tooltip-content="Eliminar" className="px-2 py-1 text-red-500"><Trash size={20} strokeWidth={2.5} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 rounded-lg shadow-md p-4">
            <Breadcrumbs
                items={[
                    { label: 'Inicio', link: '/' },
                    { label: 'Categorias', link: '/categorias' }
                ]}
            />
            <Table
                data={categories}
                columns={columns}
                fetchProducts={fetchCategories}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Categoria",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/categorias/createcategoria",
                }}
                titles={{
                    title: "Categorias",
                    subtitle: "Lista de todos las categorias."
                }}
            />
        </div>
    )
}
