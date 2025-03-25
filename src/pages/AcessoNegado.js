// pages/AcessoNegado.js
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Container } from "react-bootstrap";
import "../style/Acesso-negado.css";
import  erro404  from '../img/erro404.jpg';

const AcessoNegado = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Container>
        <div className="acesso-negado">
          <h1>Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
          <img src={erro404} alt="Login" className="erro404-img" />
        </div>
      </Container>
    </>
  );
};

export default AcessoNegado;
