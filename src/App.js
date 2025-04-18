import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./components/Dashboard";
import Categorias from "./pages/Categoria";
import Bancas from "./pages/Banca"; // Nova página
import Autores from "./pages/Autor";
import Clientes from "./pages/Cliente"; // Nova página
import ProtectedRoute from "./auth/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import { AuthProvider } from "./auth/AuthContext";
import AcessoNegado from "./pages/AcessoNegado"; // Nova página
import NotFound from "./pages/NotFound"; // Página de erro 404
import Editoras from "./pages/Editora";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redireciona o caminho raiz para /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rota pública para login */}
          <Route path="/login" element={<Login />} />

          {/* Rota para Dashboard e Categorias com acesso controlado */}
          <Route element={<ProtectedRoute allowedRoles/>}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/autores" element={<Autores />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/editoras" element={<Editoras />} />
              <Route path="/bancas" element={<Bancas />} />
            </Route>
          </Route>

          {/* Página de Acesso Negado */}
          <Route path="/acesso-negado" element={<AcessoNegado />} />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
