import { Nav, Navbar } from "react-bootstrap";

export default function NavbarComponent() {
  return (
    <Navbar bg="secondary" className="mb-4" expand="lg">
      <Navbar.Brand className="text-light" href="/">&nbsp;{' IXChat'}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className="text-light" href="/editar">Editar perfil</Nav.Link>
          <Nav.Link className="text-light" href="/cadastrar">Cadastrar usuário</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
