import React, {  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container,  Row, Col } from "react-bootstrap";
import Header from "../components/Header"; 
import Footer from "../components/Footer";
import "../style/Dashboard.css";// Certifique-se de que o Header já está configurado

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Se não houver token, redireciona para o login
    }
  }, [navigate]);
  return (
    <div>
      {/* Incluindo o Header */}
      <Header />
      <Container className="dashboard-content">
        <Row>
          <Col>
            <h1>Bem-vindo ao Dashboard</h1>
            <h2>Conteudo aqui</h2>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Dashboard;
