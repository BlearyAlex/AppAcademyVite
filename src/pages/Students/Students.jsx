import { useEffect, useState } from "react"

import Table from "../../components/Table"

import {
    Pencil,
    Trash,
    CirclePlus
} from "lucide-react"

import Breadcrumbs from "../../components/Breadcrumbs "

import Modal from "../../components/Modal"

import { useNavigate } from "react-router-dom"

import useToastStore from "../../store/toastStore"

import useStoreStudent from "../../store/useStoreStudents"

import toast from "react-hot-toast"

export default function Students() {

    // Params
    const navigate = useNavigate();

    // Stores
    const { fetchStudents, students, deleteStudent, loading, error } = useStoreStudent();
    console.log(students)
    const { showToast } = useToastStore();

    // EditProvider
    const handleEdit = (student) => {
        console.log("estudiantes a editar:", student)

        navigate(`/estudiantes/edit/${student.estudianteId}`)
    }

    // UseState
    const [open, setOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    // DeleteStudent
    const handleDelete = async (studentId) => {
        if (selectedStudentId) {
            toast.promise(
                deleteStudent(studentId),
                {
                    loading: 'Eliminando estudiante...',
                    success: () => {
                        showToast('Estudiante eliminado con éxito!', 'success');
                        navigate('/estudiantes'); // Redirige a la lista de productos
                        fetchStudents()
                        return 'Estudiante eliminado con éxito!'; // Mensaje de éxito
                    },
                    error: (err) => {
                        showToast(err.message || 'No se pudo eliminar el estudiante.', 'error');
                        return err.message || 'No se pudo eliminar el estudiante.';
                    },

                }
            );
            setOpen(false);
        }
    }

    // FetchsProviders
    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    // Columns
    const columns = [
        { header: "Nombre", accessorKey: "nombre" },
        { header: "Apellido", accessorKey: "apellido" },
        { header: "Telefono", accessorKey: "telefono" },
        {
            header: "Estado",
            accessorKey: "estadoEstudiante",
            cell: ({ row }) => {
                const estado = row.original.estadoEstudiante
                const estadoClass = estado === "Alta" ? "bg-emerald-100/60 text-emerald-500" : "bg-red-100/60 text-red-500"; // Cambia a los colores que desees
                return <span className={`font-semibold px-2 py-0 rounded-lg items-center ${estadoClass}`}>{estado}</span>;
            }
        },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} data-tooltip-id="editTooltip" data-tooltip-content="Editar" className="px-2 py-1 text-indigo-500"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button
                        onClick={() => {
                            setSelectedStudentId(row.original.estudianteId);
                            setOpen(true);
                        }}
                        className="px-2 py-1 text-red-500"
                    >
                        <Trash size={20} strokeWidth={2.25} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 rounded-lg shadow-md p-4">
            <Breadcrumbs
                items={[
                    { label: 'Inicio', link: '/' },
                    { label: 'Estudiantes', link: '/estudiantes' }
                ]}
            />
            <Table
                data={students}
                columns={columns}
                fetchProducts={fetchStudents}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Estudiante",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/estudiantes/createestudiante",
                }}
                titles={{
                    title: "Estudiantes",
                    subtitle: "Lista de todos los estudiantes."
                }}
            />

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <Trash size={56} className="mx-auto text-red-500" />
                    <div className="mx-auto my-4 w-48">
                        <h3 className="text-lg font-black text-gray-800">Confirmar Eliminacion</h3>
                        <p className="text-sm text-gray-500">
                            Estas seguro de eliminar este estudiante
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="w-full p-2 bg-red-100/60 text-red-500 rounded hover:bg-red-200 font-semibold transition duration-200"
                            onClick={() => handleDelete(selectedStudentId)}
                        >
                            Delete
                        </button>
                        <button
                            className="w-full p-2 bg-emerald-100/60 text-emerald-500 rounded hover:bg-emerald-200 font-semibold transition duration-200"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
