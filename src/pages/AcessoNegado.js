// pages/AcessoNegado.js
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";

const AcessoNegado = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Container>
        <div className="acesso-negado">
          <h1>Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default AcessoNegado;
