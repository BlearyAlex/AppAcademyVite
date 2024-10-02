import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel
} from "@tanstack/react-table";

import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import {
    ChevronRight,
    ChevronLeft,
    Pencil,
    Eraser,
    Eye,
    CirclePlus
} from "lucide-react";

import useStore from "../store/useStore";

import Breadcrumbs from './Breadcrumbs '

export default function Table() {

    const { products, fetchProducts, loading, error } = useStore()
    console.log(products)

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
                const estadoClass = estado === "Alta" ? "bg-green-300" : "bg-red-300"; // Cambia a los colores que desees
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
                    <button onClick={() => handleDelete(row.original.id)} className="px-2 py-1 text-white bg-green-400 rounded hover:bg-green-300"><Eye size={20} strokeWidth={2.25} /></button>
                </div>
            )
        }
    ];

    const [sorting, setSorting] = useState([]);
    const [filtered, setFiltered] = useState("");

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            globalFilter: filtered
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltered,
        getFilteredRowModel: getFilteredRowModel()
    });

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <Breadcrumbs
                items={[
                    { label: 'Inicio', link: '/' },
                    { label: 'Productos', link: '/productos' }
                ]}
            />

            {/* Button */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Productos</h2>
                    <p>Lista de todos los productos</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={filtered}
                        onChange={e => setFiltered(e.target.value)}
                        className="px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Buscar..."
                    />
                    <Link to="/productos/createproducto">
                        <button className="px-2 py-2 flex items-center gap-2 font-semibold bg-indigo-400 text-white rounded-md hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"><CirclePlus size={20} strokeWidth={2.25} />Crear Producto</button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-80">
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                    <thead className="">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="p-4 text-left text-gray-700 cursor-pointer hover:bg-gray-300">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        <span className="ml-2">
                                            {{ 'asc': '↑', desc: '↓' }[header.column.getIsSorted() ?? null]}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-indigo-100">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="p-4 text-gray-600">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex mt-4 justify-between">
                <div className="space-x-2">
                    <button
                        onClick={() => table.setPageIndex(0)}
                        className="px-2 py-1 text-white bg-indigo-400 rounded hover:bg-indigo-300"
                    >
                        Primera Pagina
                    </button>
                    <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} className="px-2 py-1 text-white bg-indigo-400 rounded hover:bg-indigo-300">
                        Ultima Pagina
                    </button>
                </div>
                <div className="space-x-2">
                    <button
                        onClick={() => table.previousPage()}
                        className={`px-2 py-1 text-white bg-indigo-400 rounded hover:bg-indigo-300 ${!table.getCanPreviousPage() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        className={`px-2 py-1 text-white bg-indigo-400 rounded hover:bg-indigo-300 ${!table.getCanNextPage() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>

        </div>
    );
}
