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

    const [open, setOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    //! DeleteProduct
    const handleDelete = async (categoriaId) => {
        if (selectedCategoryId) {
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
            setOpen(false);
        }
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
                    <button
                        onClick={() => {
                            setSelectedCategoryId(row.original.categoriaId);
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
                            onClick={() => handleDelete(selectedCategoryId)}
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
