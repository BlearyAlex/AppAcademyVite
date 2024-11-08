import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from "react-hot-toast";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useNavigate, useParams } from "react-router-dom";

import useToastStore from "../../store/toastStore";
import useStoreStudent from "../../store/useStoreStudents";

// Yup
const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
    apellido: yup.string().required("El apellido es obligatorio.")
});

export default function EditStudent() {

    // Params
    const { studentId } = useParams();
    const navigate = useNavigate();

    // Stores
    const { updateStudent, student, fetchStudentById, loading } = useStoreStudent();
    const { showToast } = useToastStore();

    // React-hook-form
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),

    });

    // UseEffect
    useEffect(() => {
        if (fetchStudentById) {
            console.log("Fetching student with ID:", studentId);
            fetchStudentById(studentId)
        }
    }, [studentId, fetchStudentById]);

    useEffect(() => {
        if (student) {
            reset(student)
        }
    }, [student, reset])

    if (loading) return <p>Cargando...</p>;

    if (!student) return <p>Estudiante no encontrado</p>;

    // Functions
    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevoEstudiante = {
            ...data,
            studentId: studentId,
        };

        try {
            await toast.promise(
                updateCliente(nuevoCliente),  // Asegúrate que updateCliente retorne una promesa
                {
                    loading: 'Editando Estudiante...',
                    success: 'Estudiante editado con éxito!',
                    error: 'No se pudo editar el estudiante.',
                }
            );
            showToast('Estudiante editado con éxito!', 'success');
            navigate('/estudiantes');
        } catch (error) {
            console.error("Error detectado:", error);
            showToast('No se pudo editar el estudiante.', 'error');
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: "Estudiantes", link: "/estudiantes" },
                        { label: "Editar Estudiante", link: "/estudiantes/edit/:studentId" },
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
                            Editar Estudiante
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
