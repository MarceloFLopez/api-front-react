
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/Autores.css";
import Sidebar from "../components/Sidebar";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";

const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // 'editar' ou 'novo'
  const [autorEditando, setAutorEditando] = useState({ id: null, nome: "" });
  const [busca, setBusca] = useState("");

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
          return <Navigate to="/acesso-negado" />;
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
  }, []);

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
      <main>
        <div className="autores-container">
          <h2>Lista de Autores</h2>
          <div className="autores-header">
            <button onClick={abrirModalNovo} className="btn-novo">
              <FontAwesomeIcon icon={faPlus} /> Novo Autor
            </button>
            <input
              type="text"
              placeholder="Buscar Autor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-busca"
            />
          </div>
          {mensagem && <p className="erro-mensagem">{mensagem}</p>}
  
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="tabela-wrapper">
              <table className="autores-tabela">
                <thead>
                  <tr>
                    <th className="cat_id">ID</th>
                    <th className="cat_name">Autores</th>
                    <th className="cat_action">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {autoresFiltradas.length > 0 ? (
                    autoresFiltradas.map((autor) => (
                      <tr key={autor.id}>
                        <td className="cat_id">{autor.id}</td>
                        <td>{autor.nome}</td>
                        <td className="cat_action">
                          <button
                            className="btn-editar"
                            onClick={() => abrirModalEditar(autor)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="Autores-vazio">
                        Nenhuma autor encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
  
      {/* Modal para Editar/Criar autores */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
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