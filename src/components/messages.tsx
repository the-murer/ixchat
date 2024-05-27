import React from 'react';

const Message = ({ message }) => {
  return (
    <div style={{ textAlign: message.isUser ? "right" : "left", margin: "8px" }}>
      <div
        style={{
          color: message.isUser ? "#ffffff" : "#000000",
          backgroundColor: message.isUser ? "#1186fe" : "#eaeaea",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        {message.content.split("\n").map((text: string, index: string) => (
          <React.Fragment key={index}>
            {text}
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Message;
