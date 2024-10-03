import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Breadcrumbs from "../components/Breadcrumbs ";

import useStoreProduct from "../store/useStoreProducts";
import { useParams } from "react-router-dom";


const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
    codigoBarras: yup.string().required("El código de barras es obligatorio."),
    descripcion: yup.string().required("La descripción es obligatoria."),
    costo: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .required("El costo es obligatorio.")
        .positive("El costo es obligatorio y debe ser mayor a 0."),
    utilidad: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .required("La utilidad es obligatoria.")
        .positive("La utilidad es obligatorio y debe ser mayor a 0."),
    descuentoBase: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .min(0, "El descuento debe ser mayor o igual a 0."),
    impuesto: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .min(0, "El impuesto debe ser mayor o igual a 0."),
    estadoProducto: yup.number()
        .oneOf([0, 1], "El estado es obligatorio"),
    stockMinimo: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .required("El stock mínimo es obligatorio.")
        .positive("El stock es obligatorio y debe ser mayor a 0."),
});

export default function EditProducto() {

    const { productId } = useParams();

    const updateProducto = useStoreProduct((state) => state.updateProducto);
    const producto = useStoreProduct((state) => state.producto);
    const fetchProductById = useStoreProduct((state) => state.fetchProductById);
    const loading = useStoreProduct((state) => state.loading);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        resolver: yupResolver(schema),
    })


    const costo = watch("costo");
    const utilidad = watch("utilidad");

    const [precio, setPrecio] = useState(0);

    useEffect(() => {
        const calculado = parseFloat(costo || 0) + parseFloat(utilidad || 0);
        setPrecio(calculado);
    }, [costo, utilidad]);


    useEffect(() => {
        console.log("fetchProductById:", fetchProductById); // Esto debería mostrar la función en la consola si está bien definida
        if (fetchProductById) {
            fetchProductById(productId);
        }
    }, [productId, fetchProductById]);

    useEffect(() => {
        if (producto) {
            // Seteamos los valores del formulario cuando el producto esté disponible
            reset(producto);
        }
    }, [producto, reset]);

    if (loading) return <p>Cargando...</p>;

    if (!producto) return <p>Producto no encontrado</p>;


    const onSubmit = async (data) => {
        try {
            await updateProducto({ ...data, id: productId });
            alert("Producto actualizado correctamente");
        } catch (error) {
            alert(`Error al actualizar el producto: ${error.message}`);
        }
    };



    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Productos', link: '/productos' },
                        { label: 'Editar Producto', link: '' }
                    ]}
                />

                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Editar Producto</h2>
                    <p className="text-gray-600">Complete el formulario para editar un producto.</p>
                </div>

                {/* from */}
                <form className="mt-6 grid grid-cols-2 items-start gap-4" onSubmit={handleSubmit(onSubmit)}>

                    {/* Informacion General */}
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-700">Información General</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-gray-700 font-semibold">Nombre</label>
                                <input
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    type="text"
                                    {...register("nombre")}
                                />
                                {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Código de Barras</label>
                                <input
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("codigoBarras")}
                                />
                                {errors.codigoBarras && <p className="text-red-500">{errors.codigoBarras.message}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-gray-700 font-semibold">Descripción</label>
                                <textarea
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    rows="3"
                                    {...register("descripcion")}
                                />
                                {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Detalles del Producto */}
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-700">Detalles del Producto</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-gray-700 font-semibold">Costo ($)</label>

                                <input
                                    type="number"
                                    placeholder="100.00"
                                    step="0.01"
                                    {...register("costo")}
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                {errors.costo && <p className="text-red-500">{errors.costo.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Utilidad ($)</label>

                                <input
                                    type="number"
                                    placeholder="20.00"
                                    step="0.01"
                                    {...register("utilidad")}
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                {errors.utilidad && <p className="text-red-500">{errors.utilidad.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Descuento Base</label>
                                <input
                                    type="number"
                                    placeholder="5.00"
                                    step="0.01"
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("descuentoBase")}
                                />
                                {errors.descuentoBase && <p className="text-red-500">{errors.descuentoBase.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Precio ($)</label>
                                <input
                                    type="number"
                                    value={precio}
                                    readOnly
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Impuesto (%)</label>

                                <input
                                    type="number"
                                    placeholder="18"
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("impuesto")}

                                />
                                {errors.impuesto && <p className="text-red-500">{errors.impuesto.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Disponibilidad */}
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-700">Disponibilidad</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-gray-700 font-semibold">Estado del Producto</label>
                                <select
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("estadoProducto")}
                                >
                                    <option value={0}>Alta</option>
                                    <option value={1}>Baja</option>
                                </select>
                                {errors.estadoProducto && <p className="text-red-500">{errors.estadoProducto.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Stock Mínimo</label>
                                <input
                                    type="number"
                                    placeholder="10"
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("stockMinimo")}
                                />
                                {errors.stockMinimo && <p className="text-red-500">{errors.stockMinimo.message}</p>}
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-400 text-white rounded hover:bg-blue-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                            >
                                Editar Producto
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
