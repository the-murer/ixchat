

// src/components/Chat.js
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Chats from "../components/chats_list";
import MessageList from "../components/message_list";
import { apiUrl } from "../contexts/auth_context";
import axios from "axios";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [activeChat, setChat] = useState('');
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setMessages([
      { userId: '', content: "Ola, teste de mensagem bla bla?" },
    ]);
  }, []);

  const createChat = async (receiverId, chats) => {
    if (!userId) return;
    if (userId && chats.length > 0) {
      const exits = chats.find((chat) => chat.participants.includes(receiverId));
      if (exits) {
        setChat(exits._id);
        return;
      }
    }
    try {
      const response =await axios.post(`${apiUrl}/chats/create`, { userId, receiverId });
      const data = response.data;
      
      setChat(data._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container style={{ height: "80vh", width: "200vw", backgroundColor: "white", padding: "20px", borderRadius: "10px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Chats createChat={createChat} />
        <MessageList key={activeChat} messages={messages} userId={userId} isWaiting={false} handleSendMessage={() => {}} />
      </div>
    </Container>
  );
};

export default ChatInterface;
