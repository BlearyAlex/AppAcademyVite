import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useEffect } from "react";

import toast from 'react-hot-toast';

import { CircleArrowLeft } from 'lucide-react'

import Breadcrumbs from "../../components/Breadcrumbs ";


import useStoreProvider from "../../store/useStoreProviders";
import { useNavigate, Link, useParams } from "react-router-dom";
import useToastStore from "../../store/toastStore";

// Define el esquema de validación con Yup
const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
});

export default function EditProvider() {

    const { proveedorId } = useParams()
    console.log("marcaId desde params:", proveedorId);

    const navigate = useNavigate()

    //! Stores
    const updateProvider = useStoreProvider((state) => state.updateProvider);
    const provider = useStoreProvider((state) => state.provider)
    const fetchProviderById = useStoreProvider((state) => state.fetchProviderById)
    const loading = useStoreProvider((state) => state.loading)
    const showToast = useToastStore((state) => state.showToast);

    //! React-hook-form
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),

    });

    useEffect(() => {
        if (fetchProviderById) {
            console.log("Fetching product with ID:", proveedorId);
            fetchProviderById(proveedorId);
        }
    }, [proveedorId, fetchProviderById]);

    useEffect(() => {
        if (provider) {
            console.log('Datos de la marca recibidos:', provider);
            reset(provider);
        }
    }, [provider, reset]);


    if (loading) return <p>Cargando...</p>;

    if (!provider) return <p>Proveedor no encontrado</p>;


    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevoProveedor = {
            ...data,
            proveedorId: proveedorId
        };

        // Usa toast.promise para manejar el proceso de creación
        toast.promise(
            updateProvider(nuevoProveedor),
            {
                loading: 'Editando Proveedor...',
                success: () => {

                    showToast('Proveedor editado con éxito!', 'success');
                    navigate('/proveedores');
                    return 'Proveedor editado con éxito!';
                },
                error: () => {
                    // También usamos el store de Zustand aquí
                    showToast('No se pudo editar el proveedor.', 'error');
                    return 'No se pudo editar el proveedor.'; // Mensaje de error
                },
            }
        );
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="inline-block">
                <Link to="/proveedores">
                    <CircleArrowLeft size={30} />
                </Link>
            </div>
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Proveedor', link: '/proveedores' },
                        { label: 'Editar Proveedor', link: '' }
                    ]}
                />
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Editar Proveedor</h2>
                    <p className="text-gray-600">Complete el formulario para editar el proveedor.</p>
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
                                Editar Proveedor
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
