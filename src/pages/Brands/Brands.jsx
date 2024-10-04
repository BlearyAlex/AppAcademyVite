import Table from "../../components/Table"

import useStoreBrand from "../../store/useStoreBrands"

import {
    Pencil,
    Eraser,
    CirclePlus
} from "lucide-react"

import Breadcrumbs from "../../components/Breadcrumbs "

import { useNavigate } from "react-router-dom"

export default function Brands() {

    const navigate = useNavigate()

    const { brands, fetchBrands, loading, error } = useStoreBrand()


    const columns = [
        { header: "Nombre de Categoria", accessorKey: "nombre" },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} className="px-2 py-1 text-white bg-indigo-400 rounded hover:bg-indigo-300"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button onClick={() => handleDelete(row.original.id)} className="px-2 py-1 text-white bg-red-400 rounded hover:bg-red-300"><Eraser size={20} strokeWidth={2.5} /></button>
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
                products={brands}
                columns={columns}
                fetchProducts={fetchBrands}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Marca",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/marcas/createmarca",
                }}
            />
        </div>
    )
}
