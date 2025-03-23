
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/Editoras.css";
import Sidebar from "../components/Sidebar";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";

const Editoras = () => {
  const [editoras, setEditoras] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // 'editar' ou 'novo'
  const [editoraEditando, setEditoraEditando] = useState({ id: null, nome: "" });
  const [busca, setBusca] = useState("");

  // Buscar editoras da API
  useEffect(() => {
    const fetchEdioras = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensagem("Erro: Você precisa estar logado!");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/editoras", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403) {
          return <Navigate to="/acesso-negado" />;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setEditoras(data);
        } else {
          setMensagem("Formato de dados inválido.");
        }
      } catch (error) {
        console.error("Erro ao buscar editoras:", error);
        setMensagem("Erro ao carregar editoras. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEdioras();
  }, []);

  // Abrir modal para editar
  const abrirModalEditar = (editora) => {
    setEditoraEditando(editora);
    setModalTipo("editar");
    setModalAberto(true);
  };

  // Abrir modal para nova categoria
  const abrirModalNovo = () => {
    setEditoraEditando({ id: null, nome: "" });
    setModalTipo("novo");
    setModalAberto(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalAberto(false);
    setEditoraEditando({ id: null, nome: "" });
    setModalTipo(null);
  };

  // Salvar editora (editar ou criar)
  const salvarEditora = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        modalTipo === "editar"
          ? `http://localhost:3000/api/editoras/${editoraEditando.id}`
          : "http://localhost:3000/api/editoras";

      const method = modalTipo === "editar" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: editoraEditando.nome }),
      });

      if (response.ok) {
        // Recarregar a lista de editoras
        const data = await response.json();
        if (modalTipo === "editar") {
          setEditoras((prev) =>
            prev.map((cat) => (cat.id === editoraEditando.id ? data : cat))
          );
        } else {
          setEditoras((prev) => [...prev, data]);
        }
        fecharModal();
      } else {
        setMensagem("Erro ao salvar editora.");
      }
    } catch (error) {
      console.error("Erro ao salvar editora:", error);
      setMensagem("Erro ao salvar editora. Tente novamente.");
    }
  };

  // Filtrar editoras
  const editorasFiltradas = editoras.filter((editora) =>
    editora.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <Header />
      <Sidebar />
      <main>
        <div className="editoras-container">
          <h2>Lista de Editoras</h2>
          <div className="editoras-header">
            <button onClick={abrirModalNovo} className="btn-novo">
              <FontAwesomeIcon icon={faPlus} /> Nova Editora
            </button>
            <input
              type="text"
              placeholder="Buscar editora..."
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
              <table className="editoras-tabela">
                <thead>
                  <tr>
                    <th className="cat_id">ID</th>
                    <th className="cat_name">Editora</th>
                    <th className="cat_action">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {editorasFiltradas.length > 0 ? (
                    editorasFiltradas.map((editora) => (
                      <tr key={editora.id}>
                        <td className="cat_id">{editora.id}</td>
                        <td>{editora.nome}</td>
                        <td className="cat_action">
                          <button
                            className="btn-editar"
                            onClick={() => abrirModalEditar(editora)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="editoras-vazio">
                        Nenhuma editora encontrada.
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
  
      {/* Modal para Editar/Criar editora */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalTipo === "editar" ? "Editar Editora" : "Nova Editora"}</h2>
            <input
              type="text"
              value={editoraEditando.nome}
              onChange={(e) =>
                setEditoraEditando({ ...editoraEditando, nome: e.target.value })
              }
              className="modal-input"
            />
            <div className="modal-botoes">
              <button onClick={salvarEditora}>Salvar</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Editoras;