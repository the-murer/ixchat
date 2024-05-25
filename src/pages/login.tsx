import { Button, Form, Col, Container } from "react-bootstrap";


export default function Login() {


    return (
        <Container style={{maxWidth: "500px", backgroundColor: "gray", padding: "20px", borderRadius: "10px" }} className="sm-6">
            <Col>
                    <h1 className="text-center text-light">Login</h1>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-light">Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="text-light">Senha</Form.Label>
                            <Form.Control type="password" placeholder="Senha" />
                        <br />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Fazer login
                        </Button>
                    </Form>
            </Col>
        </Container>
    );
}