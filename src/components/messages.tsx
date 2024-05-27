import moment from 'moment';
import React from 'react';

interface MessageProps {
  message: {
    _id: string;
    content: string;
    createdAt: string;
    userId: string;
  };
  userId: string;
}

const Message: React.FC<MessageProps> = ({ message, userId }) => {
  const userSended = message.userId === userId;
  return (
    <div style={{ textAlign: userSended ? "right" : "left", margin: "8px" }}>
      <div
        style={{
          color: userSended ? "#ffffff" : "#000000",
          backgroundColor: userSended ? "#1186fe" : "#eaeaea",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <React.Fragment>
          {message.content}
          <br />
        <small style={{ fontSize: "11px", alignSelf: "end", right: "10px" }}>{moment(message.createdAt).format("HH:mm")}</small>
        </React.Fragment>
      </div>
    </div>
  );
};

export default Message;
