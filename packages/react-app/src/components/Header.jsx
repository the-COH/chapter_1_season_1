import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AiOutlineClose, AiOutlineDashboard, AiOutlineHome } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { BsFillCartFill } from "react-icons/bs";
import { MdOutlineDraw } from "react-icons/md";

export const routes = [
  { tabName: "Home", pageName: "/", icon: <AiOutlineHome /> },
  { tabName: "Marketplace", pageName: "/marketplace", icon: <BsFillCartFill /> },
  { tabName: "Create", pageName: "/create", icon: <MdOutlineDraw /> },
  { tabName: "Dashboard", pageName: "/dashboard", icon: <AiOutlineDashboard /> },
];

// displays a page header

export default function Header({ ...props }) {
  const location = useLocation();
  const [sideBar, setSideBar] = useState(false);

  const showSidebar = () => setSideBar(!sideBar);

  return (
    <div className="headerClass mr-60 top-0 shadow-sm flex flex-row z-50 sticky justify-between w-screen">
      {/* Desktop view */}
      <nav className="hidden left-40 lg:flex lg:flex-row space-x-8 items-start text-center overflow-hidden">
        <div className="">
          <div className="pt-5 text-md space-x-9">
            <Link to={"/"}>
              <button className="navButton font-bold">Home</button>
            </Link>
            <Link to={"/marketplace"}>
              <button className="text-md navButton font-bold">Marketplace</button>
            </Link>
            <Link to={"/create"}>
              <button className="text-md navButton font-bold">Create</button>
            </Link>
            <Link to={"/dashboard"}>
              <button className="text-md navButton font-bold">Dashboard</button>
            </Link>
          </div>
        </div>
      </nav>

      <h6
        style={{ fontFamily: "FantaisieArtistique" }}
        className="hidden lg:flex lg:flex-1 w-min justify-center items-center font-semibold text-xl pt-5 tracking-widest uppercase"
      >
        Manager
      </h6>
      <div className="flex items-start w-min justify-end">{props.children}</div>
      {/* Mobile view */}
      <div className="lg:hidden">
        <Link to={"#"} className="menu-bars">
          <FaBars onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sideBar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <AiOutlineClose onClick={showSidebar} />
            </Link>
          </li>
          {routes.map((item, index) => {
            return (
              <li key={index} className="nav-text">
                <NavLink onClick={showSidebar} className="space-x-3 text-color" to={item.pageName}>
                  {item.icon} <span>{item.tabName}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
