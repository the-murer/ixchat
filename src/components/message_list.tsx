import { useEffect, useRef, useState } from "react";
import { TextField, Button, Container, Grid } from "@mui/material";
import { FaCircle } from "react-icons/fa";

import Message from "./messages";

const MessageList = ({ messages, userId, handleSendMessage, chatUser, onlineUsers }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(input);
      setInput("");
    }
  };

  if (!chatUser.name) {
    return (
      <Container className="sm-9">
        <h2>Selecione uma conversa</h2>
      </Container>
    );
  }
  const online = onlineUsers.map(o => o.userId).includes(chatUser._id)
  return (
    <Container className="sm-9">
      <h2>
        {online ? <FaCircle style={{ color: "green" }} /> : <FaCircle style={{ color: "gray" }} />}
        {chatUser?.name}
        {online 
        ? <h6 style={{ color: "green", marginLeft: "5px" }}>Online</h6> 
        : <h6 style={{ color: "gray", marginLeft: "5px" }}>Offline</h6>}
      </h2>
      <hr />
      <div style={{ height: '60vh', overflow: 'scroll' }}>
        {messages.map((message) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: message.userId === userId ? "flex-end" : "flex-start"
            }}
            key={message._id}
          >
            <Message userId={userId} message={message} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "15px", bottom: "0" }}>
        <TextField
          style={{ marginRight: "10px" }}
          label="Digite sua mensagem"
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Grid item>
          <Button
            style={{ height: "50px", marginTop: "3px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              handleSendMessage(input);
              setInput("");
            }}
          >
            Enviar
          </Button>
        </Grid>
      </div>
    </Container>
  );
};

export default MessageList;
