import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useParams } from "react-router-dom";

import { WholeWord, LayoutGrid, Bookmark, Package } from "lucide-react";

import useStoreProduct from "../../store/useStoreProducts";
import useStoreBrand from "../../store/useStoreBrands";
import useStoreCategory from "../../store/useStoreCategories";
import useStoreProvider from "../../store/useStoreProviders";

const schema = yup.object().shape({
    nombre: yup.string().required("El nombre es obligatorio."),
    codigoBarras: yup.string().required("El código de barras es obligatorio."),
    descripcion: yup.string().required("La descripción es obligatoria."),
    costo: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .required("El costo es obligatorio.")
        .positive("El costo es obligatorio y debe ser mayor a 0."),
    utilidad: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .required("La utilidad es obligatoria.")
        .positive("La utilidad es obligatorio y debe ser mayor a 0."),
    descuentoBase: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .min(0, "El descuento debe ser mayor o igual a 0."),
    impuesto: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .min(0, "El impuesto debe ser mayor o igual a 0."),
    estadoProducto: yup.number()
        .oneOf([0, 1], "El estado es obligatorio"),
    stockMinimo: yup.number()
        .transform((value, originalValue) => originalValue === '' ? 0 : value)
        .required("El stock mínimo es obligatorio.")
        .positive("El stock es obligatorio y debe ser mayor a 0."),
    marcaId: yup.string().nullable(),
    categoriaId: yup.string().nullable(),
    proveedorId: yup.string().nullable(),
});

export default function ViewProducto() {

    const { productId } = useParams();

    const producto = useStoreProduct((state) => state.producto);
    const fetchProductById = useStoreProduct((state) => state.fetchProductById);
    const loading = useStoreProduct((state) => state.loading);

    const { brands, fetchBrands } = useStoreBrand()
    const { categories, fetchCategories } = useStoreCategory()
    const { providers, fetchProviders } = useStoreProvider()

    //! React-hook-form
    const { reset } = useForm({
        resolver: yupResolver(schema),
    })


    //! UseEffectBrands
    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    //! UseEffectsCategories
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories])

    //! UseEffectProviders
    useEffect(() => {
        fetchProviders();
    }, [fetchProviders])


    useEffect(() => {
        if (fetchProductById) {
            fetchProductById(productId);
        }
    }, [productId, fetchProductById]);

    useEffect(() => {
        if (producto) {
            reset(producto);
        }
    }, [producto, reset]);

    if (loading) return <p>Cargando...</p>;

    if (!producto) return <p>Producto no encontrado</p>;


    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <div className="mt-6 h-[600px] overflow-y-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Productos', link: '/productos' },
                        { label: 'Ver Producto', link: '' }
                    ]}
                />
                <div>
                    <h2 className="font-bold text-3xl text-gray-500">Detalles de Producto</h2>
                </div>

                {/* from */}
                <div className="bg-white mt-6 grid grid-cols-2 items-start gap-4 rounded-lg shadow-md">
                    <div className="flex p-10">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <WholeWord size={20} />
                                            </span>
                                            Nombre
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{producto.nombre}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <LayoutGrid size={20} />
                                            </span>
                                            Categoria
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{categories.length > 0 ? (
                                        categories.find(cat => {
                                            return cat.categoriaId === producto.categoriaId;
                                        })?.nombre || 'Sin categoría'
                                    ) : (
                                        'Cargando categorías...'
                                    )}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <Bookmark size={20} />
                                            </span>
                                            Marca
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{categories.length > 0 ? (
                                        brands.find(marca => {
                                            return marca.marcaId === producto.marcaId;
                                        })?.nombre || 'Sin Marca'
                                    ) : (
                                        'Cargando categorías...'
                                    )}</td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                    <th style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592] font-bold">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ marginRight: '5px' }}>
                                                <Package size={20} />
                                            </span>
                                            Proveedor
                                        </div>
                                    </th>
                                    <td style={{ textAlign: 'center', padding: '10px' }} className="text-[#6c7592]">{categories.length > 0 ? (
                                        providers.find(prov => {
                                            return prov.proveedorId === producto.proveedorId;
                                        })?.nombre || 'Sin Proveedor'
                                    ) : (
                                        'Cargando categorías...'
                                    )}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <img
                            src={`http://localhost:8080${producto.imagen}`}
                            alt="Producto"
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                </div>
                <div className="flex justify-center bg-white mt-6 rounded-lg shadow-md p-10">
                    <table className="w-full text-center items-center">
                        <thead>
                            <tr className="bg-gray-100 text-[#6c7592]">
                                <th>Estado</th>
                                <th>Stock</th>
                                <th>Costo</th>
                                <th>Utilidad</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-[#6c7592]">
                                <td className={`font-semibold py-3 ${producto.estadoProducto === 0 ? 'bg-emerald-100/60 text-emerald-500' : 'bg-red-100/60 text-red-500'}`}>
                                    {producto.estadoProducto === 0 ? 'Alta' : 'Baja'}
                                </td>
                                <td>{producto.stockMinimo}</td>
                                <td>${producto.costo}.00</td>
                                <td>${producto.utilidad}.00</td>
                                <td>${producto.precio}.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
