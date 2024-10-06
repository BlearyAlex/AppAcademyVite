import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from 'react-hot-toast';

import Breadcrumbs from "../../components/Breadcrumbs ";

import useStoreProduct from "../../store/useStoreProducts";
import useStoreBrand from "../../store/useStoreBrands";
import useStoreCategory from "../../store/useStoreCategories";
import useStoreProvider from "../../store/useStoreProviders";
import { useNavigate } from "react-router-dom";
import useToastStore from "../../store/toastStore";

// Define el esquema de validación con Yup
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
    marcaId: yup.string().nullable(),
    categoriaId: yup.string().nullable(),
    proveedorId: yup.string().nullable(),
});

export default function CreateProducto() {

    const navigate = useNavigate()

    //! Stores
    const crearProducto = useStoreProduct((state) => state.createProducto);
    const { brands, fetchBrands } = useStoreBrand()
    const { categories, fetchCategories } = useStoreCategory()
    const { providers, fetchProviders } = useStoreProvider()
    const showToast = useToastStore((state) => state.showToast);

    //! React-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: yupResolver(schema),

    });


    //! Calcular precio automaticamente
    const costo = watch("costo");
    const utilidad = watch("utilidad");

    const [precio, setPrecio] = useState(0);

    useEffect(() => {
        const calculado = parseFloat(costo || 0) + parseFloat(utilidad || 0);
        setPrecio(calculado);
    }, [costo, utilidad]);

    //! UseEffectBrands
    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    //! UseEffectsCategories
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories])

    //! UseEffectProviders
    useEffect(() => {
        fetchProviders();
    }, [fetchProviders])



    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevoProducto = {
            ...data,
            costo: parseFloat(data.costo),
            utilidad: parseFloat(data.utilidad),
            precio: precio,
            marcaId: data.marcaId || null,
            categoriaId: data.categoriaId || null,
            proveedorId: data.proveedorId || null,

        };

        // Usa toast.promise para manejar el proceso de creación
        toast.promise(
            crearProducto(nuevoProducto),
            {
                loading: 'Creando producto...',
                success: () => {

                    // Aquí usamos el store de Zustand para mostrar el toast
                    showToast('Producto creado con éxito!', 'success');
                    navigate('/productos'); // Redirige a la lista de productos
                    return 'Producto creado con éxito!'; // Mensaje de éxito
                },
                error: () => {
                    // También usamos el store de Zustand aquí
                    showToast('No se pudo crear el producto.', 'error');
                    return 'No se pudo crear el producto.'; // Mensaje de error
                },
            }
        );
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-full overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Productos', link: '/productos' },
                        { label: 'Crear Producto', link: '/productos/createproducto' }
                    ]}
                />
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Crear Producto</h2>
                    <p className="text-gray-600">Complete el formulario para agregar un nuevo producto.</p>
                </div>

                {/* Form */}
                <form className="mt-6 grid grid-cols-2 items-start gap-4" onSubmit={handleSubmit((data) => {
                    console.log("Formulario enviado con datos:", data); // Para verificar el contenido completo antes de enviar
                    onSubmit(data);
                })}>

                    {/* Imagen */}
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
                        <h3 className="font-bold text-2xl text-gray-800 mb-4">Imagen</h3>
                        <div className="mt-2">
                            <label className="block text-gray-700 font-semibold mb-2">Imagen (URL)</label>
                            <input
                                type="file"
                                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out hover:shadow-lg"
                            />
                            <p className="text-gray-500 mt-1">Selecciona una imagen para cargar. Formatos permitidos: JPG, PNG, GIF.</p>
                        </div>
                    </div>


                    {/* Información General */}
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <h3 className="font-bold text-xl text-gray-700">Información General</h3>
                        <div className="grid grid-cols-3 gap-4 mt-4">

                            <div>
                                <label className="block text-gray-700 font-semibold">Nombre</label>
                                <input
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    type="text"
                                    {...register("nombre")}
                                />
                                {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
                            </div>

                            <div style={{ gridColumn: "span 2" }}>
                                <label className="block text-gray-700 font-semibold">Código de Barras</label>
                                <input
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("codigoBarras")}
                                />
                                {errors.codigoBarras && <p className="text-red-500">{errors.codigoBarras.message}</p>}
                            </div>

                            <div className="col-span-3">
                                <label className="block text-gray-700 font-semibold">Descripción</label>
                                <textarea
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    rows="3"
                                    {...register("descripcion")}
                                />
                                {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold">Marca</label>
                                <select
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("marcaId")}
                                >
                                    <option value=''>Seleccione una Marca</option>
                                    {brands.map((marca) => (
                                        <option key={marca.marcaId} value={marca.marcaId}>
                                            {marca.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold">Categoria</label>
                                <select
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("categoriaId")}
                                >
                                    <option value=''>Seleccione una Categoria</option>
                                    {categories.map((categoria) => (
                                        <option key={categoria.categoriaId} value={categoria.categoriaId}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold">Proveedor</label>
                                <select
                                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register("proveedorId")}
                                >
                                    <option value=''>Seleccione un Proveedor</option>
                                    {providers.map((provider) => (
                                        <option key={provider.proveedorId} value={provider.proveedorId}>
                                            {provider.nombre}
                                        </option>
                                    ))}
                                </select>
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
                                className="w-full p-2 bg-green-400 text-white rounded hover:bg-green-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                            >
                                Crear Producto
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
