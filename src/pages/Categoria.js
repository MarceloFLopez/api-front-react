
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/Categorias.css";
import Sidebar from "../components/Sidebar";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // 'editar' ou 'novo'
  const [categoriaEditando, setCategoriaEditando] = useState({ id: null, nome: "" });
  const [busca, setBusca] = useState("");

  // Buscar categorias da API
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
          return <Navigate to="/acesso-negado" />;
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
  }, []);

  // Abrir modal para editar
  const abrirModalEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setModalTipo("editar");
    setModalAberto(true);
  };

  // Abrir modal para nova categoria
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

  // Salvar categoria (editar ou criar)
  const salvarCategoria = async () => {
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
        // Recarregar a lista de categorias
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
        setMensagem("Erro ao salvar categoria.");
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      setMensagem("Erro ao salvar categoria. Tente novamente.");
    }
  };

  // Filtrar categorias
  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <Header />
      <Sidebar />
      <main>
        <div className="categorias-container">
          <h2>Lista de Categorias</h2>
          <div className="categorias-header">
            <button onClick={abrirModalNovo} className="btn-novo">
              <FontAwesomeIcon icon={faPlus} /> Nova Categoria
            </button>
            <input
              type="text"
              placeholder="Buscar categoria..."
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
              <table className="categorias-tabela">
                <thead>
                  <tr>
                    <th className="cat_id">ID</th>
                    <th className="cat_name">Categoria</th>
                    <th className="cat_action">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriasFiltradas.length > 0 ? (
                    categoriasFiltradas.map((categoria) => (
                      <tr key={categoria.id}>
                        <td className="cat_id">{categoria.id}</td>
                        <td>{categoria.nome}</td>
                        <td className="cat_action">
                          <button
                            className="btn-editar"
                            onClick={() => abrirModalEditar(categoria)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="categorias-vazio">
                        Nenhuma categoria encontrada.
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
  
      {/* Modal para Editar/Criar Categoria */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalTipo === "editar" ? "Editar Categoria" : "Nova Categoria"}</h2>
            <input
              type="text"
              value={categoriaEditando.nome}
              onChange={(e) =>
                setCategoriaEditando({ ...categoriaEditando, nome: e.target.value })
              }
              className="modal-input"
            />
            <div className="modal-botoes">
              <button onClick={salvarCategoria}>Salvar</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Categorias;