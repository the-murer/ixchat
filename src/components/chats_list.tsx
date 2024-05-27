import { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup } from "react-bootstrap";

import { apiUrl } from "../contexts/auth_context";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const getUsers = async () => {
    const response = await axios.get(`${apiUrl}/users/list`);
    return response.data;
};

const getChats = async (userId: string) => {
    const response = await axios.get(`${apiUrl}/chats/${userId}`);
    return response.data;
};

function Chats({ createChat }) {
    const userId = localStorage.getItem("userId")
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [showChats, setChatVisualization] = useState(true);
    const [loading, setLoading] = useState(true);
    // console.log('USUARIOS', await getUsers())
    useEffect(() => {
      const fetchData = async () => {
        const response = await getUsers();
        const responseChats = await getChats(userId);
        console.log("🚀 ~ fetchData ~ responseChats:", responseChats)
        setUsers(response.filter((user) => user._id !== userId));
        setChats(responseChats);
        setLoading(false);
      };
    
      fetchData();
    }, []);
    

    if (loading) {
      return (
      <Col xs={3} style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        <CircularProgress color="primary" size={50} thickness={5} />
      </Col>
      )
    }
    return (
      <Col xs={4}>
        <div className="sidebar-card">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">{showChats ? "Chats" : "Usuarios"}</h4>
            <Button size="sm" variant="outline-primary" onClick={() => setChatVisualization(!showChats)}>
              {showChats ? "Ver usuarios" : "Ver chats"}
            </Button>
          </div>
          <hr />
          <ListGroup variant="flush" className="sidebar-list">
            {showChats ? chats.map((chat) => {
              const participantId = chat.participants.find((p) => p !== userId);
              const label = users.find((user) => user._id === participantId)?.name;

              return (
                <ListGroup.Item  key={chat.id} className="list-item" style={{ display: "flex", padding: "10px", justifyContent: "space-between" }} >
                  <h6>{label}</h6>
                  <Button onClick={() => createChat(user._id, chats)} variant="outline-primary" size="sm" style={{ marginLeft: "10px" }}>
                   Ver conversa
                 </Button>
                </ListGroup.Item>
                    );
              }) :
              users.map((user) => (
                <ListGroup.Item  key={user._id} className="list-item" style={{ display: "flex", padding: "10px", justifyContent: "space-between" }} >
                  <h6>{user.name}</h6>
                 <Button onClick={() => createChat(user._id, chats)} variant="outline-primary" size="sm" style={{ marginLeft: "10px" }}>
                   Conversar
                 </Button>
               </ListGroup.Item>
               ))}
          </ListGroup>
         </div>
    </Col>
) }


export default Chats;