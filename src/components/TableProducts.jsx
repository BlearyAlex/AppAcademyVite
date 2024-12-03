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

import toast from "react-hot-toast";


export default function TableProducts({ data, columns, loading, error }) {

    const [sorting, setSorting] = useState([]);
    const [filtered, setFiltered] = useState("");

    const table = useReactTable({
        data: data,
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
            <div className="flex pb-2 justify-end">
                <input
                    type="text"
                    value={filtered}
                    onChange={e => setFiltered(e.target.value)}
                    className="px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
                    placeholder="Buscar..."
                />
            </div>
            {/* Table */}
            <div className="overflow-x-auto max-h-80">
                <table className="min-w-full bg-white rounded-lg shadow-lg text-center">
                    <thead className="text-center">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="p-4 text-left text-gray-700 cursor-pointer hover:bg-gray-300">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        <span className="ml-2">
                                            {{ 'asc': '↑', desc: '↓' }[header.column.getIsSorted() ?? null]}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-300 text-center">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-fuchsia-100">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="p-4 text-gray-600 text-left">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
