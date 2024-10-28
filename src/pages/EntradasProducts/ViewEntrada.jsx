import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useParams } from "react-router-dom";

import { ShoppingBasket, ReceiptText, FileText, DollarSign, CalendarClock } from "lucide-react";

import useStoreProduct from "../../store/useStoreProducts";
import useStoreEntrada from "../../store/useStoreEntradas";
import { formatearFechaHora } from "../../utils/formatearFechaHora";

// Esquema de Yup
const schema = yup.object().shape({
    numeroFactura: yup.string().max(50).required(),
    folio: yup.string().max(50).nullable(),
});

export default function ViewEntrada() {
    const { entradaId } = useParams();
    const { fetchProducts } = useStoreProduct();
    const { fetchEntradaById, entrada, loading, error: entradaError } = useStoreEntrada();
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const { reset } = useForm({
        resolver: yupResolver(schema),
    });

    // Obtener productos
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Obtener entrada por ID
    useEffect(() => {
        if (entradaId) {
            fetchEntradaById(entradaId);
        }
    }, [entradaId, fetchEntradaById]);

    // Resetear formulario y establecer productos seleccionados
    useEffect(() => {
        if (entrada) {
            reset(entrada);
            setProductosSeleccionados(entrada.productos || []);
        }
    }, [entrada, reset]);

    const fechaHora = formatearFechaHora(entradaId.fechaDeEmision);

    if (loading) return <div>Cargando...</div>;
    if (entradaError) return <div>Error al cargar la entrada: {entradaError.message}</div>;

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Entradas', link: '/entradas' },
                        { label: 'Detalle Entrada', link: '' }
                    ]}
                />
                <h2 className="font-bold text-3xl text-gray-500">Detalles de Entrada</h2>

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
                                        {entrada ? entrada.totalProductosEntrada : 0} ud.
                                    </td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <ReceiptText size={20} />
                                            </span>
                                            Numero de Factura
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">
                                        {entrada ? entrada.numeroFactura : ""}
                                    </td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <FileText size={20} />
                                            </span>
                                            Folio
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">
                                        {entrada ? entrada.folio : ""}
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
                                        $ {entrada ? entrada.bruto : 0}.00
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
    );
}
