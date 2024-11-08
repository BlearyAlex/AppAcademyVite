import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from 'react-hot-toast';

import Breadcrumbs from "../../components/Breadcrumbs ";

import useStoreStudent from "../../store/useStoreStudents";

import { useNavigate, Link } from "react-router-dom";

import useToastStore from "../../store/toastStore";

// Yup
const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
    apellido: yup.string().required("El apellido es obligatorio."),
    telefono: yup.string()
        .required("El teléfono es obligatorio."),
    estadoProducto: yup.number()
        .oneOf([0, 1], "El estado es obligatorio"),

});

export default function CreateStudent() {

    const navigate = useNavigate();

    // Stores
    const createStudent = useStoreStudent((state) => state.createStudent);
    const { fetchStudents } = useStoreStudent();
    const { showToast } = useToastStore();

    // React-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // Functions
    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevoEstudiante = {
            ...data,
        };

        toast.promise(
            createStudent(nuevoEstudiante),
            {
                loading: 'Creando Estudiante...',
                success: () => {
                    fetchStudents()
                    showToast('Estudiante creado con éxito!', 'success');
                    navigate('/estudiantes');
                    return 'Estudiante creado con éxito!';
                },
                error: () => {
                    showToast('No se pudo crear el estudiante.', 'error');
                    return 'No se pudo crear el estudiante.';
                },
            }
        );
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: "Estudiantes", link: "/estudiantes" },
                        { label: "Crear Estudiante", link: "/estudiantes/createestudiante" },
                    ]}
                />

                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Crear Estudiante</h2>
                    <p className="text-gray-600">
                        Complete el formulario para agregar un nuevo estudiante.
                    </p>
                </div>

                <form
                    className="mt-6 grid grid-cols-2 row items-start gap-4 bg-white rounded-lg shadow-lg p-6"
                    onSubmit={handleSubmit((data) => {
                        onSubmit(data);
                    })}
                >
                    <div>
                        <label className="block text-gray-700 font-semibold">Estatus del Estudiante</label>
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
                        <label className="block text-gray-700 font-semibold">Nombre:</label>
                        <input
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ingresa el nombre del cliente"
                            type="text"
                            {...register("nombre")}
                        />
                        {errors.nombre && (
                            <p className="text-red-500">{errors.nombre.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">Apellido:</label>
                        <input
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ingresa el nombre del cliente"
                            type="text"
                            {...register("apellido")}
                        />
                        {errors.apellido && (
                            <p className="text-red-500">{errors.apellido.message}</p>
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

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Fecha de Nacimiento:
                        </label>
                        <input
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            type="date"
                            {...register("fechaNacimiento")}
                        />
                        {errors.fechaNacimiento && (
                            <p className="text-red-500">{errors.fechaNacimiento.message}</p>
                        )}
                    </div>

                    <div className="w-full mt-4 col-span-3">
                        <button
                            type="submit"
                            className="w-full p-2 bg-green-400 text-white rounded hover:bg-green-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                        >
                            Crear Estudiante
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
