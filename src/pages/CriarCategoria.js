import React, { useState } from "react";

const CriarCategoria = () => {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita reload da página

    const token = localStorage.getItem("token"); // Recupera o token do localStorage

    if (!token) {
      setMensagem("Erro: Você precisa estar logado!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Envia o token JWT
        },
        body: JSON.stringify({ nome }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Categoria criada com sucesso!");
        setNome(""); // Limpa o campo
      } else {
        setMensagem(data.error || "Erro ao criar categoria.");
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      setMensagem("Erro no servidor.");
    }
  };

  return (
    <div>
      <h2>Criar Categoria</h2>
      {mensagem && <p>{mensagem}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <button type="submit">Criar</button>
      </form>
    </div>
  );
};

export default CriarCategoria;
