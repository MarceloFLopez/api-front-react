import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/Categorias.css"; // Arquivo CSS para estilização
import Sidebar from "../components/Sidebar";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token"); // Pegando o token JWT
        if (!token) {
          setMensagem("Erro: Você precisa estar logado!");
          return;
        }

        const response = await fetch("http://localhost:3000/api/categorias", {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token JWT
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar categorias");
        }

        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setMensagem("Erro ao carregar categorias.");
      }
    };

    fetchCategorias();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <main>
        <div className="categorias-container">
          <h2>Lista de Categorias</h2>
          {mensagem && <p className="erro-mensagem">{mensagem}</p>}

          <table className="categorias-tabela">
            <thead>
              <tr>
                <th className="cat_id">ID</th>
                <th className="cat_name">Categoria</th>
                <th className="cat_action">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>{categoria.id}</td>
                    <td>{categoria.nome}</td>
                    <td>
                      <button className="btn-editar">Editar</button>
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
      </main>
      <Footer />
    </>
  );
};

export default Categorias;
