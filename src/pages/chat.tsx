import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import axios from "axios";
import _ from 'lodash';
import io from 'socket.io-client';

import Chats from "../components/chats_list";
import MessageList from "../components/message_list";
import { apiUrl, socketUrl } from "../contexts/auth_context";

const getMessages = async (chatId) => {
  const response = await axios.get(`${apiUrl}/messages/${chatId}`);
  return response.data;
}

const ChatInterface = () => {
  const [chatUser, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeChat, setChat] = useState('');
  const [socketServer, setSocketServer] = useState('');
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const socket = io(socketUrl);

    socket.on('connect', () => { console.log('Conectado ao servidor'); });
    setSocketServer(socket);
    return () => {
      socket.disconnect();
      console.log('Desconectado do servidor');
    };
  }, []);

  useEffect(() => {
    const socket = io(socketUrl);

    socket.emit("addNewUser", localStorage.getItem("userId"));
    socket.on("getUsers", (res) => {
      console.log("🚀 ~ socketServer.on ~ res:", res)
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [socketServer]);

  const createChat = async (user, chats) => {
    if (!user) return;
    const receiverId = user._id;
    if (userId && chats.length > 0) {
      const exits = chats.find(chat => chat.participants.includes(receiverId));
      if (exits) {
        const messages = await getMessages(exits._id);

        setChat(exits._id);
        setMessages(_.orderBy(messages, 'createdAt', 'asc'));
        setUser(user);
        return;
      }
    }
    try {
      const response =await axios.post(`${apiUrl}/chats/create`, { userId, receiverId });
      const data = response.data;
      
      setMessages([]);
      setChat(data._id);
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (message) => {
    const messageObj = { chatId: activeChat, userId, content: message };
    const response = await axios.post(`${apiUrl}/messages/create`, messageObj);

    setMessages(_.orderBy([ ...messages, response.data ], 'createdAt', 'asc'));
  };

  console.log("🚀 ~ ChatInterface ~ onlineUsers:", onlineUsers)
  return (
    <Container style={{ height: "80vh", width: "200vw", backgroundColor: "white", padding: "20px", borderRadius: "10px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Chats onlineUsers={onlineUsers} createChat={createChat} />
        <MessageList
         key={activeChat}
         messages={messages} 
         userId={userId} 
         chatUser={chatUser}
         onlineUsers={onlineUsers} 
         handleSendMessage={handleSendMessage} />
      </div>
    </Container>
  );
};

export default ChatInterface;
