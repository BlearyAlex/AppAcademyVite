import Table from "../../components/Table"

import useStoreColegiatura from '../../store/useStoreColegiaturas'

import {
    Pencil,
    Trash,
    Eye,
    CirclePlus
} from "lucide-react"

import Modal from "../../components/Modal";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import useToastStore from "../../store/toastStore";

import { formatearFechaHora } from '../../utils/formatearFechaHora.js'

export default function Colegiaturas() {

    const { fetchColegiaturas, colegiaturas, loading, error, deleteColegiatura } = useStoreColegiatura();
    console.log(colegiaturas)
    const { showToast } = useToastStore();

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedColegiaturaId, setSelectedColegiatura] = useState(null);

    // EditProduct
    const handleEdit = (colegiatura) => {
        console.log("Colegiatura a editar:", colegiatura)

        navigate(`/colegiaturas/edit/${colegiatura.colegiaturaId}`)
    }

    // Functions
    // View
    const handleView = (colegiatura) => {
        console.log("Colegiaturas a ver:", colegiatura)

        navigate(`/colegiaturas/view/${colegiatura.colegiaturaId}`)
    }

    // Delete
    const handleDelete = async (colegiaturaId) => {
        if (selectedColegiaturaId) {
            toast.promise(
                deleteColegiatura(colegiaturaId),
                {
                    loading: 'Eliminando colegiatura...',
                    success: () => {
                        showToast('Colegiatura eliminado con éxito!', 'success');
                        navigate('/colegiaturas');
                        fetchColegiaturas()
                        return 'Colegiatura eliminado con éxito!';
                    },
                    error: () => {
                        showToast('No se pudo eliminar la colegiatura.', 'error');
                        return 'No se pudo eliminar la colegiatura.';
                    },

                }
            );
            setOpen(false);
        }
    }

    // UseEffects
    useEffect(() => {
        fetchColegiaturas();
    }, [fetchColegiaturas]);

    // Columns
    const columns = [
        {
            header: "Fecha de Pago",
            accessorKey: "fechaPago",
            cell: ({ getValue }) => {
                const fechaHora = formatearFechaHora(getValue());

                // Separar fecha y hora
                const [fecha, horaConAmPm] = fechaHora.split(', '); // Asegúrate de que esto coincida con el formato

                return (
                    <div className="px-2 py-0 rounded-lg bg-indigo-100/60 text-center font-semibold flex flex-col">
                        <span className="text-indigo-500 text uppercase">{horaConAmPm}</span>
                        <span className="text-indigo-500">{fecha}</span>
                    </div>
                );
            },
        },
        {
            header: "Monto Total",
            accessorKey: "montoTotal",
            cell: ({ row }) => {
                const precio = row.original.montoTotal;
                return <span>${precio.toFixed(2)}</span>; // Formatea el precio con 2 decimales
            }

        },
        {
            header: "Saldo Pendiente",
            accessorKey: "saldoPendiente",
            cell: ({ row }) => {
                const precio = row.original.saldoPendiente;
                return <span>${precio.toFixed(2)}</span>;
            }
        },
        // {
        //     header: "Fecha de Vencimiento",
        //     accessorKey: "FechaVencimiento",
        //     cell: ({ row }) => {
        //         const precio = row.original.fechaVencimiento;
        //         return <span>${precio.toFixed(2)}</span>;
        //     }
        // },
        {
            header: "Mes",
            accessorKey: "mes",
            cell: ({ row }) => {
                const estado = row.original.mes;

                // Asignar clases según el valor de 'mes'
                let estadoClass = '';
                if (estado === "Enero") {
                    estadoClass = "bg-emerald-100/60 text-emerald-500";
                } else if (estado === "Febrero") {
                    estadoClass = "bg-yellow-100/60 text-yellow-500";
                } else if (estado === "Marzo") {
                    estadoClass = "bg-red-100/60 text-red-500";
                } else if (estado === "Abril") {
                    estadoClass = "bg-pink-100/60 text-pink-500";
                } else if (estado === "Mayo") {
                    estadoClass = "bg-rose-100/60 text-rose-500";
                } else if (estado === "Junio") {
                    estadoClass = "bg-fuchsia-100/60 text-fuchsia-500";
                } else if (estado === "Julio") {
                    estadoClass = "bg-purple-100/60 text-purple-500";
                } else if (estado === "Agosto") {
                    estadoClass = "bg-violet-100/60 text-violet-500";
                } else if (estado === "Septiembre") {
                    estadoClass = "bg-indigo-100/60 text-indigo-500";
                } else if (estado === "Octubre") {
                    estadoClass = "bg-blue-100/60 text-blue-500";
                } else if (estado === "Noviembre") {
                    estadoClass = "bg-sky-100/60 text-sky-500";
                } else if (estado === "Diciembre") {
                    estadoClass = "bg-cyan-100/60 text-cyan-500";
                } else {
                    estadoClass = "bg-gray-100/60 text-gray-500"; // Para un estado no especificado
                }

                return (
                    <span className={`font-semibold px-2 py-0 rounded-lg items-center ${estadoClass}`}>
                        {estado}
                    </span>
                );
            }
        },
        {
            header: "Año",
            accessorKey: "anio",
        },
        {
            header: "Estado Colegiatura",
            accessorKey: "estadoColegiatura",
            cell: ({ row }) => {
                const estado = row.original.estadoColegiatura;

                // Asignar clases según el valor de 'estadoColegiatura'
                let estadoClass = '';
                if (estado === "Pagado") {
                    estadoClass = "bg-emerald-100/60 text-emerald-500";
                } else if (estado === "Pendiente") {
                    estadoClass = "bg-yellow-100/60 text-yellow-500";
                } else if (estado === "Vencido") {
                    estadoClass = "bg-red-100/60 text-red-500";
                } else {
                    estadoClass = "bg-gray-100/60 text-gray-500"; // Para un estado no especificado
                }

                return (
                    <span className={`font-semibold px-2 py-0 rounded-lg items-center ${estadoClass}`}>
                        {estado}
                    </span>
                );
            }
        },
        {
            header: "Acciones",
            accessorKey: "acciones",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(row.original)} className="px-2 py-1 text-indigo-500"><Pencil size={20} strokeWidth={2.5} /></button>
                    <button
                        onClick={() => {
                            setSelectedColegiatura(row.original.colegiaturaId);
                            setOpen(true);
                        }}
                        className="px-2 py-1 text-red-500"
                    >
                        <Trash size={20} strokeWidth={2.25} />
                    </button>
                    <button onClick={() => handleView(row.original)} className="px-2 py-1 text-emerald-500"><Eye size={20} strokeWidth={2.25} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 rounded-lg shadow-md p-4">
            <Breadcrumbs
                items={[
                    { label: 'Inicio', link: '/' },
                    { label: 'Colegiaturas', link: '/colegiaturas' }
                ]}
            />

            <Table
                data={colegiaturas}
                columns={columns}
                fetchProducts={fetchColegiaturas}
                loading={loading}
                error={error}
                actionButton={{
                    label: "Crear Colegiatura",
                    icon: <CirclePlus size={20} strokeWidth={2.25} />,
                    link: "/colegiaturas/createcolegiatura",
                }}
                titles={{
                    title: "Colegiaturas",
                    subtitle: "Lista de todos las colegiaturas."
                }}
            />

            {/* Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-56">
                    <Trash size={56} className="mx-auto text-red-500" />
                    <div className="mx-auto my-4 w-48">
                        <h3 className="text-lg font-black text-gray-800">Confirmar Eliminacion</h3>
                        <p className="text-sm text-gray-500">
                            Estas seguro de eliminar esta colegiatura
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="w-full p-2 bg-red-100/60 text-red-500 rounded hover:bg-red-200 font-semibold transition duration-200"
                            onClick={() => handleDelete(selectedColegiaturaId)}
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
