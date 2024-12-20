/* eslint-disable react/prop-types */

import SideBar from "../components/SideBar";
import { SidebarItem } from "../components/SideBar";

import { LayoutDashboard, LayoutGrid, Package, ShoppingCart, Bookmark, ArchiveRestore, ContactRound, Receipt, School, Banknote } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="flex">
            <SideBar>
                <Link to="/">
                    <SidebarItem icon={<LayoutDashboard size={20} />} text="DashBoard" active={location.pathname === '/'} alert />
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

                <Link to="/clientes">
                    <SidebarItem icon={<ContactRound size={20} />} text="Clientes" active={location.pathname === '/clientes'} />
                </Link>

                <hr className="my-3" />

                <Link to="/entradas">
                    <SidebarItem icon={<ArchiveRestore size={20} />} text="Entradas" active={location.pathname === '/entradas'} />
                </Link>

                <Link to="/ventas">
                    <SidebarItem icon={<Receipt size={20} />} text="Ventas" active={location.pathname === '/ventas'} />
                </Link>

                <hr className="my-3" />

                <Link to="/estudiantes">
                    <SidebarItem icon={<School size={20} />} text="Estudiantes" active={location.pathname === '/estudiantes'} />
                </Link>

                <Link to="/colegiaturas">
                    <SidebarItem icon={<Banknote size={20} />} text="Colegiaturas" active={location.pathname === '/colegiaturas'} />
                </Link>

            </SideBar>


            <section className="flex-grow">
                {children}
            </section>
        </div>
    )
}
