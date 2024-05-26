import {
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/login";
import { Container } from "react-bootstrap";
import NavbarComponent from "./components/navbar";
import Register from "./pages/register";
import { useEffect, useState } from "react";
import { AuthContextProvider } from "./contexts/auth_context.tsx";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        setAuthenticated(true);
      }
    };

    checkUser();
  }, []);


  if (!authenticated) {
    return(
      
    <AuthContextProvider>
      <Container className="p-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
        </Routes>
      </Container>
    </AuthContextProvider>
      ) 
  }

  return (
    <AuthContextProvider>
      
      <NavbarComponent />
      <Container className="p-3">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </AuthContextProvider>
  );
}

function Home() {
  return (
    <>
      <h1>Ola!</h1>
      <p>
        Placeholder
      </p>
    </>
  );
}

export default App;