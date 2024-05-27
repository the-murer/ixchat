/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import axios from "axios";
import _ from 'lodash';
import io from 'socket.io-client';

import Chats from "../components/chats_list";
import MessageList from "../components/message_list";
import { apiUrl, socketUrl } from "../contexts/auth_context";

const getMessages = async (chatId: string) => {
  const response = await axios.get(`${apiUrl}/messages/${chatId}`);
  return response.data;
}

const ChatInterface = () => {
  const [activeChat, setChat] = useState('');  
  const userId = localStorage.getItem("userId");
  const [chatUser, setUser] = useState({} as any);
  const [socket, setSocket] = useState({} as any);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([{} as any]);
  const [lastMessage, setLastMessage] = useState({} as any);
  const [notifications, setNotifications] = useState([{} as any]);

  useEffect(() => {
    const socketInstance = io(socketUrl);

    socketInstance.on('connect', () => { console.log('Conectado ao servidor'); });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      console.log('Desconectado do servidor');
    };
  }, []);

  useEffect(() => {
    if (!socket?.connected) return;

    socket.emit("addNewUser", userId);
    socket.on("getUsers", (users: any) => { setOnlineUsers(users); });

    return () => {
      socket.off("getUsers");
    };
  }, [socket, userId]);

  useEffect(() => {
    if (!socket?.connected || !lastMessage) return;

    socket.emit("sendMessage", { ...lastMessage, receiverId: chatUser._id });
  }, [lastMessage, socket, chatUser]);

  useEffect(() => {
    if (!socket?.connected) return;

    socket.on("getMessage", (message: any) => {
      if (activeChat === message.chatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("getNotification", (notification : any) => {
    
      if (chatUser._id === notification.senderId) {
        setNotifications((prev) => [{ ...notification, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [notification, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, activeChat, chatUser]);

  const createChat = async (user: any, chats: any) => {
    if (!user) return;
    const receiverId = user._id;
    if (userId && chats.length > 0) {
      const existingChat = chats.find((chat: any) => chat.participants.includes(receiverId));
      if (existingChat) {
        const messages = await getMessages(existingChat._id);
        if (notifications.length > 0) {
          setNotifications((prev) => prev.filter(notification => notification.chatId !== existingChat._id));
        }

        setChat(existingChat._id);
        setMessages(_.orderBy(messages, 'createdAt', 'asc'));
        setUser(user);
        return;
      }
    }
    try {
      const response = await axios.post(`${apiUrl}/chats/create`, { userId, receiverId });
      const data = response.data;
      
      setMessages([]);
      setChat(data._id);
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (message: any) => {
    const messageObj = { chatId: activeChat, userId, content: message };
    const response = await axios.post(`${apiUrl}/messages/create`, messageObj);

    setMessages(_.orderBy([ ...messages, response.data ], 'createdAt', 'asc'));
    setLastMessage(response.data);
  };

  return (
    <Container style={{ height: "80vh", width: "200vw", backgroundColor: "white", padding: "20px", borderRadius: "10px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Chats notifications={notifications} onlineUsers={onlineUsers} createChat={createChat} />
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
