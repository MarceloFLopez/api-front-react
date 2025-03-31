import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../style/Bancas.css"

const Bancas = () => {
  const [bancas, setBancas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBancas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:3000/api/bancas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            navigate("/acesso-negado");
          }
          throw new Error("Erro ao carregar bancas");
        }

        const data = await response.json();
        setBancas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBancas();
  }, [navigate]);

  const bancasFiltradas = bancas.filter(banca =>
    banca.nome.toLowerCase().includes(busca.toLowerCase()) ||
    banca.formaPagamento.toLowerCase().includes(busca.toLowerCase() || 
    banca.situacao.toLowerCase().includes(busca.toLowerCase()) || 
    banca.prazoMedio.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <>
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="bancas-container">
            <h2>Lista de Bancas</h2>
          <div className="header-with-search">
             <button onClick={"abrirModalNovo"} className="btn-novo">
                        <FontAwesomeIcon icon={faPlus} /> Nova Banca
                      </button>
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar bancas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <div className="table-container">
            <div className="table-header">
              <table className="bancas-table">
                <thead>
                  <tr>
                    <th id="banca_id">ID</th>
                    <th id="banca_nome">Nome</th>
                    <th id="banca_sitaucao">Situação</th>
                    <th id="banca_ativacao">Ativação</th>
                    <th id="banca_formato">Formato</th>
                    <th id="banca_site">Site</th>
                    <th id="banca_prazo">Prazo</th>
                    <th id="banca_pagamento">Pagamento</th>
                  </tr>
                </thead>
              </table>
            </div>
            
            <div className="table-body">
              {loading ? (
                <div className="loading-skeleton">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="skeleton-row" />
                  ))}
                </div>
              ) : (
                <table className="bancas-table">
                  <tbody>
                    {bancasFiltradas.length > 0 ? (
                      bancasFiltradas.map((banca) => (
                        <tr key={banca.id} >
                          <td id="banca_id">{banca.id}</td>
                          <td id="banca_nome">{banca.nome}</td>
                          <td id="banca_situacao">
                            <span className={`status-badge ${banca.situacao ? 'active' : 'inactive'}`}>
                              {banca.situacao ? "ativo" : "inativo"}
                            </span>
                          </td >
                          <td id="banca_ativacao">{banca.ativacaoTitulo}</td>
                          <td id="banca_formato">{banca.formatoPdf.toLowerCase()}</td>
                          <td id="banca_site">
                            <a href={banca.site} target="_blank" rel="noopener noreferrer">
                              {banca.site}
                            </a>
                          </td>
                          <td id="banca_prazo ">{banca.prazoMedio}</td>
                          <td id="banca_pagamento">{banca.formaPagamento}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="no-results">
                        <td colSpan="8">Nenhuma banca encontrada</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Bancas;