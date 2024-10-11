import { useEffect, useState } from "react"

import Table from "../../components/Table"

import useStoreBrand from "../../store/useStoreBrands"

import {
    Pencil,
    Trash,
    CirclePlus
} from "lucide-react"

import Breadcrumbs from "../../components/Breadcrumbs "

import Modal from "../../components/Modal"

import { useNavigate } from "react-router-dom"
import useToastStore from "../../store/toastStore"

import toast from "react-hot-toast"

export default function Brands() {

    const navigate = useNavigate()

    const { brands, fetchBrands, loading, error, deleteBrand } = useStoreBrand()
    const { showToast } = useToastStore()

    const [open, setOpen] = useState(false);
    const [selectedBrandId, setSelectedBrandId] = useState(null);

    //! EditProduct
    const handleEdit = (marca) => {
        console.log("marcas a editar:", marca)

        navigate(`/marcas/edit/${marca.marcaId}`)
    }

    //! DeleteProduct
    const handleDelete = async (marcaId) => {
        if (selectedBrandId) {
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
            setOpen(false)
        }
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
                    <button
                        onClick={() => {
                            setSelectedBrandId(row.original.marcaId);
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

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <Trash size={56} className="mx-auto text-red-500" />
                    <div className="mx-auto my-4 w-48">
                        <h3 className="text-lg font-black text-gray-800">Confirmar Eliminacion</h3>
                        <p className="text-sm text-gray-500">
                            Estas seguro de eliminar esta marca?
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="w-full p-2 bg-red-100/60 text-red-500 rounded hover:bg-red-200 font-semibold transition duration-200"
                            onClick={() => handleDelete(selectedBrandId)}
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
