import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from 'react-hot-toast';

import { CircleArrowLeft } from 'lucide-react'

import Breadcrumbs from "../../components/Breadcrumbs ";

import useStoreCategory from "../../store/useStoreCategories";

import { useNavigate, Link } from "react-router-dom";

import useToastStore from "../../store/toastStore";

// Define el esquema de validación con Yup
const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
});


export default function CreateCategoria() {

    const navigate = useNavigate()

    //! Stores
    const crearProveedor = useStoreCategory((state) => state.createCategory);
    const { fetchCategories } = useStoreCategory()
    const showToast = useToastStore((state) => state.showToast);

    //! React-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),

    });

    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevaCategoria = {
            ...data,
        };

        toast.promise(
            crearProveedor(nuevaCategoria),
            {
                loading: 'Creando Categoria...',
                success: () => {
                    fetchCategories()
                    showToast('Categoria creado con éxito!', 'success');
                    navigate('/categorias');
                    return 'Categoria creado con éxito!';
                },
                error: () => {
                    showToast('No se pudo crear la categoria.', 'error');
                    return 'No se pudo crear la categoria.';
                },
            }
        );
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="inline-block">
                <Link to="/categorias">
                    <CircleArrowLeft size={30} />
                </Link>
            </div>
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Categorias', link: '/categorias' },
                        { label: 'Crear Categoria', link: '/categorias/createcategoria' }
                    ]}
                />
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Crear Categoria</h2>
                    <p className="text-gray-600">Complete el formulario para agregar una nueva categoria.</p>
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
                                Crear Categoria
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
