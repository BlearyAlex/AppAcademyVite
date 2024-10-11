import { useState, useEffect } from "react";

export default function Home() {
    const [entrada, setEntrada] = useState({
        totalProductos: '',
        fechaEntrega: '',
        numeroFactura: '',
        vencimientoPago: '',
        folio: '',
        bruto: '',
    });

    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({
        productoId: '',
        cantidad: '',
        costo: '',
    });

    const handleEntradaChange = (e) => {
        const { name, value } = e.target;
        setEntrada({ ...entrada, [name]: value });
    };

    const handleProductoChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto({ ...nuevoProducto, [name]: value });
    };

    const agregarProducto = () => {
        setProductos([...productos, nuevoProducto]);
        setNuevoProducto({ productoId: '', cantidad: '', costo: '' }); // Resetear campos del producto
    };

    const eliminarProducto = (index) => {
        const nuevosProductos = productos.filter((_, i) => i !== index);
        setProductos(nuevosProductos);
    };

    const manejarSubmit = (e) => {
        e.preventDefault();
        // Aquí se manejaría el envío de datos de la entrada y productos
        console.log('Entrada creada:', { ...entrada, productos });
    };

    return (
        <div>
            <h1>Crear Nueva Entrada</h1>
            <form onSubmit={manejarSubmit}>
                <input
                    type="number"
                    name="totalProductos"
                    placeholder="Total de Productos"
                    value={entrada.totalProductos}
                    onChange={handleEntradaChange}
                    required
                />
                <input
                    type="date"
                    name="fechaEntrega"
                    value={entrada.fechaEntrega}
                    onChange={handleEntradaChange}
                    required
                />
                <input
                    type="text"
                    name="numeroFactura"
                    placeholder="Número de Factura"
                    value={entrada.numeroFactura}
                    onChange={handleEntradaChange}
                />
                <input
                    type="number"
                    name="vencimientoPago"
                    placeholder="Vencimiento de Pago"
                    value={entrada.vencimientoPago}
                    onChange={handleEntradaChange}
                    required
                />
                <input
                    type="text"
                    name="folio"
                    placeholder="Folio"
                    value={entrada.folio}
                    onChange={handleEntradaChange}
                />
                <input
                    type="number"
                    name="bruto"
                    placeholder="Bruto"
                    value={entrada.bruto}
                    onChange={handleEntradaChange}
                    required
                />

                <h2>Agregar Productos</h2>
                <input
                    type="text"
                    name="productoId"
                    placeholder="ID del Producto"
                    value={nuevoProducto.productoId}
                    onChange={handleProductoChange}
                    required
                />
                <input
                    type="number"
                    name="cantidad"
                    placeholder="Cantidad"
                    value={nuevoProducto.cantidad}
                    onChange={handleProductoChange}
                    required
                />
                <input
                    type="number"
                    name="costo"
                    placeholder="Costo"
                    value={nuevoProducto.costo}
                    onChange={handleProductoChange}
                    required
                />
                <button type="button" onClick={agregarProducto}>Agregar Producto</button>

                <h3>Productos Agregados:</h3>
                <ul>
                    {productos.map((producto, index) => (
                        <li key={index}>
                            ID: {producto.productoId}, Cantidad: {producto.cantidad}, Costo: {producto.costo}
                            <button type="button" onClick={() => eliminarProducto(index)}>Eliminar</button>
                        </li>
                    ))}
                </ul>

                <button type="submit">Crear Entrada</button>
            </form>
        </div>

    );
}
