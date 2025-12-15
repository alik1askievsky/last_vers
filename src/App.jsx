// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ChatBot from "./pages/ChatBot.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          {/* удобный редирект */}
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

          <Route
            path="/auth/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />

          <Route
            path="/auth/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          <Route
            path="/auth/chatbot"
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            }
          />

          {/* если ввели любой неизвестный путь */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
