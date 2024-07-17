/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Col, Container } from "react-bootstrap";
import React, {  FormEvent, useEffect, useState } from "react";

import { nats, useAuth } from "../contexts/auth_context.tsx";
import { Button, Grid, Link } from "@mui/material";
import  { JSONCodec } from "nats.ws";

type UserResponse = {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [natsClient, setNatsClient] = useState({} as any);
    const { storeUser } = useAuth();


    useEffect(() => {
        const setClient = async () => {
          setNatsClient(await nats());
        }
        setClient()
      }, []);
  
      const submit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (!email || !password) {
              setError("Informações faltantes, verifique!");
              return;
          }

          try{
              const jc = JSONCodec();
              const reponse = await natsClient.request("user:login", jc.encode({ email, password, type: 'login' }));
              if (!reponse) return;
              const user = jc.decode(reponse.data) as UserResponse;
              if (user) {
                storeUser(user);
                window.location.reload();
              }
          } catch (error) {
              console.log('🚀 ~ error:', error);
              if (error instanceof Error) {
                  setError(error.message);
                } else {
                  console.error('Erro desconhecido', error);
                }
          }
      };

    return (
        <Container style={{ maxWidth: "500px", backgroundColor: "white", padding: "20px", borderRadius: "10px" }} className="sm-6">
            <Col>
                <h1 className="text-center text-dark">Login</h1>
                <Form onSubmit={submit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="text-light">Email</Form.Label>
                        <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="text-light">Senha</Form.Label>
                        <Form.Control type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    </Form.Group>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                      Fazer login
                    </Button>
                    {error !== '' ? <p className="text-danger">{error}</p> : null}
                </Form>
                <br />
                <Grid container>
                    <Grid item>
                      <Link href="/registrar" variant="body2">
                        {"Não tem uma conta? Cadastre-se"}
                      </Link>
                    </Grid>
                </Grid>
            </Col>
        </Container>
    );
}
