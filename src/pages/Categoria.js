
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/Categorias.css";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // 'editar' ou 'novo'
  const [categoriaEditando, setCategoriaEditando] = useState({ id: null, nome: "" });
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensagem("Erro: Você precisa estar logado!");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/categorias", {
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
          setCategorias(data);
        } else {
          setMensagem("Formato de dados inválido.");
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setMensagem("Erro ao carregar categorias. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [navigate]);

  // Abrir modal para editar
  const abrirModalEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setModalTipo("editar");
    setModalAberto(true);
  };

  // Abrir modal para novo autor
  const abrirModalNovo = () => {
    setCategoriaEditando({ id: null, nome: "" });
    setModalTipo("novo");
    setModalAberto(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalAberto(false);
    setCategoriaEditando({ id: null, nome: "" });
    setModalTipo(null);
  };

  // Salvar autor (editar ou criar)
  const salvarAutor = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        modalTipo === "editar"
          ? `http://localhost:3000/api/categorias/${categoriaEditando.id}`
          : "http://localhost:3000/api/categorias";

      const method = modalTipo === "editar" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: categoriaEditando.nome }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalTipo === "editar") {
          setCategorias((prev) =>
            prev.map((cat) => (cat.id === categoriaEditando.id ? data : cat))
          );
        } else {
          setCategorias((prev) => [...prev, data]);
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

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <Header />
      <Sidebar />
      <main className="main-content">
        <div className="categorias-container">
            <h2>Lista de Categorias</h2>
          <div className="header-with-search">
          <button onClick={abrirModalNovo} className="btn-novo">
            <FontAwesomeIcon icon={faPlus} /> Novo Autor
          </button>
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar categorias..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          

          {mensagem && <div className="mensagem">{mensagem}</div>}

          <div className="table-container">
            <div className="table-header">
              <table className="categorias-table">
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
                <table className="categorias-table">
                  <tbody>
                    {categoriasFiltradas.length > 0 ? (
                      categoriasFiltradas.map((autor) => (
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
              value={categoriaEditando.nome}
              onChange={(e) =>
                setCategoriaEditando({ ...categoriaEditando, nome: e.target.value })
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

export default Categorias;