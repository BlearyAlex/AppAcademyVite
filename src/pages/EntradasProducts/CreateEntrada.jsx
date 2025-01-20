import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from 'react-hot-toast';

import { Trash, PackagePlus } from 'lucide-react';
import Breadcrumbs from "../../components/Breadcrumbs ";
import { useNavigate } from "react-router-dom";
import useStoreProduct from "../../store/useStoreProducts";
import useStoreEntrada from "../../store/useStoreEntradas";
import useToastStore from "../../store/toastStore";
import TableProducts from "../../components/TableProducts";

// Define el esquema de validación con Yup
const schema = yup.object().shape({
    numeroFactura: yup.string().max(50, "El número de factura no puede tener más de 50 caracteres.").required("El número de factura es obligatorio."),
    folio: yup.string().max(50, "El Folio no puede tener más de 50 caracteres.").nullable(),
});

export default function CreateEntrada() {

    const navigate = useNavigate()

    const { productos, fetchProducts, loading, error } = useStoreProduct();

    const crearEntrada = useStoreEntrada((state) => state.CreateEntrada);

    const { fetchEntradas } = useStoreEntrada();

    const { showToast } = useToastStore()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [totalProductos, setTotalProductos] = useState(0);
    const [totalBruto, setTotalBruto] = useState(0);

    // UseEffects
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        // Calcula el total de productos seleccionados cada vez que cambian
        const total = productosSeleccionados.reduce((sum, prod) => sum + prod.cantidad, 0);
        setTotalProductos(total);
    }, [productosSeleccionados]);


    const calcularTotalBruto = (productos) => {
        const total = productos.reduce((acc, producto) => acc + (producto.cantidad * producto.costo), 0);
        setTotalBruto(total);
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
        const entradaFinal = {
            ...data,
            totalProductosEntrada: totalProductos,
            bruto: totalBruto,
            productos: productosSeleccionados,
        };

        console.log(entradaFinal)

        toast.promise(
            crearEntrada(entradaFinal),
            {
                loading: 'Creando entrada...',
                success: () => {
                    fetchEntradas()
                    // Aquí usamos el store de Zustand para mostrar el toast
                    showToast('Entrada creado con éxito!', 'success');
                    navigate('/entradas'); // Redirige a la lista de productos
                    return 'Entrada creado con éxito!'; // Mensaje de éxito
                },
                error: () => {
                    // También usamos el store de Zustand aquí
                    showToast('No se pudo crear la entrada.', 'error');
                    return 'No se pudo crear la entrada.'; // Mensaje de error
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
                    { label: 'Entradas', link: '/entradas' },
                    { label: 'Crear Entrada', link: '/entradas/createentrada' }
                ]}
            />
            <h2 className="font-bold text-3xl text-gray-500 mt-4">Crear Entrada</h2>
            <p className="text-gray-600">Complete el formulario para agregar una nueva entrada.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-3 items-start gap-4">

                <div className="col-span-3 bg-white rounded-lg shadow-lg p-6">
                    <div className="flex gap-5">
                        {/* Numero de Factura */}
                        <div className="w-full">
                            <label className="text-gray-700 font-semibold">Número de factura:</label>
                            <input
                                className="block p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                type="text"
                                {...register("numeroFactura")}
                                placeholder="Ej. FAC-7890100.00"
                            />
                            {errors.numeroFactura && <p className="text-red-500">{errors.numeroFactura.message}</p>}
                        </div>
                        {/* Folio */}
                        <div className="w-full">
                            <label className="text-gray-700 font-semibold">Folio:</label>
                            <input
                                className="block p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                type="text"
                                {...register("folio")}
                                placeholder="Ej. 123456"
                            />
                            {errors.folio && <p className="text-red-500">{errors.folio.message}</p>}
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
                            {...register("totalProductosEntrada")}
                        />
                    </div>

                    {/* Total */}
                    <div className="flex items-center">
                        <label className="text-gray-700 font-semibold w-1/2">Total:</label>
                        <div className="relative w-2/3 flex items-center justify-end">
                            <span className="absolute left-48 text-gray-700 font-bold">$</span>
                            <p className="pl-6 text-right w-full">
                                {totalBruto.toFixed(2)}
                            </p>
                            <input
                                type="hidden"
                                value={totalBruto.toFixed(2)}
                                {...register("bruto")}
                            />
                        </div>
                        {errors.bruto && <p className="text-red-500">{errors.bruto.message}</p>}
                    </div>

                    <button type="submit" className="mt-4 bg-green-400 text-white py-2 px-4 rounded hover:bg-green-300 font-semibold">Crear Entrada</button>
                </div>
            </form>
        </div>
    );
}
