import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Breadcrumbs from "../components/Breadcrumbs ";
import useStoreCreateProduct from "../store/useStoreCreateProduct";

// Define el esquema de validación con Yup
const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
    codigoBarras: yup.string().required("El código de barras es obligatorio."),
    descripcion: yup.string().required("La descripción es obligatoria."),
    costo: yup.number().required("El costo es obligatorio.").positive("El costo debe ser positivo."),
    utilidad: yup.number().required("La utilidad es obligatoria.").positive("La utilidad debe ser positiva."),
    descuentoBase: yup.number().required("El descuento base es obligatorio.").positive("El descuento debe ser positivo."),
    impuesto: yup.number().required("El impuesto es obligatorio.").positive("El impuesto debe ser positivo."),
    estadoProducto: yup.number().oneOf([0, 1], "El estado es obligatorio"),
    stockMinimo: yup.number().required("El stock mínimo es obligatorio.").positive("El stock mínimo debe ser positivo."),
});

export default function CreateProducto() {
    const [costo, setCosto] = useState(0);
    const [utilidad, setUtilidad] = useState(0);
    const crearProducto = useStoreCreateProduct((state) => state.crearProducto);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nombre: '',
            codigoBarras: '',
            descripcion: '',
            costo: 0,
            utilidad: 0,
            descuentoBase: 0,
            impuesto: 0,
            estadoProducto: 0,
            stockMinimo: 0,
        },
    });

    const precio = parseFloat(costo) + parseFloat(utilidad);

    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevoProducto = {
            ...data,
            costo: parseFloat(data.costo),
            utilidad: parseFloat(data.utilidad),
            precio: precio,
        };

        console.log("Producto a enviar:", nuevoProducto);

        try {
            await crearProducto(nuevoProducto);
            // Puedes limpiar el formulario o redirigir al usuario
        } catch (error) {
            alert(`Error al crear el producto. Inténtalo de nuevo. ${error}`);
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
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
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-700">Imagen</h3>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-semibold">Imagen (URL)</label>
                            <input
                                type="file"
                                className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>

                    {/* Información General */}
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-700">Información General</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-gray-700 font-semibold">Nombre</label>
                                <Controller
                                    name="nombre"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            required
                                        />
                                    )}
                                />
                                {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Código de Barras</label>
                                <Controller
                                    name="codigoBarras"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            required
                                        />
                                    )}
                                />
                                {errors.codigoBarras && <p className="text-red-500">{errors.codigoBarras.message}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-gray-700 font-semibold">Descripción</label>
                                <Controller
                                    name="descripcion"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            rows="3"
                                            required
                                        />
                                    )}
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
                                <Controller
                                    name="costo"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            placeholder="100.00"
                                            step="0.01"
                                            value={costo}
                                            onChange={(e) => {
                                                setCosto(e.target.value);
                                                field.onChange(e);
                                            }}
                                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            required
                                        />
                                    )}
                                />
                                {errors.costo && <p className="text-red-500">{errors.costo.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Utilidad ($)</label>
                                <Controller
                                    name="utilidad"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            placeholder="20.00"
                                            step="0.01"
                                            value={utilidad}
                                            onChange={(e) => {
                                                setUtilidad(e.target.value);
                                                field.onChange(e);
                                            }}
                                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            required
                                        />
                                    )}
                                />
                                {errors.utilidad && <p className="text-red-500">{errors.utilidad.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Descuento Base</label>
                                <Controller
                                    name="descuentoBase"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            placeholder="5.00"
                                            step="0.01"
                                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            required
                                        />
                                    )}
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
                                <Controller
                                    name="impuesto"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            placeholder="18"
                                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            required
                                        />
                                    )}
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
                                <Controller
                                    name="estadoProducto"
                                    control={control}
                                    render={({ field }) => {
                                        console.log("Estado actual (desde el select):", field.value); // Para ver qué valor tiene el campo `estado`
                                        return (
                                            <select
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    const newValue = parseInt(e.target.value);
                                                    console.log("Nuevo valor seleccionado (convertido a número):", newValue); // Ver el valor después de cambiar
                                                    field.onChange(newValue);
                                                }}
                                                className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                required
                                            >
                                                <option value={1}>Alta</option>
                                                <option value={0}>Baja</option>
                                            </select>
                                        );
                                    }}
                                />
                                {errors.estadoProducto && <p className="text-red-500">{errors.estadoProducto.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">Stock Mínimo</label>
                                <Controller
                                    name="stockMinimo"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            placeholder="10"
                                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            required
                                        />
                                    )}
                                />
                                {errors.stockMinimo && <p className="text-red-500">{errors.stockMinimo.message}</p>}
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <button
                                type="submit"
                                className="w-full p-2 bg-indigo-400 text-white rounded hover:bg-indigo-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
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
