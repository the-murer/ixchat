import {
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/login";
import { Container } from "react-bootstrap";
import NavbarComponent from "./components/navbar";
import Register from "./pages/register";
import React, { useEffect, useState } from "react";
import { AuthContextProvider } from "./contexts/auth_context.tsx";
import Chat from "./pages/chat.tsx";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const userId = localStorage.getItem("token");
      if (userId) {
        setAuthenticated(true);
      }
    };

    checkUser();
  }, []);


  if (!authenticated) {
    return(
      
      <div style={{ backgroundColor: "#222244", height: "100vh" }}>
      <AuthContextProvider>
      <Container className="p-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
        </Routes>
      </Container>
    </AuthContextProvider>
    </div>
      ) 
  }

  return (
    <div style={{ backgroundColor: "#222244", height: "100vh" }}>
    <AuthContextProvider>
      <NavbarComponent />
      <Container>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/cadastrar" element={<Register />} />
        </Routes>
      </Container>
    </AuthContextProvider>
    </div>
  );
}



export default App;