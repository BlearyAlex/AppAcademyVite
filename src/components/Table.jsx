/* eslint-disable react/prop-types */

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
} from "lucide-react";
import toast from "react-hot-toast";


export default function Table({ products, columns, loading, error, actionButton }) {

    const [sorting, setSorting] = useState([]);
    const [filtered, setFiltered] = useState("");

    const table = useReactTable({
        data: products,
        columns: columns,
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
        if (error) {
            toast.error(`Error: ${error}`);
        }
    }, [error]); // Solo se ejecuta cuando 'error' cambia

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
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
                    {actionButton && (
                        <Link to={actionButton.link}>
                            <button className="px-2 py-2 flex items-center gap-2 font-semibold bg-green-400 text-white rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
                                {actionButton.icon}
                                {actionButton.label}
                            </button>
                        </Link>
                    )}
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
