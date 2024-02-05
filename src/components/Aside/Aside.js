import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function Aside() {
  const [menuData, setMenuData] = useState(null);
  const { setSelectedOption } = useContext(AuthContext);
  const { loginData } = useContext(AuthContext);
  const [openMenus, setOpenMenus] = useState([]);

  const handleMenuClick = (index) => {
    if (openMenus.includes(index)) {
      setOpenMenus(openMenus.filter((item) => item !== index));
    } else {
      setOpenMenus([...openMenus, index]);
    }
  };

  const handleMenuOptionClick = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  return (
    <aside
      className="main-sidebar sidebar-dark-primary elevation-4"
      style={{ height: "100vh" }}
    >
      <span to="index3.html" className="brand-link">
        <img
          src="dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">CIDHU</span>
      </span>
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="info">
            <span
              to="#"
              className="d-block"
              style={{ cursor: "pointer", color: "white" }}
            >
              MENU ADMINISTRADOR
              {loginData.firstname} {loginData.lastname}
            </span>
          </div>
        </div>
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className={`nav-item "menu-is-opening menu-open`} key={1}>
              <span
                to="#"
                className="nav-link active"
                onClick={() => handleMenuClick(0)}
              >
                <i className="far fa-circle nav-icon" />
                <p>
                  Usuarios
                  <i className="right fas fa-angle-left" />
                </p>
              </span>
              <ul
                className="nav nav-treeview"
                style={{
                  display: openMenus.includes(0) ? "block" : "none",
                }}
              >
                <li className="nav-item" key={0}>
                  <span
                    className="nav-link"
                    onClick={() => handleMenuOptionClick("ComplaintUser")}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Denuncias </p>
                  </span>
                </li>
              </ul>
            </li>
            <li className={`nav-item "menu-is-opening menu-open`} key={1}>
              <span
                to="#"
                className="nav-link active"
                onClick={() => handleMenuClick(1)}
              >
                <i className="far fa-circle nav-icon" />
                <p>
                  Administración
                  <i className="right fas fa-angle-left" />
                </p>
              </span>
              <ul
                className="nav nav-treeview"
                style={{
                  display: openMenus.includes(1) ? "block" : "none",
                }}
              >
                <li className="nav-item" key={1}>
                  <span
                    className="nav-link"
                    onClick={() => handleMenuOptionClick("ClientAdmin")}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Usuarios </p>
                  </span>
                </li>
                <li className="nav-item" key={1}>
                  <span
                    className="nav-link"
                    onClick={() => handleMenuOptionClick("ComplaintAdmin")}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Denuncias </p>
                  </span>
                </li>
                <li className="nav-item" key={1}>
                  <span
                    className="nav-link"
                    onClick={() => handleMenuOptionClick("ProcessAdmin")}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Procesos </p>
                  </span>
                </li>
                <li className="nav-item" key={1}>
                  <span
                    className="nav-link"
                    onClick={() => handleMenuOptionClick("DatesAdmin")}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Citas </p>
                  </span>
                </li>

                <li className="nav-item" key={1}>
                  <span
                    className="nav-link"
                    onClick={() => handleMenuOptionClick("CoreDefensa")}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Core </p>
                  </span>
                </li>
              </ul>
            </li>
            <li className={`nav-item "menu-is-opening menu-open`} key={1}>
              <span
                to="#"
                className="nav-link active"
                onClick={() => handleMenuClick(1)}
              >
                <i className="far fa-circle nav-icon" />
                <p>
                  Abogado
                  <i className="right fas fa-angle-left" />
                </p>
              </span>
              <ul
                className="nav nav-treeview"
                style={{
                  display: openMenus.includes(1) ? "block" : "none",
                }}
              >
                <li className="nav-item" key={1}>
                  <span
                    className="nav-link"
                    onClick={() => handleMenuOptionClick("ComplaintAbogado")}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>Denuncias </p>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
