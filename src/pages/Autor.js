
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/Autores.css";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // 'editar' ou 'novo'
  const [autorEditando, setAutorEditando] = useState({ id: null, nome: "" });
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  // Buscar autores da API
  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensagem("Erro: Você precisa estar logado!");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/autores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403) {
          navigate("/acesso-negado")
          return; 
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setAutores(data);
        } else {
          setMensagem("Formato de dados inválido.");
        }
      } catch (error) {
        console.error("Erro ao buscar autores:", error);
        setMensagem("Erro ao carregar autores. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAutores();
  }, [navigate]);

  // Abrir modal para editar
  const abrirModalEditar = (autor) => {
    setAutorEditando(autor);
    setModalTipo("editar");
    setModalAberto(true);
  };

  // Abrir modal para novo autor
  const abrirModalNovo = () => {
    setAutorEditando({ id: null, nome: "" });
    setModalTipo("novo");
    setModalAberto(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalAberto(false);
    setAutorEditando({ id: null, nome: "" });
    setModalTipo(null);
  };

  // Salvar autor (editar ou criar)
  const salvarAutor = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        modalTipo === "editar"
          ? `http://localhost:3000/api/autores/${autorEditando.id}`
          : "http://localhost:3000/api/autores";

      const method = modalTipo === "editar" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: autorEditando.nome }),
      });

      if (response.ok) {
        // Recarregar a lista de autores
        const data = await response.json();
        if (modalTipo === "editar") {
          setAutores((prev) =>
            prev.map((cat) => (cat.id === autorEditando.id ? data : cat))
          );
        } else {
          setAutores((prev) => [...prev, data]);
        }
        fecharModal();
      } else {
        setMensagem("Erro ao salvar autor.");
      }
    } catch (error) {
      console.error("Erro ao salvar autor:", error);
      setMensagem("Erro ao salvar autor. Tente novamente.");
    }
  };

  // Filtrar autores
  const autoresFiltradas = autores.filter((autor) =>
    autor.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="autores-container">
            <h2>Lista de Autores</h2>
          <div className="header-with-search">
          <button onClick={abrirModalNovo} className="btn-novo">
            <FontAwesomeIcon icon={faPlus} /> Novo Autor
          </button>
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar autores..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          

          {mensagem && <div className="mensagem">{mensagem}</div>}

          <div className="table-container">
            <div className="table-header">
              <table className="autores-table">
                <thead>
                  <tr>
                    <th className="th_id">ID</th>
                    <th className="th_nome">Nome</th>
                    <th className="th_acao">Ações</th>
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
                <table className="autores-table">
                  <tbody>
                    {autoresFiltradas.length > 0 ? (
                      autoresFiltradas.map((autor) => (
                        <tr key={autor.id}>
                          <td className="tbody_id">{autor.id}</td>
                          <td className="tbody_nome">{autor.nome}</td>
                          <td>
                            <button
                              className="btn-editar tbody_btn" 
                              onClick={() => abrirModalEditar(autor)}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="no-results">
                        <td colSpan="3">Nenhum autor encontrado</td>
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

      {/* Modal (PERMANECE EXATAMENTE IGUAL) */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>{modalTipo === "editar" ? "Editar Autor" : "Novo Autor"}</h2>
            <input
              type="text"
              value={autorEditando.nome}
              onChange={(e) =>
                setAutorEditando({ ...autorEditando, nome: e.target.value })
              }
              className="modal-input"
            />
            <div className="modal-botoes">
              <button onClick={salvarAutor}>Salvar</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Autores;