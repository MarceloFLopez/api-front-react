import React from "react";
import Sidebar from "./Sidebar"; // Importando o Sidebar
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar /> {/* Sidebar fixo na lateral esquerda */}
      <div className="content-wrapper" style={{ marginLeft: "179px", padding: "5px", width: "100%" }}>
        <Outlet /> {/* Renderiza o conteúdo da rota */}
      </div>
    </div>
  );
};

export default DashboardLayout;
