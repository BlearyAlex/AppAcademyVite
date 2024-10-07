import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from 'react-hot-toast';

import { CircleArrowLeft } from 'lucide-react'

import Breadcrumbs from "../../components/Breadcrumbs ";


import useStoreBrand from "../../store/useStoreBrands";
import { useNavigate, Link } from "react-router-dom";
import useToastStore from "../../store/toastStore";

// Define el esquema de validación con Yup
const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
});

export default function CreateMarca() {

    const navigate = useNavigate()

    //! Stores
    const crearMarca = useStoreBrand((state) => state.createBrand);
    const { fetchBrands } = useStoreBrand()
    const showToast = useToastStore((state) => state.showToast);

    //! React-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),

    });

    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevoProducto = {
            ...data,
        };

        // Usa toast.promise para manejar el proceso de creación
        toast.promise(
            crearMarca(nuevoProducto),
            {
                loading: 'Creando Marca...',
                success: () => {
                    fetchBrands()
                    // Aquí usamos el store de Zustand para mostrar el toast
                    showToast('Marca creado con éxito!', 'success');
                    navigate('/marcas'); // Redirige a la lista de productos
                    return 'Marca creado con éxito!'; // Mensaje de éxito
                },
                error: () => {
                    // También usamos el store de Zustand aquí
                    showToast('No se pudo crear la marca.', 'error');
                    return 'No se pudo crear la marca.'; // Mensaje de error
                },
            }
        );
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="inline-block">
                <Link to="/marcas">
                    <CircleArrowLeft size={30} />
                </Link>
            </div>
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Marcas', link: '/marcas' },
                        { label: 'Crear Marca', link: '/marcas/createmarca' }
                    ]}
                />
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Crear Marca</h2>
                    <p className="text-gray-600">Complete el formulario para agregar una nueva marca.</p>
                </div>

                {/* Form */}
                <form className="mt-6 grid grid-cols-2 items-start gap-4" onSubmit={handleSubmit((data) => {
                    console.log("Formulario enviado con datos:", data); // Para verificar el contenido completo antes de enviar
                    onSubmit(data);
                })}>

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
                        </div>
                        <div className="w-full mt-4">
                            <button
                                type="submit"
                                className="w-full p-2 bg-green-400 text-white rounded hover:bg-green-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                            >
                                Crear Marca
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
