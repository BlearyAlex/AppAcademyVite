import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useEffect } from "react";

import toast from 'react-hot-toast';

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useNavigate } from "react-router-dom";

import useToastStore from "../../store/toastStore";

import useStoreColegiatura from '../../store/useStoreColegiaturas';
import useStoreStudents from '../../store/useStoreStudents'

// Yup
const schema = yup.object().shape({
    estadoColegiatura: yup.number()
        .oneOf([0, 1, 2], "El estado es obligatorio"),
    montoTotal: yup.number()
        .required("El monto total es obligatorio.")
        .positive("El costo debe ser mayor a 0."),
    montoPagado: yup.number()
        .required("El monto total es obligatorio.")
        .positive("el monto pagado debe ser mayor a 0"),
    saldoPendiente: yup.number(),
    mes: yup.number()
        .oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "el mes es obligatorio"),
    notas: yup.string().max(500, "Las notas no pueden exceder los 500 caracteres.")

});

export default function CreateColegiatura() {

    const navigate = useNavigate();

    // Stores
    const createColegiatura = useStoreColegiatura((state) => state.createColegiatura);
    const { fetchColegiaturas } = useStoreColegiatura();
    const { fetchStudents, students } = useStoreStudents();
    const { showToast } = useToastStore();

    // React-hook-form
    const { register, setValue, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: yupResolver(schema),
    });

    const montoTotal = watch("montoTotal");
    const montoPagado = watch("montoPagado");

    // UseEffects
    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    useEffect(() => {
        if (montoTotal && montoPagado !== undefined) {
            const saldo = montoTotal - montoPagado;
            setValue("saldoPendiente", saldo > 0 ? saldo : 0);
        }
    }, [montoTotal, montoPagado, setValue])


    // Functions
    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevaColegiatura = {
            ...data,
            estudianteId: data.estudianteId || null
        };

        toast.promise(
            createColegiatura(nuevaColegiatura),
            {
                loading: 'Creando Colegiatura...',
                success: () => {
                    fetchColegiaturas()
                    showToast('Colegiatura creado con éxito!', 'success');
                    navigate('/colegiaturas');
                    return 'Colegiatura creado con éxito!';
                },
                error: () => {
                    showToast('No se pudo crear la colegiatura.', 'error');
                    return 'No se pudo crear la colegiatura.';
                },
            }
        );
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: "Colegiaturas", link: "/colegiaturas" },
                        { label: "Crear Colegiatura", link: "/colegiaturas/createcolegiatura" },
                    ]}
                />

                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Crear Colegiatura</h2>
                    <p className="text-gray-600">
                        Complete el formulario para agregar una colegiatura.
                    </p>
                </div>

                <form
                    className="mt-6 grid grid-cols-2 row items-start gap-4 bg-white rounded-lg shadow-lg p-6"
                    onSubmit={handleSubmit((data) => {
                        onSubmit(data);
                    })}
                >
                    <div>
                        <label className="block text-gray-700 font-semibold">Estudiante</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register("estudianteId")}
                        >
                            <option value=''>Seleccione un estudiante</option>
                            {students.map((student) => (
                                <option key={student.estudianteId} value={student.estudianteId}>
                                    {student.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">Estado colegiatura</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register("estadoColegiatura")}
                        >
                            <option value={0}>Pagado</option>
                            <option value={1}>Pendiente</option>
                            <option value={2}>Vencido</option>
                        </select>
                        {errors.estadoColegiatura && <p className="text-red-500">{errors.estadoColegiatura.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">Monto Total:</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">$</span>
                            <input
                                className="block w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Ingresa el monto total"
                                type="number"
                                {...register("montoTotal")}
                            />
                            {errors.montoTotal && (
                                <p className="text-red-500">{errors.montoTotal.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">Monto Pagado:</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">$</span>
                            <input
                                className="block w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Ingresa el monto pagado"
                                type="number"
                                {...register("montoPagado")}
                            />
                            {errors.montoPagado && (
                                <p className="text-red-500">{errors.montoPagado.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">Saldo Pendiente:</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">$</span>
                            <input
                                className="block w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                type="number"
                                disabled
                                {...register("saldoPendiente")}
                            />
                            {errors.saldoPendiente && (
                                <p className="text-red-500">{errors.saldoPendiente.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Fecha Vencimiento:
                        </label>
                        <input
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Ingresar numero de telefono"
                            type="date"
                            {...register("fechaVencimiento")}
                        />
                        {errors.fechaVencimiento && (
                            <p className="text-red-500">{errors.fechaVencimiento.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">Mes:</label>
                        <select
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register("mes")}
                        >
                            <option value={0}>Enero</option>
                            <option value={1}>Febrero</option>
                            <option value={2}>Marzo</option>
                            <option value={3}>Abril</option>
                            <option value={4}>Mayo</option>
                            <option value={5}>Junio</option>
                            <option value={6}>Julio</option>
                            <option value={7}>Agosto</option>
                            <option value={8}>Septiembre</option>
                            <option value={9}>Octubre</option>
                            <option value={10}>Noviembre</option>
                            <option value={11}>Diciembre</option>
                        </select>
                        {errors.mes && <p className="text-red-500">{errors.mes.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Notas:
                        </label>
                        <textarea
                            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            rows="4"
                            placeholder="Escribe alguna nota o recordatorio..."
                            {...register("notas")}
                        >
                        </textarea>
                        {errors.fechaNacimiento && (
                            <p className="text-red-500">{errors.fechaNacimiento.message}</p>
                        )}
                    </div>

                    <div className="w-full mt-4 col-span-3 flex justify-center">
                        <button
                            type="submit"
                            className="w-3/4  p-2 justify-center  bg-green-400 text-white rounded hover:bg-green-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                        >
                            Crear Colegiatura
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
