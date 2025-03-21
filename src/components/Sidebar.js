// Sidebar.js
import React from "react";
import { Nav } from "react-bootstrap"; // Importando o componente Nav do Bootstrap
import { Link } from "react-router-dom"; // Para navegação entre as páginas
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importando o componente FontAwesomeIcon
import { faHome, faList } from "@fortawesome/free-solid-svg-icons"; // Ícones para Home e Categorias
import "../style/Sidebar.css"; // Arquivo CSS para o estilo

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <div className="container">
          <Nav.Item>
            <Nav.Link as={Link} to="/dashboard" className="sidebar-link">
              <FontAwesomeIcon
                icon={faHome}
                size="sm"
                className="sidebar-icon"
              />{" "}
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/categorias" className="sidebar-link">
              <FontAwesomeIcon icon={faList} size="" className="sidebar-icon" />{" "}
              Categorias
            </Nav.Link>
          </Nav.Item>
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;
