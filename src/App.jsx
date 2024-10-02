import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"
import Home from "./pages/Home"
import Productos from "./pages/Productos"
import CreateProducto from "./pages/CreateProducto"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/createproducto" element={<CreateProducto />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
