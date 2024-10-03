import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"
import Home from "./pages/Home"
import Productos from "./pages/Products/Productos"
import CreateProducto from "./pages/Products/CreateProducto"
import EditProducto from "./pages/Products/EditProducto"
import Brands from "./pages/Brands/Brands"
import Proveedors from "./pages/Proveedors/Proveedors"
import Categories from "./pages/Categories/Categories"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/createproducto" element={<CreateProducto />} />
          <Route path="/productos/edit/:productId" element={<EditProducto />} />

          <Route path="/marcas" element={<Brands />} />

          <Route path="/proveedores" element={<Proveedors />} />

          <Route path="/categorias" element={<Categories />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
