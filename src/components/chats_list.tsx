/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button, Col, ListGroup } from "react-bootstrap";
import { FaCircle } from "react-icons/fa";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import { apiUrl } from "../contexts/auth_context";
import { jwtDecode } from "jwt-decode";

type User = {
_id: string;
name: string;
email: string;
}
type Token ={
  _id: string;
  exp: string;
  iat: string;
}

const getUsers = async () => {
    const response = await axios.get(`${apiUrl}/users/list`);
    return response.data;
};

interface ChatsProps {
  createChat: (arg: any, arg2: any) => void;
  onlineUsers: any[];
  chats: any[];
  notifications: any[];
}

function Chats({ createChat, onlineUsers, notifications, chats }: ChatsProps) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({} as User); 
  const [showChats, setChatVisualization] = useState(true);
  const [loading, setLoading] = useState(true);
  const userId = (jwtDecode(localStorage.getItem("token") as string) as Token)._id;

    useEffect(() => {
      const fetchData = async () => {
        const response = await getUsers();
        setUser(response.find((user: User) => user._id === userId));
        setUsers(response.filter((user: User) => user._id !== userId));
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
          {!!user?.name && 
          (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px" }}>
           {`Logado como ${user?.name}`}
          </div>)}
          <ListGroup variant="flush" className="sidebar-list">
            {showChats && chats ? chats.map((chat: any) => {
              const participantId = chat?.participants?.find((p: string) => p !== userId);
              const user: any = users.find((user: User) => user._id === participantId);
              const online = onlineUsers.map((o: any) => o.userId).includes(participantId);
              const newMessage = notifications.find((n: any) => n.chatId === chat._id)?.isRead === false; 
              return (
                <ListGroup.Item  key={chat.participants.join(':')} className="list-item" style={{ display: "flex", padding: "10px", justifyContent: "space-between" }} >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h6>
                      {online ? <FaCircle style={{ color: "green" }} /> : <FaCircle style={{ color: "gray" }} />}{` ${user?.name}`}
                    </h6>
                    {newMessage ? <p>Nova(s) mensagens</p> : null}
                  </div>
                  <Button onClick={() => createChat(user, chats)} variant="outline-primary" size="sm" style={{ marginLeft: "10px" }}>
                   Ver conversa
                 </Button>
                </ListGroup.Item>
                    );
              }) :
              users.map((user: User) => (
                <ListGroup.Item  key={user._id} className="list-item" style={{ display: "flex", padding: "10px", justifyContent: "space-between" }} >
                  <h6>
                    {onlineUsers.map((o: any) => o.userId).includes(user._id) ? <FaCircle style={{ color: "green" }} /> : <FaCircle style={{ color: "gray" }} />}
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