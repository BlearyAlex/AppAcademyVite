import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"
import Home from "./pages/Home"
import Productos from "./pages/Products/Productos"
import CreateProducto from "./pages/Products/CreateProducto"
import EditProducto from "./pages/Products/EditProducto"
import Brands from "./pages/Brands/Brands"
import Proveedors from "./pages/Proveedors/Proveedors"
import Categories from "./pages/Categories/Categories"
import { Toaster } from "react-hot-toast"
import ViewProducto from "./pages/Products/ViewProducto"
import EditBrand from "./pages/Brands/EditBrand"
import CreateMarca from "./pages/Brands/CreateBrand"
import CreateProvider from "./pages/Proveedors/CreateProvider"
import EditProvider from "./pages/Proveedors/EditProvider"
import CreateCategoria from "./pages/Categories/CreateCategoria"
import EditCategoria from "./pages/Categories/EditCategoria"
import Entradas from "./pages/EntradasProducts/Entradas"
import CreateEntrada from "./pages/EntradasProducts/CreateEntrada"
import EditEntrada from "./pages/EntradasProducts/EditEntrada"
import Clientes from "./pages/Clientes/Clientes"
import CreateCliente from "./pages/Clientes/CreateCliente"
import EditCliente from "./pages/Clientes/EditCliente"
import ViewCliente from "./pages/Clientes/ViewCliente"
import ViewEntrada from "./pages/EntradasProducts/ViewEntrada"
import Ventas from "./pages/Ventas/Ventas"
import CreateVenta from "./pages/Ventas/CreateVenta"
import EditVenta from "./pages/Ventas/EditVenta"
import ViewVentas from "./pages/Ventas/ViewVentas"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/createproducto" element={<CreateProducto />} />
          <Route path="/productos/edit/:productId" element={<EditProducto />} />
          <Route path="/productos/view/:productId" element={<ViewProducto />} />

          <Route path="/marcas" element={<Brands />} />
          <Route path="/marcas/createmarca" element={<CreateMarca />} />
          <Route path="/marcas/edit/:marcaId" element={<EditBrand />} />

          <Route path="/proveedores" element={<Proveedors />} />
          <Route path="/proveedores/createproveedor" element={<CreateProvider />} />
          <Route path="/proveedores/edit/:proveedorId" element={<EditProvider />} />

          <Route path="/categorias" element={<Categories />} />
          <Route path="/categorias/createcategoria" element={<CreateCategoria />} />
          <Route path="/categorias/edit/:categoriaId" element={<EditCategoria />} />

          <Route path="/entradas" element={<Entradas />} />
          <Route path="/entradas/createentrada" element={<CreateEntrada />} />
          <Route path="/entradas/edit/:entradaId" element={<EditEntrada />} />
          <Route path="/entradas/view/:entradaId" element={<ViewEntrada />} />

          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/createcliente" element={<CreateCliente />} />
          <Route path="/clientes/edit/:clienteId" element={<EditCliente />} />
          <Route path="/clientes/view/:clienteId" element={<ViewCliente />} />

          <Route path="/ventas" element={<Ventas />} />
          <Route path="/ventas/createventa" element={<CreateVenta />} />
          <Route path="/ventas/edit/:ventaId" element={<EditVenta />} />
          <Route path="/ventas/view/:ventaId" element={<ViewVentas />} />

        </Routes>
      </Layout >
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </BrowserRouter >
  )
}
