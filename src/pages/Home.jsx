import { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import useStoreProduct from "../store/useStoreProducts";
import useStoreVenta from "../store/useStoreVentas";

// Registra los componentes necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const COLORS = {
    background: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
    ],
    border: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
    ],
};

const periodoTexto = {
    dia: 'Día',
    semana: 'Semana',
    mes: 'Mes',
};

export default function Home() {
    const { fetchProductsMostSale, productos } = useStoreProduct();
    const { fetchVentasForDate, venta, loading } = useStoreVenta();

    const [periodo, setPeriodo] = useState('dia');
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Productos Más Vendidos',
                data: [],
                backgroundColor: COLORS.background,
                borderColor: COLORS.border,
                borderWidth: 1,
            },
        ],
    });

    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Ventas Totales',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Productos Vendidos',
                data: [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        // Llamada a la API para obtener los productos más vendidos
        const fetchData = async () => {
            await fetchProductsMostSale();
        };
        fetchData();
    }, [fetchProductsMostSale]);

    useEffect(() => {
        // Actualiza los datos del gráfico de productos más vendidos
        if (productos && productos.length > 0) {
            setChartData({
                labels: productos.map((p) => p.productoNombre),
                datasets: [
                    {
                        label: 'Productos Más Vendidos',
                        data: productos.map((p) => p.totalVendido),
                        backgroundColor: COLORS.background,
                        borderColor: COLORS.border,
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [productos]);

    useEffect(() => {
        // Llamada a la API para obtener ventas según el período
        fetchVentasForDate(periodo);
    }, [fetchVentasForDate, periodo]);

    useEffect(() => {
        if (venta && venta.length > 0) {
            setBarChartData({
                labels: venta.map((v) => v.fecha),
                datasets: [
                    {
                        label: 'Ventas Totales',
                        data: venta.map((v) => v.totalVentas),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Productos Vendidos',
                        data: venta.map((v) => v.totalProductos),
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [venta]);

    const barChartOptions = {
        scales: {
            y: {
                beginAtZero: true, // Asegura que el eje Y empiece en 0
                ticks: {
                    stepSize: 50, // Controla el intervalo de los valores en el eje Y
                    callback: function (value) {
                        return '$' + value; // Formato de las etiquetas en el eje Y
                    },
                },
                title: {
                    display: true,
                    text: 'Ventas', // Título del eje Y
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Fechas', // Título del eje X
                },
            },
        },
        responsive: true,
    };

    if (loading) {
        return <div className="text-center py-10">Cargando datos...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-3 h-full p-10 gap-5">
                <MetricCard icon="shopping-cart" color="bg-cyan-400" value="$254.18K" label="Ventas" />
                <MetricCard icon="dollar-sign" color="bg-red-400" value="$254" label="Ventas totales hoy" />
                <MetricCard icon="shopping-bag" color="bg-green-400" value="$254" label="Compras" />
            </div>

            <div className="p-5 grid grid-cols-3">
                <div className="bg-gray-50 col-span-2 rounded-lg">
                    <h2 className="text-2xl font-semibold text-center mb-4">Ventas por {periodoTexto[periodo]}</h2>
                    <Bar data={barChartData} options={barChartOptions} /> {/* Agregar opciones aquí */}
                </div>
                <div className="w-96 mx-auto rounded-lg">
                    <h2 className="text-2xl font-semibold text-center">Productos Más Vendidos</h2>
                    <Doughnut data={chartData} />
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex justify-center gap-4 my-4">
                    <PeriodButton label="Día" isActive={periodo === 'dia'} onClick={() => setPeriodo('dia')} />
                    <PeriodButton label="Semana" isActive={periodo === 'semana'} onClick={() => setPeriodo('semana')} />
                    <PeriodButton label="Mes" isActive={periodo === 'mes'} onClick={() => setPeriodo('mes')} />
                </div>
            </form>
        </div>
    );
}

function MetricCard({ icon, color, value, label }) {
    return (
        <div className={`${color} flex rounded-lg p-10 justify-between`}>
            <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`lucide lucide-${icon}`}
                >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                </svg>
            </div>
            <div className="text-white text-end">
                <h2 className="font-semibold text-2xl">{value}</h2>
                <h3>{label}</h3>
            </div>
        </div>
    );
}

function PeriodButton({ label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`px-4 py-2 rounded ${isActive ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            aria-label={`Cambiar período a ${label}`}
        >
            {label}
        </button>
    );
}
