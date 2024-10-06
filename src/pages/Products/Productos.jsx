import Table from "../../components/Table";
import useStoreProduct from "../../store/useStoreProducts";
import {
    Pencil,
    Eraser,
    Eye,
    CirclePlus
} from "lucide-react"

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useNavigate } from "react-router-dom";

import { useEffect } from "react";

import toast from "react-hot-toast";
import useToastStore from "../../store/toastStore";

import { Tooltip } from "react-tooltip";

export default function Productos() {

    const { productos, fetchProducts, loading, error, deleteProduct } = useStoreProduct()
    const { showToast } = useToastStore()
    const navigate = useNavigate()

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
    }

    //! FetchProducts
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


    const columns = [
        { header: "ID", accessorKey: "productoId" },
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
                const estadoClass = estado === "Alta" ? "bg-green-300 text-green-600" : "bg-red-300 text-red-600"; // Cambia a los colores que desees
                return <span className={`font-semibold px-2 py-0 rounded-lg items-center ${estadoClass}`}>{estado}</span>;
            }
        },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} data-tooltip-id="editTooltip" data-tooltip-content="Editar" className="px-2 py-1 text-white bg-indigo-400 rounded hover:bg-indigo-300"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button onClick={() => handleDelete(row.original.productoId)} data-tooltip-id="deleteTooltip" data-tooltip-content="Eliminar" className="px-2 py-1 text-white bg-red-400 rounded hover:bg-red-300"><Eraser size={20} strokeWidth={2.5} /></button>
                    <button onClick={() => handleView(row.original)} data-tooltip-id="viewTooltip" data-tooltip-content="Ver" className="px-2 py-1 text-white bg-green-400 rounded hover:bg-green-300"><Eye size={20} strokeWidth={2.25} /></button>
                    <Tooltip id="editTooltip" place="top" />
                    <Tooltip id="deleteTooltip" place="top" />
                    <Tooltip id="viewTooltip" place="top" />
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
                products={productos}
                columns={columns}
                fetchProducts={fetchProducts}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Producto",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/productos/createproducto",
                }}
            />
        </div>
    )
}
