import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

import toast from "react-hot-toast";

import Table from "../../components/Table";

import { PackagePlus, CirclePlus, Trash } from 'lucide-react';

import Breadcrumbs from "../../components/Breadcrumbs ";

import useStoreVenta from '../../store/useStoreVentas';
import useStoreProduct from "../../store/useStoreProducts";

import { useNavigate, useParams } from "react-router-dom";
import useToastStore from "../../store/toastStore";

// yup
const schema = yup.object().shape({
    descuento: yup.number().min(0, "Debe ser al menos 0%").max(100, "No puede ser más de 100%"),
    estadoVenta: yup.number()
        .oneOf([0, 1], "El estado es obligatorio"),
    estadoTipoPago: yup.number()
        .oneOf([0, 1, 2], "El estado es obligatorio"),
});

export default function EditVenta() {

    const { ventaId } = useParams();
    const navigate = useNavigate();

    // Stores
    const { productos, fetchProducts, loading, error } = useStoreProduct();
    const { updateVenta, fetchVentaById, venta, fetchVentas } = useStoreVenta();
    console.log(venta)
    const { showToast } = useToastStore();

    // Use form
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
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
        if (fetchVentaById) {
            console.log("Fetching venta with Id:", ventaId)
            fetchVentaById(ventaId)
        }
    }, [ventaId, fetchVentaById]);

    useEffect(() => {
        if (venta) {
            reset({
                descuento: venta.descuento,
                neto: venta.neto,
                estadoVenta: venta.estadoVenta,
                estadoTipoPago: venta.estadoTipoPago,
                detalleVentas: venta.detalleVentas
            });

            if (venta.detalleVentas) {
                setProductosSeleccionados(venta.detalleVentas || []);
                calcularTotalBruto(venta.detalleVentas || []);
            }
        }
    }, [venta, reset]);

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
        console.log("Total neto antes de enviar:", totalNeto)
        console.log("Total Bruto:", totalBruto)
        const ventaFinal = {
            ...data,
            ventaId: ventaId,
            totalProductos: totalProductos,
            bruto: totalBruto,
            neto: totalNeto,
            descuento,
            productos: productosSeleccionados.map(producto => {
                if (producto.DetalleVentaId) {
                    return {
                        ...producto,
                        ventaId: ventaId,
                        DetalleVentaId: producto.DetalleVentaId
                    };
                } else {
                    return {
                        ...producto,
                        ventaId: ventaId,
                        productoId: producto.productoId,
                        cantidad: producto.cantidad,
                        costo: producto.costo
                    }
                }
            })
        };
        toast.promise(
            updateVenta(ventaFinal),
            {
                loading: 'Editando venta...',
                success: () => {
                    fetchVentas()
                    showToast('Venta editada con éxito!', 'success');
                    navigate('/ventas');
                    return 'Venta editada con éxito!';
                },
                error: () => {
                    showToast('No se pudo editar la venta.', 'error');
                    return 'No se pudo editar la venta.';
                },
            }
        );
    };

    const columns = [
        {
            header: "Imagen",
            accessorKey: "imagen",
            cell: ({ row }) => {
                const imagenUrl = `http://localhost:8080${row.original.imagen}`
                return (
                    <img
                        src={imagenUrl}
                        alt="Producto"
                        className="w-16 h-16 object-cover rounded" />
                )
            }
        },
        { header: "Nombre", accessorKey: "nombre" },
        {
            header: "Precio", accessorKey: "costo", cell: ({ row }) => {
                const precio = row.original.costo;
                return <span>${precio.toFixed(2)}</span>;
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
                        className="px-2 py-1 text-indigo-500"
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
                    { label: 'Editar Venta', link: '/ventas/editventa' }
                ]}
            />
            <h2 className="font-bold text-3xl text-gray-500 mt-4">Editar Venta</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-3 items-start gap-4">

                <div className="col-span-3 bg-white rounded-lg shadow-lg p-6">
                    <div className="flex gap-5">
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
                                    className="block p-2 w-full border pl-8 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    type="number"
                                    {...register("descuento", { onChange: handleDescuentoChange })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ProductosEntrada */}
                <div className="col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
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
                    </div>

                    {/* Productos seleccionados */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                        <h3 className="font-bold text-xl text-gray-700 mb-4">Productos Seleccionados</h3>
                        {productosSeleccionados.length > 0 ? (
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Precio Unitario</th>
                                        <th className="px-4 py-2">Cantidad</th>
                                        <th className="px-4 py-2">Precio Total</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosSeleccionados.map((producto, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{producto.nombreProducto}</td>
                                            <td className="border px-4 py-2">${producto.costo.toFixed(2)}</td>
                                            <td className="border px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={producto.cantidad}
                                                    onChange={(e) => actualizarCantidadProducto(producto.productoId, e.target.value)}
                                                    className="w-20 p-1 border border-gray-300 rounded"
                                                    min={1}
                                                />
                                            </td>
                                            <td className="border px-4 py-2">
                                                ${(producto.cantidad * producto.costo).toFixed(2)}
                                            </td>
                                            <td className="border px-4 py-2">
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
                </div>


                {/* Formulario de entrada */}
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                        <label className="block text-gray-700 font-semibold w-1/3">Total de Productos:</label>
                        <input
                            className="block p-2 w-2/3 border border-gray-300 rounded bg-gray-200"
                            type="number"
                            value={totalProductos}
                            readOnly
                            {...register("totalProductos")}
                        />
                        {errors.totalProductosEntrada && <p className="text-red-500">{errors.totalProductosEntrada.message}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="block text-gray-700 font-semibold w-1/3">Total Bruto:</label>
                        <div className="relative w-2/3">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">$</span>
                            <input
                                type="number"
                                value={totalBruto.toFixed(2)}
                                readOnly
                                {...register("bruto")}
                                className="block pl-8 w-full p-2 border border-gray-300 rounded bg-gray-200"
                            />
                        </div>
                        {errors.bruto && <p className="text-red-500">{errors.bruto.message}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="block text-gray-700 font-semibold w-1/3">Total Neto:</label>
                        <div className="relative w-2/3">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">$</span>
                            <input
                                type="number"
                                value={totalNeto.toFixed(2)}
                                readOnly
                                className="block pl-8 w-full p-2 border border-gray-300 rounded bg-gray-200"
                                {...register("neto")}
                            />
                        </div>
                    </div>

                    <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Editar Venta</button>
                </div>
            </form>
        </div>
    )
}
