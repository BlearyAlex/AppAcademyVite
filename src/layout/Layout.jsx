/* eslint-disable react/prop-types */

import SideBar from "../components/SideBar";
import { SidebarItem } from "../components/SideBar";
import { Boxes, LayoutDashboard, Receipt, UserCircle, ShoppingCart } from "lucide-react";
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

                <SidebarItem icon={<UserCircle size={20} />} text="Users" />
                <SidebarItem icon={<Boxes size={20} />} text="Inventario" alert />
                <hr className="my-3" />
                <SidebarItem icon={<Receipt size={20} />} text="Pagos" />
            </SideBar>

            <section className="flex-grow">
                {children}
            </section>
        </div>
    )
}
