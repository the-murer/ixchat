import { useState } from "react";
import { TextField, Button, Container, Grid, LinearProgress } from "@mui/material";
import Message from "./messages";

const MessageList = ({ messages, userId, isWaiting, handleSendMessage }) => {

  const [input, setInput] = useState("");


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Container className="sm-9">
      <Grid container direction="column" spacing={2} paddingBottom={5}>
        {messages.map((message: any, index: number) => (
          <Grid item alignSelf={message.userId === userId ? "flex-end" : "flex-start"} key={index}>
            <Message key={index} message={message} />
          </Grid>
        ))}
        <div style={{ display: "flex", flexDirection: "row"}}>

          <TextField
            style={{ marginRight: "10px" }}
            label="Digite sua mensagem"
            variant="outlined"
            disabled={isWaiting}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {isWaiting && <LinearProgress color="inherit" />}
        {!isWaiting && (
          <Grid item>
            <Button style={{ height: "50px", marginTop: "3px" }} variant="contained" color="primary" onClick={handleSendMessage} disabled={isWaiting}>
              Enviar
            </Button>
          </Grid>
        )}
        </div>
      </Grid>
    </Container>
  );
};

export default MessageList;
