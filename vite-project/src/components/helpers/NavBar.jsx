import React from "react";
import { NavLink } from "react-router-dom";
import { BotMessageSquare  } from "lucide-react"; 

function NavBar() {
    return (
        <nav className="nav pt-3 ps-4">
            <NavLink to="/" className="navbar-brand d-flex align-items-center brand" >
                <BotMessageSquare size={45} className="icon "/>
            </NavLink>
        </nav>
    );
}


export default NavBar;
