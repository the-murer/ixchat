import { Button, Form, Col, Container } from "react-bootstrap";
import { useAuth } from "../contexts/auth_context";
import { FormEvent, useState } from "react";


export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const { registerUser } = useAuth();

    const submit = (e: FormEvent<HTMLFormElement>) => {

        console.log("🚀 ~ submit ~ email, password:", email, password)
        if (password !== confirmPassword) {
            setError("As senhas devem ser iguais");
            return;
        }
        try{
            await registerUser(e,{ name, email, password });
            window.location.reload();
        } catch (error) {
            console.error(error);
            setError(error.message)
        }
    };

    return (
        <Container style={{maxWidth: "500px", backgroundColor: "gray", padding: "20px", borderRadius: "10px" }} className="sm-6">
            <Col>
                    <h1 className="text-center text-light">Criar conta</h1>
                    <Form onSubmit={submit}>
                        <Form.Group controlId="name">
                            <Form.Label className="text-light">Nome</Form.Label>
                            <Form.Control type="name" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="email">
                            <Form.Label className="text-light">Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <br />
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Form.Group controlId="password">
                                <Form.Label className="text-light">Senha</Form.Label>
                                <Form.Control type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Form.Group style={{ marginLeft: "10px" }} controlId="confirmPassword">
                                <Form.Label className="text-light">Confirmar senha</Form.Label>
                                <Form.Control type="password" placeholder="Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </Form.Group>
                        </div>
                        <br />
                        <Button variant="primary" type="submit">
                            Cadastrar
                        </Button>
                        <br />

                        {error !== '' ? <p className="text-danger">{error}</p> : null}
                    </Form>
            </Col>
        </Container>
    );
}