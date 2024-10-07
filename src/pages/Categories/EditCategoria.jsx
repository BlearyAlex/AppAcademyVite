import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useEffect } from "react";

import toast from 'react-hot-toast';

import { CircleArrowLeft } from 'lucide-react'

import Breadcrumbs from "../../components/Breadcrumbs ";

import useStoreCategory from "../../store/useStoreCategories";
import { useNavigate, Link, useParams } from "react-router-dom";
import useToastStore from "../../store/toastStore";

// Define el esquema de validación con Yup
const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
});

export default function EditCategoria() {
    const { categoriaId } = useParams()
    console.log("marcaId desde params:", categoriaId);

    const navigate = useNavigate()

    //! Stores
    const updateCategory = useStoreCategory((state) => state.updateCategory);
    const category = useStoreCategory((state) => state.category)
    const fetchCategoryById = useStoreCategory((state) => state.fetchCategoryById)
    const loading = useStoreCategory((state) => state.loading)

    const showToast = useToastStore((state) => state.showToast);

    //! React-hook-form
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),

    });

    useEffect(() => {
        if (fetchCategoryById) {
            console.log("Fetching product with ID:", categoriaId);
            fetchCategoryById(categoriaId);
        }
    }, [categoriaId, fetchCategoryById]);

    useEffect(() => {
        if (category) {
            console.log('Datos de la marca recibidos:', category);
            reset(category);
        }
    }, [category, reset]);


    if (loading) return <p>Cargando...</p>;

    if (!category) return <p>Proveedor no encontrado</p>;


    const onSubmit = async (data) => {
        console.log("Valores del formulario enviados:", data);
        const nuevaCategoria = {
            ...data,
            categoriaId: categoriaId
        };

        // Usa toast.promise para manejar el proceso de creación
        toast.promise(
            updateCategory(nuevaCategoria),
            {
                loading: 'Editando Proveedor...',
                success: () => {

                    showToast('Categoria editado con éxito!', 'success');
                    navigate('/categorias');
                    return 'Categoria editado con éxito!';
                },
                error: () => {
                    // También usamos el store de Zustand aquí
                    showToast('No se pudo editar la categoria.', 'error');
                    return 'No se pudo editar la categoria.'; // Mensaje de error
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
                        { label: 'Categoria', link: '/categorias' },
                        { label: 'Editar Categoria', link: '' }
                    ]}
                />
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Crear Categoria</h2>
                    <p className="text-gray-600">Complete el formulario para editar la categoria.</p>
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
                                Editar Categoria
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
