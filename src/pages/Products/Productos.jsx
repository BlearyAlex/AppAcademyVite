import Table from "../../components/Table";
import useStoreProduct from "../../store/useStoreProducts";
import {
    Pencil,
    Trash,
    Eye,
    CirclePlus
} from "lucide-react"

import Modal from "../../components/Modal";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import useToastStore from "../../store/toastStore";

export default function Productos() {

    const { productos, fetchProducts, loading, error, deleteProduct } = useStoreProduct()
    const { showToast } = useToastStore()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    //! EditProduct
    const handleEdit = (product) => {
        console.log("Productos a editar:", product)

        navigate(`/productos/edit/${product.productoId}`)
    }

    //! ViewProduct
    const handleView = (product) => {
        console.log("Productos a ver:", product)

        navigate(`/productos/view/${product.productoId}`)
    }

    //! DeleteProduct
    const handleDelete = async (productId) => {
        if (selectedProductId) {
            toast.promise(
                deleteProduct(productId),
                {
                    loading: 'Eliminando producto...',
                    success: () => {
                        // Aquí usamos el store de Zustand para mostrar el toast
                        showToast('Producto eliminado con éxito!', 'success');
                        navigate('/productos'); // Redirige a la lista de productos
                        fetchProducts()
                        return 'Producto eliminado con éxito!'; // Mensaje de éxito
                    },
                    error: () => {
                        // También usamos el store de Zustand aquí
                        showToast('No se pudo eliminar el producto.', 'error');
                        return 'No se pudo eliminar el producto.'; // Mensaje de error
                    },

                }
            );
            setOpen(false);
        }
    }

    //! FetchProducts
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


    const columns = [
        { header: "Imagen", accessorKey: "imagen" },
        { header: "Nombre", accessorKey: "nombre" },
        { header: "Descripción", accessorKey: "descripcion" },
        {
            header: "Precio", accessorKey: "precio", cell: ({ row }) => {
                const precio = row.original.precio;
                return <span>${precio.toFixed(2)}</span>; // Formatea el precio con 2 decimales
            }
        },
        { header: "Stock", accessorKey: "stockMinimo" },
        {
            header: "Estado",
            accessorKey: "estadoProducto",
            cell: ({ row }) => {
                const estado = row.original.estadoProducto
                const estadoClass = estado === "Alta" ? "bg-emerald-100/60 text-emerald-500" : "bg-red-100/60 text-red-500"; // Cambia a los colores que desees
                return <span className={`font-semibold px-2 py-0 rounded-lg items-center ${estadoClass}`}>{estado}</span>;
            }
        },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} className="px-2 py-1 text-indigo-500"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button
                        onClick={() => {
                            setSelectedProductId(row.original.productoId);
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
                    { label: 'Productos', link: '/productos' }
                ]}
            />

            <Table
                data={productos}
                columns={columns}
                fetchProducts={fetchProducts}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Producto",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/productos/createproducto",
                }}
                titles={{
                    title: "Productos",
                    subtitle: "Lista de todos los productos."
                }}
            />

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <Trash size={56} className="mx-auto text-red-500" />
                    <div className="mx-auto my-4 w-48">
                        <h3 className="text-lg font-black text-gray-800">Confirmar Eliminacion</h3>
                        <p className="text-sm text-gray-500">
                            Estas seguro de eliminar este producto?
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="w-full p-2 bg-red-100/60 text-red-500 rounded hover:bg-red-200 font-semibold transition duration-200"
                            onClick={() => handleDelete(selectedProductId)}
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
