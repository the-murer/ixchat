import {
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/login";
import { Container } from "react-bootstrap";
import NavbarComponent from "./components/navbar";

export default function App() {
  return (
    <>
    <NavbarComponent />
    <Container className="p-3">
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
    </Routes>
    </Container>
    </>
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
