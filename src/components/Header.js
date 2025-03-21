import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../style/Header.css"; // Adicione um arquivo CSS separado para customizações

const Header = () => {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

    // Supondo que o token seja um JWT e contenha o email no payload
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setUserEmail(decodedToken.email); // Definindo o email do usuário
  }, [navigate]);


//     try {
//       // Fazendo a requisição para registrar o logout no backend
//       const response = await fetch("http://localhost:3000/api/auth/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Erro ao registrar o logout no banco de dados");
//       }

//       // Se o logout for registrado com sucesso, remove o token e redireciona para login
//       localStorage.removeItem("token");
//       navigate("/login");
//     } catch (error) {
//       console.error(error);
//       alert("Erro ao tentar fazer logout.");
//     }
//   };
// const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Não há token para realizar o logout");
//         return;
//       }
  
//       console.log("Token para logout:", token); // Log do token para depuração
  
//       const response = await fetch("http://localhost:3000/api/auth/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error("Erro ao registrar o logout no banco de dados");
//       }
  
//       console.log("Logout registrado com sucesso");
  
//       // Remove o token e redireciona para o login
//       localStorage.removeItem("token");
//       navigate("/login");
//     } catch (error) {
//       console.error("Erro ao tentar fazer logout:", error);
//       alert("Erro ao tentar fazer logout.");
//     }
//   };
const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Não há token para realizar o logout");
      return;
    }

    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Enviar o token no formato correto
      },
      body: JSON.stringify({ email: userEmail }), // Enviar o email do usuário no corpo, se necessário
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Erro no logout:", data);
      throw new Error(data.message || "Erro ao registrar o logout no banco de dados");
    }

    localStorage.removeItem("token");
    navigate("/login");
  } catch (error) {
    console.error("Erro ao tentar fazer logout:", error);
    alert("Erro ao tentar fazer logout.");
  }
};

  return (
    <header className="header">
      <div className="logo">
        <img src="/path/to/logo.png" alt="Logo" className="logo-img" />
      </div>

      <div className="header-right">
          {userEmail && <span className="user-email">{userEmail}</span>}
            <Button variant="outline-secondary" onClick={handleLogout}>SAIR</Button>
      </div>
    </header>
  );
};

export default Header;

