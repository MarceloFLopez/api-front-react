import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
import "../style/Bancas.css";

const Bancas = () => {
  const [bancas, setBancas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanca, setCurrentBanca] = useState(null);
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
    banca.formaPagamento.toLowerCase().includes(busca.toLowerCase()) || 
    banca.situacao.toString().includes(busca.toLowerCase()) || 
    banca.prazoMedio.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirModalNovo = () => {
    setCurrentBanca(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (banca) => {
    setCurrentBanca(banca);
    setIsModalOpen(true);
  };

  const handleSubmitBanca = async (formData) => {
    const token = localStorage.getItem("token");
    const url = currentBanca 
      ? `http://localhost:3000/api/bancas/${currentBanca.id}`
      : "http://localhost:3000/api/bancas";

    try {
      const response = await fetch(url, {
        method: currentBanca ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Erro ao salvar banca");

      // Recarrega a lista após salvar
      const updatedResponse = await fetch("http://localhost:3000/api/bancas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedData = await updatedResponse.json();
      setBancas(updatedData);

      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const BancaModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    initialData = {} 
  }) => {
    const [formData, setFormData] = useState({
      nome: initialData.nome || "",
      situacao: initialData.situacao !== undefined ? initialData.situacao : 1,
      ativacaoTitulo: initialData.ativacaoTitulo || "Sim",
      formatoPdf: initialData.formatoPdf || "EPUB",
      prazoMedio: initialData.prazoMedio || "",
      site: initialData.site || "",
      formaPagamento: initialData.formaPagamento || "",
      beneficios: initialData.beneficios || "",
      mediaAssinantes: initialData.mediaAssinantes || ""
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>{initialData.id ? "Editar Banca" : "Nova Banca"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome*</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Situação*</label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="situacao"
                  checked={!!formData.situacao}
                  onChange={handleChange}
                  id="situacao-checkbox"
                />
                <label htmlFor="situacao-checkbox">
                  {formData.situacao ? "Ativo" : "Inativo"}
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Ativação de Título*</label>
              <select
                name="ativacaoTitulo"
                value={formData.ativacaoTitulo}
                onChange={handleChange}
                required
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>

            <div className="form-group">
              <label>Formato PDF*</label>
              <select
                name="formatoPdf"
                value={formData.formatoPdf}
                onChange={handleChange}
                required
              >
                <option value="EPUB">EPUB</option>
                <option value="PDF">PDF</option>
                <option value="AMBOS">AMBOS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prazo Médio*</label>
              <input
                type="text"
                name="prazoMedio"
                value={formData.prazoMedio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Site</label>
              <input
                type="url"
                name="site"
                value={formData.site}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Forma de Pagamento*</label>
              <input
                type="text"
                name="formaPagamento"
                value={formData.formaPagamento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Benefícios</label>
              <input
                type="text"
                name="beneficios"
                value={formData.beneficios}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Média de Assinantes</label>
              <input
                type="text"
                name="mediaAssinantes"
                value={formData.mediaAssinantes}
                onChange={handleChange}
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="bancas-container">
            <h2>Lista de Bancas</h2>
          <div className="header-with-search">
            <button onClick={abrirModalNovo} className="btn-novo">
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
                    <th id="banca_situacao">Situação</th>
                    <th id="banca_ativacao">Ativação</th>
                    <th id="banca_formato">Formato</th>
                    <th id="banca_site">Site</th>
                    <th id="banca_prazo">Prazo</th>
                    <th id="banca_pagamento">Pagamento</th>
                    <th id="banca_acoes">Ações</th>
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
                        <tr key={banca.id}>
                          <td id="banca_id">{banca.id}</td>
                          <td id="banca_nome">{banca.nome}</td>
                          <td id="banca_situacao">
                            <span className={`status-badge ${banca.situacao ? 'active' : 'inactive'}`}>
                              {banca.situacao ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td id="banca_ativacao">{banca.ativacaoTitulo}</td>
                          <td id="banca_formato">{banca.formatoPdf.toLowerCase()}</td>
                          <td id="banca_site">
                            {banca.site && (
                              <a href={banca.site} target="_blank" rel="noopener noreferrer">
                                {banca.site}
                              </a>
                            )}
                          </td>
                          <td id="banca_prazo">{banca.prazoMedio}</td>
                          <td id="banca_pagamento">{banca.formaPagamento}</td>
                          <td id="banca_acoes">
                            <button 
                              onClick={() => abrirModalEditar(banca)}
                              className="btn-editar"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="no-results">
                        <td colSpan="9">Nenhuma banca encontrada</td>
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
      <BancaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitBanca}
        initialData={currentBanca || {}}
      />
    </>
  );
};

export default Bancas;