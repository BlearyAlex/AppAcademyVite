import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from 'react-hot-toast';
import { CircleArrowLeft, Trash, CirclePlus, PackagePlus } from 'lucide-react';
import Breadcrumbs from "../../components/Breadcrumbs ";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from '../../components/Table';
import useStoreProduct from "../../store/useStoreProducts";
import useStoreEntrada from "../../store/useStoreEntradas";
import useToastStore from "../../store/toastStore";

// Define el esquema de validación con Yup
const schema = yup.object().shape({
    numeroFactura: yup.string().max(50, "El número de factura no puede tener más de 50 caracteres.").required("El número de factura es obligatorio."),
    folio: yup.string().max(50, "El Folio no puede tener más de 50 caracteres.").nullable(),
});

export default function EditEntrada() {

    const { entradaId } = useParams();

    const { productos, fetchProducts, loading, error } = useStoreProduct();
    const { updateEntrada, fetchEntradaById, entrada, fetchEntradas } = useStoreEntrada();

    const { showToast } = useToastStore()

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [totalProductos, setTotalProductos] = useState(0);
    const [totalBruto, setTotalBruto] = useState(0);

    // FetchProducts
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Obtener datos de la entrada a actualizar
    useEffect(() => {
        if (fetchEntradaById) {
            console.log("Fetching entrada with ID:", entradaId);
            fetchEntradaById(entradaId);
        }
    }, [entradaId, fetchEntradaById]);

    useEffect(() => {
        if (entrada) {
            // Resetea los campos del formulario con los datos de la entrada
            reset({
                numeroFactura: entrada.numeroFactura,
                folio: entrada.folio,
                totalProductosEntrada: entrada.totalProductosEntrada,
                bruto: entrada.bruto,
            });

            // Asignar los productos de la entrada al estado de productos seleccionados
            if (entrada.productos) {
                console.log(entrada.productos)
                setProductosSeleccionados(entrada.productos);
                calcularTotalBruto(entrada.productos); // Calcula el bruto
            }
        }
    }, [entrada, reset]);

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
        const productoExistente = productosSeleccionados.find(p => p.productoId === producto.productoId);

        if (productoExistente) {
            const productosActualizados = productosSeleccionados.map(p =>
                p.productoId === producto.productoId ? { ...p, cantidad: p.cantidad + 1 } : p
            );
            setProductosSeleccionados(productosActualizados);
            calcularTotalBruto(productosActualizados);
        } else {
            const nuevosProductos = [...productosSeleccionados, { ...producto, cantidad: 1, nombreProducto: producto.nombre }];
            setProductosSeleccionados(nuevosProductos);
            calcularTotalBruto(nuevosProductos);
        }
    };

    const actualizarCantidadProducto = (productoId, nuevaCantidad) => {
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

    const onSubmit = (data) => {
        const entradaFinal = {
            ...data,
            entradaId: entradaId,
            totalProductosEntrada: totalProductos,
            bruto: totalBruto,
            productos: productosSeleccionados.map(producto => {
                // Si el producto tiene EntradaProductoId, es un producto existente
                if (producto.EntradaProductoId) {
                    return {
                        ...producto,
                        entradaId: entradaId,
                        EntradaProductoId: producto.EntradaProductoId
                    };
                } else {
                    return {
                        ...producto,
                        entradaId: entradaId,
                        productoId: producto.productoId,
                        cantidad: producto.cantidad,
                        costo: producto.costo
                    };
                }
            }),
        };
        toast.promise(
            updateEntrada(entradaFinal),
            {
                loading: 'Editando entrada...',
                success: () => {
                    fetchEntradas()
                    // Aquí usamos el store de Zustand para mostrar el toast
                    showToast('Entrada editado con éxito!', 'success');
                    navigate('/entradas'); // Redirige a la lista de productos
                    return 'Entrada editado con éxito!'; // Mensaje de éxito
                },
                error: () => {
                    // También usamos el store de Zustand aquí
                    showToast('No se pudo editar la entrada.', 'error');
                    return 'No se pudo editar la entrada.'; // Mensaje de error
                },
            }
        );

    };


    const columns = [
        { header: "ID", accessorKey: "productoId" },
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
            <div className="inline-block">
                <Link to="/entradas">
                    <CircleArrowLeft size={30} />
                </Link>
            </div>

            <Breadcrumbs
                items={[
                    { label: 'Entradas', link: '/entradas' },
                    { label: 'Editar Entrada', link: '/entradas/editentrada' }
                ]}
            />
            <h2 className="font-bold text-3xl text-gray-500 mt-4">Editar Entrada</h2>
            <p className="text-gray-600">Complete el formulario para agregar una nueva entrada.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-3 items-start gap-4">

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
                            className="block w-2/3 p-2 border border-gray-300 rounded bg-gray-200"
                            type="number"
                            value={totalProductos}
                            readOnly
                            {...register("totalProductosEntrada")}
                        />
                        {errors.totalProductosEntrada && <p className="text-red-500">{errors.totalProductosEntrada.message}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="block text-gray-700 font-semibold w-1/3">Número de factura:</label>
                        <input
                            type="text"
                            {...register("numeroFactura")}
                            className="block w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ej. FAC-7890100.00"
                        />
                        {errors.numeroFactura && <p className="text-red-500">{errors.numeroFactura.message}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="block text-gray-700 font-semibold w-1/3">Folio:</label>
                        <input
                            type="text"
                            {...register("folio")}
                            className="block w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ej. 123456"
                        />
                        {errors.folio && <p className="text-red-500">{errors.folio.message}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="block text-gray-700 font-semibold w-1/3">Bruto:</label>
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

                    <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Editar Entrada</button>
                </div>
            </form>
        </div>
    );
}
