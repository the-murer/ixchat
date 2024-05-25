import { Nav, Navbar } from "react-bootstrap";

export default function NavbarComponent() {
  return (
    <Navbar bg="secondary" className="mb-4" expand="lg">
      <Navbar.Brand href="/">&nbsp;{' IXChat'}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
