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

        </Routes>
      </Layout >
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </BrowserRouter >
  )
}
