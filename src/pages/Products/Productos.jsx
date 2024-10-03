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

export default function Productos() {

    const { productos, fetchProducts, loading, error } = useStoreProduct()
    console.log(productos)
    const navigate = useNavigate()

    const handleEdit = (product) => {
        console.log("Productos a editar:", product)

        navigate(`/productos/edit/${product.productoId}`)
    }

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
                return <span className={`text-white font-semibold px-2 py-0 rounded-lg items-center ${estadoClass}`}>{estado}</span>;
            }
        },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} className="px-2 py-1 text-white bg-indigo-400 rounded hover:bg-indigo-300"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button onClick={() => handleDelete(row.original.id)} className="px-2 py-1 text-white bg-red-400 rounded hover:bg-red-300"><Eraser size={20} strokeWidth={2.5} /></button>
                    <button onClick={() => viewDetails(row.original.id)} className="px-2 py-1 text-white bg-green-400 rounded hover:bg-green-300"><Eye size={20} strokeWidth={2.25} /></button>
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
