import { useEffect, useState } from "react";
import { Button, Col, ListGroup } from "react-bootstrap";
import { FaCircle } from "react-icons/fa";

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

function Chats({ createChat, onlineUsers }) {
    const userId = localStorage.getItem("userId")
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [showChats, setChatVisualization] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        const response = await getUsers();
        const responseChats = await getChats(userId);

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
              const user = users.find((user) => user._id === participantId);
              const online = onlineUsers.map(o => o.userId).includes(participantId);
              return (
                <ListGroup.Item  key={chat.id} className="list-item" style={{ display: "flex", padding: "10px", justifyContent: "space-between" }} >
                  <h6>{online ? <FaCircle style={{ color: "green" }} /> : <FaCircle style={{ color: "gray" }} />}{` ${user.name}`}</h6>
                  <Button onClick={() => createChat(user, chats)} variant="outline-primary" size="sm" style={{ marginLeft: "10px" }}>
                   Ver conversa
                 </Button>
                </ListGroup.Item>
                    );
              }) :
              users.map((user) => (
                <ListGroup.Item  key={user._id} className="list-item" style={{ display: "flex", padding: "10px", justifyContent: "space-between" }} >
                  <h6>
                    {onlineUsers.map(o => o.userId).includes(user._id) ? <FaCircle style={{ color: "green" }} /> : <FaCircle style={{ color: "gray" }} />}
                    {` ${user.name}`}
                  </h6>
                 <Button onClick={() => createChat(user, chats)} variant="outline-primary" size="sm" style={{ marginLeft: "10px" }}>
                   Conversar
                 </Button>
               </ListGroup.Item>
               ))}
          </ListGroup>
         </div>
    </Col>
) }


export default Chats;