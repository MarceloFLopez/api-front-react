import React from "react";
import { Nav } from "react-bootstrap"; // Importando o componente Nav do Bootstrap
import { Link } from "react-router-dom"; // Para navegação entre as páginas
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importando o componente FontAwesomeIcon
import {
  faBook,
  faBookOpen,
  faHome,
  faTags,
  faUserEdit,
  faUsers,
} from "@fortawesome/free-solid-svg-icons"; // Ícones atualizados
import "../style/Sidebar.css"; // Arquivo CSS para o estilo

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <div className="container">
          {/* Home */}
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

          {/* Categorias */}
          <Nav.Item>
            <Nav.Link as={Link} to="/categorias" className="sidebar-link">
              <FontAwesomeIcon
                icon={faTags}
                size="sm"
                className="sidebar-icon"
              />{" "}
              Categorias
            </Nav.Link>
          </Nav.Item>

          {/* Autor */}
          <Nav.Item>
            <Nav.Link as={Link} to="/autores" className="sidebar-link">
              <FontAwesomeIcon
                icon={faUserEdit}
                size="sm"
                className="sidebar-icon"
              />{" "}
              Autor
            </Nav.Link>
          </Nav.Item>

          {/* Cliente */}
          <Nav.Item>
            <Nav.Link as={Link} to="/clientes" className="sidebar-link">
              <FontAwesomeIcon
                icon={faUsers}
                size="sm"
                className="sidebar-icon"
              />{" "}
              Cliente
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link as={Link} to="/editoras" className="sidebar-link">
              <FontAwesomeIcon
                icon={faBookOpen}
                size="sm"
                className="sidebar-icon"
              />{" "}
              Editora
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link as={Link} to="/bancas" className="sidebar-link">
              <FontAwesomeIcon 
                icon={faBook}
                size="sm"
                className="sidebar-icon"
              />{" "}
              Bancas
            </Nav.Link>
          </Nav.Item>
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;