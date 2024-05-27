

// src/components/Chat.js
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Chats from "../components/chats_list";
import MessageList from "../components/message_list";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setMessages([
      { userId: '', content: "Ola, teste de mensagem bla bla?" },
    ]);
  }, []);

  return (
    <Container style={{ height: "80vh", width: "200vw", backgroundColor: "white", padding: "20px", borderRadius: "10px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Chats />
        <div style={{ width: "10px", height: "100%", backgroundColor: "gray" }} />
        <MessageList messages={messages} userId={userId} isWaiting={false} handleSendMessage={() => {}} />
      </div>
    </Container>
  );
};

export default ChatInterface;
