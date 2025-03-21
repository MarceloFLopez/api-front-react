// Footer.js
import React from 'react';
import {  Col } from 'react-bootstrap'; // Importando componentes do Bootstrap
import "../style/Footer.css"; // Estilo CSS adicional, se necessário

const Footer = () => {
  return (
    <footer className="footer mt-3">
      <div className="Container p-1">
          <Col md={6} className="text-center text-md-left">
            <p>&copy; 2025 Sua Empresa. Todos os direitos reservados.</p>
          </Col>
          <Col md={6} className="text-center text-md-right">
            <ul className="footer-links list-inline">
              <li className="list-inline-item"><a href="/privacy-policy">Política de Privacidade</a></li>
              <li className="list-inline-item"><a href="/terms">Termos de Uso</a></li>
              <li className="list-inline-item"><a href="/contact">Contato</a></li>
            </ul>
          </Col>
          </div>
    </footer>
  );
};

export default Footer;
