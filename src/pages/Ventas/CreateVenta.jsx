import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from 'react-hot-toast';

import { PackagePlus, Trash } from 'lucide-react'

import Breadcrumbs from "../../components/Breadcrumbs ";

import useStoreVenta from '../../store/useStoreVentas';
import useStoreProduct from "../../store/useStoreProducts";
import useStoreCliente from "../../store/useStoreClientes";

import { useNavigate } from "react-router-dom";
import useToastStore from "../../store/toastStore";
import TableProducts from "../../components/TableProducts";

// yup
const schema = yup.object().shape({
    descuento: yup.number().positive().min("Debe ser al menos 0%").max(100, "No puede ser más de 100%"),
    estadoVenta: yup.number()
        .oneOf([0, 1], "El estado es obligatorio"),
    estadoTipoPago: yup.number()
        .oneOf([0, 1, 2], "El estado es obligatorio"),
});

export default function CreateVenta() {

    const navigate = useNavigate();

    // Stores
    const crearVenta = useStoreVenta((state) => state.createVenta);
    const { fetchVentas, ventas } = useStoreVenta();
    const { clientes, fetchClientes } = useStoreCliente();
    const { showToast } = useToastStore();
    const { productos, fetchProducts, loading, error } = useStoreProduct();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [totalProductos, setTotalProductos] = useState(0);
    const [totalBruto, setTotalBruto] = useState(0);
    const [totalNeto, setTotalNeto] = useState(0);
    const [descuento, setDescuento] = useState(0);

    // UseEffects
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchVentas()
    }, [fetchVentas])

    useEffect(() => {
        fetchClientes()
    }, [fetchClientes])


    useEffect(() => {
        // Calcula el total de productos seleccionados cada vez que cambian
        const total = productosSeleccionados.reduce((sum, prod) => sum + prod.cantidad, 0);
        setTotalProductos(total);
    }, [productosSeleccionados]);

    useEffect(() => {
        const aplicarDescuento = (bruto, descuento) => {
            return bruto - (bruto * (descuento / 100));
        };
        setTotalNeto(aplicarDescuento(totalBruto, descuento));
    }, [totalBruto, descuento]);


    // Functions
    const calcularTotalBruto = (productos) => {
        const total = productos.reduce((acc, producto) => acc + (producto.cantidad * producto.costo), 0);
        setTotalBruto(total);
    };

    const handleDescuentoChange = (e) => {
        const nuevoDescuento = parseFloat(e.target.value) || 0;
        setDescuento(nuevoDescuento);
    };

    const agregarProducto = (producto) => {
        console.log(producto)
        const productoExistente = productosSeleccionados.find(p => p.productoId === producto.productoId);

        if (productoExistente) {
            const productosActualizados = productosSeleccionados.map(p =>
                p.productoId === producto.productoId ? { ...p, cantidad: p.cantidad + 1 } : p
            );
            setProductosSeleccionados(productosActualizados);
            calcularTotalBruto(productosActualizados);
        } else {
            const nuevosProductos = [...productosSeleccionados, { ...producto, cantidad: 1 }];
            setProductosSeleccionados(nuevosProductos);
            calcularTotalBruto(nuevosProductos);
        }
    };

    const actualizarCantidadProducto = (productoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            toast.error("La cantidad debe ser al menos 1.");
            return;
        }

        const productosActualizados = productosSeleccionados.map(p =>
            p.productoId === productoId ? { ...p, cantidad: parseInt(nuevaCantidad, 10) } : p
        );
        setProductosSeleccionados(productosActualizados);
        calcularTotalBruto(productosActualizados);
    };

    const eliminarProducto = (productoId) => {
        const productosActualizados = productosSeleccionados.filter(p => p.productoId !== productoId);
        setProductosSeleccionados(productosActualizados);
        calcularTotalBruto(productosActualizados);
    };

    const onSubmit = async (data) => {
        console.log(data)
        const ventaFinal = {
            ...data,
            totalProductos: totalProductos,
            bruto: totalBruto,
            neto: parseFloat(totalNeto.toFixed(2)),
            descuento,
            productos: productosSeleccionados,
        };
        toast.promise(
            crearVenta(ventaFinal),
            {
                loading: 'Creando venta...',
                success: () => {
                    fetchVentas()
                    showToast('Venta creado con éxito!', 'success');
                    navigate('/ventas');
                    return 'Venta creada con éxito!';
                },
                error: () => {
                    showToast('No se pudo crear la venta.', 'error');
                    return 'No se pudo crear la venta.';
                },
            }
        );
    };

    const columns = [
        {
            header: "Imagen",
            accessorKey: "imagen",
            cell: ({ row }) => {
                const imagenUrl = row.original.imagen
                    ? `http://localhost:8080${row.original.imagen}`
                    : '/imagen.png'; // Imagen predeterminada

                return (
                    <img
                        src={imagenUrl}
                        alt="Producto"
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                            // Fallback en caso de error cargando la imagen
                            e.target.onerror = null;
                            e.target.src = '/imagen.png';
                        }}
                    />
                )
            }
        },
        { header: "Nombre", accessorKey: "nombre" },
        {
            header: "Precio", accessorKey: "costo", cell: ({ row }) => {
                const precio = row.original.costo;
                return <span>${precio ? precio.toFixed(2) : "0.00"}</span>;
            }
        },
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
                    <button
                        onClick={() => agregarProducto(row.original)}
                        className="px-2 py-1 text-fuchsia-500"
                    >
                        <PackagePlus size={20} strokeWidth={2.25} />
                    </button>
                </div>
            )
        }
    ];


    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <Breadcrumbs
                items={[
                    { label: 'Ventas', link: '/ventas' },
                    { label: 'Crear Venta', link: '/ventas/createventa' }
                ]}
            />
            <h2 className="font-bold text-3xl text-gray-500 mt-4">Crear Venta</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-3 items-start gap-4">

                <div className="col-span-3 bg-white rounded-lg shadow-lg p-6">
                    <div className="flex gap-5">
                        <div className="w-full">
                            <label className="block text-gray-700 font-semibold">Cliente</label>
                            <select
                                className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register("clienteId")}
                            >
                                <option value=''>Seleccione un cliente</option>
                                {clientes.map((cliente) => (
                                    <option key={cliente.clienteId} value={cliente.clienteId}>
                                        {cliente.nombreCompleto}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block text-gray-700 font-semibold">Estado de Venta</label>
                            <select
                                className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register("estadoVenta")}
                            >
                                <option value={0}>Pagado</option>
                                <option value={1}>Pendiente</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block text-gray-700 font-semibold">Tipo de Pago</label>
                            <select
                                className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register("estadoTipoPago")}
                            >
                                <option value={0}>Efectivo</option>
                                <option value={1}>Transferencia</option>
                                <option value={2}>Tarjeta</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block text-gray-700 font-semibold w-1/3">Descuento:</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">%</span>
                                <input
                                    className="block p-2 w-full border pl-8 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                    type="number"
                                    value={descuento || ''}
                                    onChange={handleDescuentoChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ProductosEntrada */}
                <div className="col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
                        <TableProducts
                            data={productos}
                            columns={columns}
                            fetchProducts={fetchProducts}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>

                {/* Formulario de entrada */}
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4 h-full">

                    <div className="flex justify-center">
                        <h3 className="font-semibold">Productos</h3>
                    </div>

                    <hr />

                    <div className="flex-1 overflow-x-auto">
                        {productosSeleccionados.length > 0 ? (
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 text-left">Nombre</th>
                                        <th className="px-2 py-2 text-left">Precio Unitario</th>
                                        <th className="px-2 py-2 text-left">Cantidad</th>
                                        <th className="px-2 py-2 text-left">Precio Total</th>
                                        <th className="px-2 py-2 text-left w-20">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosSeleccionados.map((producto, index) => (
                                        <tr key={index}>
                                            <td className="border px-2 py-2">{producto.nombre}</td>
                                            <td className="border px-2 py-2">${producto.costo.toFixed(2)}</td>
                                            <td className="border px-2 py-2">
                                                <input
                                                    type="number"
                                                    value={producto.cantidad}
                                                    onChange={(e) => actualizarCantidadProducto(producto.productoId, e.target.value)}
                                                    className="w-20 p-1 border border-gray-300 rounded"
                                                    min={1}
                                                />
                                            </td>
                                            <td className="border px-2 py-2">
                                                ${(producto.cantidad * producto.costo).toFixed(2)}
                                            </td>
                                            <td className="border px-2 py-2 text-center w-20">
                                                <button
                                                    onClick={() => eliminarProducto(producto.productoId)}
                                                    className="text-red-500"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No se han agregado productos.</p>
                        )}
                    </div>


                    {/* Total de Productos */}
                    <div className="flex items-center">
                        <label className="text-gray-700 font-semibold w-1/2">Total de Productos</label>
                        <p className="p-2 w-2/3 flex justify-end">
                            {totalProductos}
                        </p>
                        <input
                            type="hidden"
                            value={totalProductos}
                            {...register("totalProductos")}
                        />
                    </div>

                    <hr />

                    {/* SubTotal */}
                    <div className="flex items-center">
                        <label className="text-gray-700 font-semibold w-1/2">Subtotal:</label>

                        <div className="relative w-2/3 flex items-center justify-end">
                            <span className="absolute left-48 text-gray-700 font-bold">$</span>
                            <p className="pl-6 text-right w-full">{totalBruto.toFixed(2)}</p>
                            <input
                                type="hidden"
                                value={totalBruto.toFixed(2)}
                                {...register("bruto")}
                            />
                        </div>

                    </div>

                    {/* Total */}
                    <div className="flex items-center">
                        <label className="text-gray-700 font-semibold w-1/2">Total:</label>
                        <div className="relative w-2/3 flex items-center justify-end">
                            <span className="absolute left-48 text-gray-700 font-bold">$</span>
                            <p className="pl-6 text-right w-full">{totalNeto.toFixed(2)}</p>
                            <input
                                type="hidden"
                                value={totalNeto.toFixed(2)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="mt-4 bg-indigo-400 text-white py-2 px-4 rounded hover:bg-indigo-300">Crear Venta</button>
                </div>
            </form >
        </div >
    )
}
