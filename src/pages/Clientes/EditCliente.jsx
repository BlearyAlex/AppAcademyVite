import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from "react-hot-toast";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useNavigate, useParams } from "react-router-dom";

import useToastStore from "../../store/toastStore";
import useStoreCliente from "../../store/useStoreClientes";

// Yup
const schema = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre es obligatorio."),
    email: yup.string().email("El correo no es valido."),
    telefono: yup.string().required("El teléfono es obligatorio."),
    direccion: yup.string(),
});

export default function EditCliente() {

    const { clienteId } = useParams()

    const navigate = useNavigate();

    // Stores
    const updateCliente = useStoreCliente((state) => state.updateCliente);
    const cliente = useStoreCliente((state) => state.cliente);
    const fetchClienteById = useStoreCliente((state) => state.fetchClienteById);
    const loading = useStoreCliente((state) => state.loading);
    const showToast = useToastStore((state) => state.showToast);

    // React-hook-form
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),

    });

    // UseEffect
    useEffect(() => {
        if (fetchClienteById) {
            console.log("Fetching product with ID:", clienteId);
            fetchClienteById(clienteId)
        }
    }, [clienteId, fetchClienteById]);

    useEffect(() => {
        if (cliente) {
            reset(cliente)
        }
    }, [cliente, reset])

    if (loading) return <p>Cargando...</p>;

    if (!cliente) return <p>Cliente no encontrado</p>;

    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevoCliente = {
            ...data,
            clienteId: clienteId,
        };

        try {
            await toast.promise(
                updateCliente(nuevoCliente),  // Asegúrate que updateCliente retorne una promesa
                {
                    loading: 'Editando Cliente...',
                    success: 'Cliente editado con éxito!',
                    error: 'No se pudo editar el cliente.',
                }
            );
            showToast('Cliente editado con éxito!', 'success');
            navigate('/clientes');
        } catch (error) {
            console.error("Error detectado:", error);
            showToast('No se pudo editar el cliente.', 'error');
        }
    };


    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: "Clientes", link: "/clientes" },
                        { label: "Crear Cliente", link: "/clientes/createcliente" },
                    ]}
                />

                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Crear Cliente</h2>
                    <p className="text-gray-600">
                        Complete el formulario para agregar un nuevo cliente.
                    </p>
                </div>

                <form
                    className="mt-6 grid grid-cols-2 row items-start gap-4 bg-white rounded-lg shadow-lg p-6"
                    onSubmit={handleSubmit((data) => {
                        console.log(data)
                        onSubmit(data);
                    })}
                >
                    <div>
                        <label className="block text-gray-700 font-semibold">Nombre:</label>
                        <input
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ingresa el nombre del cliente"
                            type="text"
                            {...register("nombreCompleto")}
                        />
                        {errors.nombreCompleto && (
                            <p className="text-red-500">{errors.nombreCompleto.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">Correo:</label>
                        <input
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ingresar correo electronico"
                            type="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Telefono:
                        </label>
                        <input
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ingresar numero de telefono"
                            type="tel"
                            {...register("telefono")}
                        />
                        {errors.telefono && (
                            <p className="text-red-500">{errors.telefono.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Direccion:
                        </label>
                        <input
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ingresar direccion del cliente"
                            type="direccion"
                            {...register("direccion")}
                        />
                        {errors.direccion && (
                            <p className="text-red-500">{errors.direccion.message}</p>
                        )}
                    </div>
                    <div className="w-full mt-4 col-span-3">
                        <button
                            type="submit"
                            className="w-full p-2 bg-green-400 text-white rounded hover:bg-green-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                        >
                            Crear Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
