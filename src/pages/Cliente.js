
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/Clientes.css";
import Sidebar from "../components/Sidebar";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // 'editar' ou 'novo'
  const [clienteEditando, setClienteEditando] = useState({ id: null, nome: "" });
  const [busca, setBusca] = useState("");

  // Buscar clientes da API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensagem("Erro: Você precisa estar logado!");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/clientes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403) {
          return <Navigate to="/acesso-negado" />;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          setMensagem("Formato de dados inválido.");
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setMensagem("Erro ao carregar clientes. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Abrir modal para editar
  const abrirModalEditar = (cliente) => {
    setClienteEditando(cliente);
    setModalTipo("editar");
    setModalAberto(true);
  };

  // Abrir modal para nova Cliente
  const abrirModalNovo = () => {
    setClienteEditando({ id: null, nome: "" });
    setModalTipo("novo");
    setModalAberto(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalAberto(false);
    setClienteEditando({ id: null, nome: "" });
    setModalTipo(null);
  };

  // Salvar cliente (editar ou criar)
  const salvarCliente = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        modalTipo === "editar"
          ? `http://localhost:3000/api/clientes/${clienteEditando.id}`
          : "http://localhost:3000/api/clientes";

      const method = modalTipo === "editar" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: clienteEditando.nome }),
      });

      if (response.ok) {
        // Recarregar a lista de clientes
        const data = await response.json();
        if (modalTipo === "editar") {
          setClientes((prev) =>
            prev.map((cat) => (cat.id === clienteEditando.id ? data : cat))
          );
        } else {
          setClientes((prev) => [...prev, data]);
        }
        fecharModal();
      } else {
        setMensagem("Erro ao salvar cliente.");
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setMensagem("Erro ao salvar cliente. Tente novamente.");
    }
  };

  // Filtrar Clientes
  const clientesFiltradas = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <Header />
      <Sidebar />
      <main>
        <div className="clientes-container">
          <h2>Lista de Clientes</h2>
          <div className="clientes-header">
            <button onClick={abrirModalNovo} className="btn-novo">
              <FontAwesomeIcon icon={faPlus} /> Novo CLiene
            </button>
            <input
              type="text"
              placeholder="Buscar cliente..."
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
              <table className="clientes-tabela">
                <thead>
                  <tr>
                    <th className="cat_id">ID</th>
                    <th className="cat_name">Cliente</th>
                    <th className="cat_action">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltradas.length > 0 ? (
                    clientesFiltradas.map((cliente) => (
                      <tr key={cliente.id}>
                        <td className="cat_id">{cliente.id}</td>
                        <td>{cliente.nome}</td>
                        <td className="cat_action">
                          <button
                            className="btn-editar"
                            onClick={() => abrirModalEditar(cliente)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="clientes-vazio">
                        Nenhuma Cliente encontrada.
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
  
      {/* Modal para Editar/Criar cliente */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalTipo === "editar" ? "Editar Cliente" : "Novo CLiente"}</h2>
            <input
              type="text"
              value={clienteEditando.nome}
              onChange={(e) =>
                setClienteEditando({ ...clienteEditando, nome: e.target.value })
              }
              className="modal-input"
            />
            <div className="modal-botoes">
              <button onClick={salvarCliente}>Salvar</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Clientes;