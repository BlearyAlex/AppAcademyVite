import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useNavigate, useParams, Link } from "react-router-dom";

import { CircleArrowLeft } from "lucide-react";

import useStoreProduct from "../../store/useStoreProducts";
import useStoreBrand from "../../store/useStoreBrands";
import useStoreCategory from "../../store/useStoreCategories";
import useStoreProvider from "../../store/useStoreProviders";

import toast from 'react-hot-toast';
import useToastStore from "../../store/toastStore";

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

export default function ViewProducto() {

    const { productId } = useParams();

    const navigate = useNavigate()

    const updateProducto = useStoreProduct((state) => state.updateProducto);
    const producto = useStoreProduct((state) => state.producto);
    const fetchProductById = useStoreProduct((state) => state.fetchProductById);
    const loading = useStoreProduct((state) => state.loading);

    const { brands, fetchBrands } = useStoreBrand()
    const { categories, fetchCategories } = useStoreCategory()
    const { providers, fetchProviders } = useStoreProvider()
    const { showToast } = useToastStore()

    //! React-hook-form
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(schema),
    })

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


    useEffect(() => {
        if (fetchProductById) {
            console.log("Fetching product with ID:", productId);
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
        const productoActualizado = {
            ...data,
            productId: productId,
            costo: parseFloat(data.costo),
            utilidad: parseFloat(data.utilidad),
            precio: precio,
            marcaId: data.marcaId || null,
            categoriaId: data.categoriaId || null,
            proveedorId: data.proveedorId || null,
        }
        // Usa toast.promise para manejar el proceso de creación
        toast.promise(
            updateProducto(productoActualizado),
            {
                loading: 'Editando producto...',
                success: () => {

                    // Aquí usamos el store de Zustand para mostrar el toast
                    showToast('Producto editado con éxito!', 'success');
                    navigate('/productos'); // Redirige a la lista de productos
                    return 'Producto editado con éxito!'; // Mensaje de éxito
                },
                error: () => {
                    // También usamos el store de Zustand aquí
                    showToast('No se pudo editar el producto.', 'error');
                    return 'No se pudo editar el producto.'; // Mensaje de error
                },
            }
        );
    };



    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="inline-block">
                <Link to="/productos">
                    <CircleArrowLeft size={30} />
                </Link>
            </div>
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
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <h3 className="font-bold text-xl text-gray-700">Información General</h3>
                        <div className="grid grid-cols-3 gap-4 mt-4">

                            <div>
                                <label className="block text-gray-700 font-semibold">Nombre</label>
                                <input
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    type="text"
                                    {...register("nombre")}
                                    readOnly
                                />
                                {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
                            </div>

                            <div style={{ gridColumn: "span 2" }}>
                                <label className="block text-gray-700 font-semibold">Código de Barras</label>
                                <input
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    {...register("codigoBarras")}
                                    readOnly
                                />
                                {errors.codigoBarras && <p className="text-red-500">{errors.codigoBarras.message}</p>}
                            </div>

                            <div className="col-span-3">
                                <label className="block text-gray-700 font-semibold">Descripción</label>
                                <textarea
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    rows="3"
                                    {...register("descripcion")}
                                    readOnly
                                />
                                {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
                            </div>

                            <div className="">
                                <label className="block text-gray-700 font-semibold">Marca</label>
                                <select
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    {...register("marcaId")}
                                    readOnly
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
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    {...register("categoriaId")}
                                    readOnly
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
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    {...register("proveedorId")}
                                    readOnly
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
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    readOnly
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
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    readOnly
                                />
                                {errors.utilidad && <p className="text-red-500">{errors.utilidad.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Descuento Base</label>
                                <input
                                    type="number"
                                    placeholder="5.00"
                                    step="0.01"
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    {...register("descuentoBase")}
                                    readOnly
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
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    {...register("impuesto")}
                                    readOnly
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
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    {...register("estadoProducto")}
                                    readOnly
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
                                    className="block w-full p-2 border border-gray-300 rounded bg-gray-200"
                                    {...register("stockMinimo")}
                                    readOnly
                                />
                                {errors.stockMinimo && <p className="text-red-500">{errors.stockMinimo.message}</p>}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
