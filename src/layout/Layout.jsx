/* eslint-disable react/prop-types */

import SideBar from "../components/SideBar";
import { SidebarItem } from "../components/SideBar";

import { Boxes, LayoutDashboard, LayoutGrid, Package, ShoppingCart, Bookmark } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="flex">
            <SideBar>
                <Link to="/">
                    <SidebarItem icon={<LayoutDashboard size={20} />} text="DashBoard" active={location.pathname === '/'} />
                </Link>

                <Link to="/productos">
                    <SidebarItem icon={<ShoppingCart size={20} />} text="Productos" active={location.pathname === '/productos'} />
                </Link>

                <Link to="/marcas">
                    <SidebarItem icon={<Bookmark size={20} />} text="Marcas" active={location.pathname === '/marcas'} />
                </Link>

                <Link to="/proveedores">
                    <SidebarItem icon={<Package size={20} />} text="Proveedores" active={location.pathname === '/proveedores'} />
                </Link>

                <Link to="/categorias">
                    <SidebarItem icon={<LayoutGrid size={20} />} text="Categorias" active={location.pathname === '/categorias'} />
                </Link>

                <hr className="my-3" />
                <SidebarItem icon={<Boxes size={20} />} text="Inventario" alert />
            </SideBar>

            <section className="flex-grow">
                {children}
            </section>
        </div>
    )
}
