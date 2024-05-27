import { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup } from "react-bootstrap";

import { apiUrl } from "../contexts/auth_context";
import axios from "axios";

const getUsers = async () => {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
};

function Chats() {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [showChats, setChatVisualization] = useState(true);

    // console.log('USUARIOS', await getUsers())
    useEffect(() => {
        setChats([{ id: "chat 1", users: ["1", "2"] }, { id: "chat 2", users: ["1", "3"] }, { id: "chat 3", users: ["1", "2", "3"] }]);
        setUsers([{ id: '1', name: "user 1" }, { id: '2', name: "user 2" }, { id: '3', name: "user 3" }]);

    }, [])

    return (
      <Col xs={3}>
        <div className="sidebar-card">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">{showChats ? "Chats" : "Usuarios"}</h6>
            <Button size="sm" variant="outline-primary" onClick={() => setChatVisualization(!showChats)}>
              {showChats ? "Ver usuarios" : "Ver chats"}
            </Button>
          </div>
          <ListGroup variant="flush" className="sidebar-list">
            {showChats ? chats.map((chat) => {
              const label = users.filter((user) => chat.users.includes(user.id)).map((user) => user.name).join(", ");
              return (
                <ListGroup.Item  key={chat.id} className="list-item" style={{ padding: "10px" }} >
                  {label}
                </ListGroup.Item>
                    );
              }) :
              users.map((user) => (
               <ListGroup.Item key={user.id} className="list-item" style={{ padding: "10px" }}>
                 {user.name}
               </ListGroup.Item>
               ))}
          </ListGroup>
         </div>
    </Col>
) }


export default Chats;