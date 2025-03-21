// export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import "../style/Login.css";
import nootbookImg from "../img/nootbook.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        setLoading(false);
        if (response.status === 401) {
          throw new Error("Email ou senha inválidos");
        } else {
          throw new Error("Erro ao tentar fazer login");
        }
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      console.log(data.token, data.role);
      
      setSuccess(true);

      // Aguarda 2 segundos para exibir a animação antes de redirecionar
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setErro(
        error.message === "Failed to fetch"
          ? "Sistema indisponível. Tente novamente mais tarde."
          : error.message
      );
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="app-title">
        <span className="left">APLICAT</span>
        <span className="right">IONWEB</span>
      </h1>

      <div className="left-side">
        <img src={nootbookImg} alt="Login" className="login-image" />
      </div>

      <div className="right-side">
        <Card className={`login-card ${success ? "fade-out" : ""}`}>
          <Card.Body>
            <h1 className="login-title">LOGIN</h1>
            {erro && <Alert variant="danger">{erro}</Alert>}
            {loading && (
              <div className="loading-container">
                <Spinner animation="border" variant="info" />
                <p>Entrando...</p>
              </div>
            )}
            {!loading && !success && (
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value.toLocaleLowerCase())
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  ENVIAR
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;
