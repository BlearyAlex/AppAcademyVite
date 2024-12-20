import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useParams } from "react-router-dom";

import { ShoppingBasket, DollarSign, CalendarClock, Wallet, Tag } from "lucide-react";

import useStoreProduct from "../../store/useStoreProducts";
import useStoreVenta from "../../store/useStoreVentas";
import { formatearFechaHora } from "../../utils/formatearFechaHora";

// yup
const schema = yup.object().shape({
    descuento: yup.number().min(0, "Debe ser al menos 0%").max(100, "No puede ser más de 100%"),
    estadoVenta: yup.number()
        .oneOf([0, 1], "El estado es obligatorio"),
    estadoTipoPago: yup.number()
        .oneOf([0, 1, 2], "El estado es obligatorio"),
});

export default function ViewVentas() {

    const { ventaId } = useParams();
    const { fetchProducts } = useStoreProduct();
    const { fetchVentaById, venta, loading, error: ventaError } = useStoreVenta();
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const { reset } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (fetchVentaById) {
            console.log("Fetching venta with Id:", ventaId)
            fetchVentaById(ventaId)
        }
    }, [ventaId, fetchVentaById]);

    useEffect(() => {
        if (venta) {
            reset(venta);
            setProductosSeleccionados(venta.detalleVentas || []);
        }
    }, [venta, reset]);

    const fechaHora = formatearFechaHora(venta?.fechaCompra);

    if (loading) return <div>Cargando...</div>;
    if (ventaError) return <div>Error al cargar la entrada: {ventaError.message}</div>;

    if (!venta) return <div>No se encontró la venta.</div>;

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Ventas', link: '/ventas' },
                        { label: 'Detalle Venta', link: '' }
                    ]}
                />
                <h2 className="font-bold text-3xl text-gray-500">Detalles de Venta</h2>

                <div className="bg-white mt-6 grid grid-cols-2 items-start gap-4 rounded-lg shadow-md">
                    <div className="flex p-10">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <ShoppingBasket size={20} />
                                            </span>
                                            Total de Productos
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">
                                        {venta ? venta.totalProductos : 0} ud.
                                    </td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <Wallet size={20} />
                                            </span>
                                            Tipo de pago
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center' }} className={`font-semibold py-3 ${(() => {
                                        switch (venta?.estadoTipoPago) {
                                            case 0:
                                                return 'bg-violet-100/60 text-violet-500';
                                            case 1:
                                                return 'bg-yellow-100/60 text-yellow-500';
                                            case 2:
                                                return 'bg-pink-100/60 text-pink-500';
                                            default:
                                                return ''; // Default style if none match
                                        }
                                    })()}`}>
                                        {(() => {
                                            switch (venta?.estadoTipoPago) {
                                                case 0:
                                                    return 'Efectivo';
                                                case 1:
                                                    return 'Transferencia';
                                                case 2:
                                                    return 'Tarjeta';
                                                default:
                                                    return 'Desconocido';
                                            }
                                        })()}
                                    </td>

                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <Tag size={20} />
                                            </span>
                                            Estado de venta
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center' }} className={`font-semibold py-3 ${venta?.estadoVenta === 0 ? 'bg-emerald-100/60 text-emerald-500' : 'bg-orange-100/60 text-orange-500'}`}>
                                        {venta?.estadoVenta === 0 ? 'Pagado' : 'Pendiente'}
                                    </td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <DollarSign size={20} />
                                            </span>
                                            Bruto
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">
                                        $ {venta ? venta.bruto : 0}.00
                                    </td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <DollarSign size={20} />
                                            </span>
                                            Neto
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">
                                        $ {venta ? venta.neto : 0}.00
                                    </td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <CalendarClock size={20} />
                                            </span>
                                            Fecha de Emisión
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">
                                        {fechaHora}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h1>Imagen</h1>
                    </div>
                </div>

                <div className="flex justify-center bg-white mt-6 rounded-lg shadow-md p-10">
                    <table className="w-full text-center items-center">
                        <thead>
                            <tr className="bg-gray-100 text-[#6c7592]">
                                <th>Nombre</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Precio Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosSeleccionados.map((producto, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{producto.nombreProducto}</td>
                                    <td className="border px-4 py-2">${producto.costo.toFixed(2)}</td>
                                    <td className="border px-4 py-2">{producto.cantidad}</td>
                                    <td className="border px-4 py-2">${(producto.cantidad * producto.costo).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
