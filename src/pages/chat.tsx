/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import _ from 'lodash';
import { JSONCodec, StringCodec } from "nats.ws";

import Chats from "../components/chats_list";
import MessageList from "../components/message_list";
import { nats } from "../contexts/auth_context";
import { jwtDecode } from "jwt-decode";

type Token ={
  _id: string;
  exp: string;
  iat: string;
}
type User = {
  _id: string;
  name: string;
  active: boolean;
  email: string;
}

const getMessages = async (nc: any, chatId: string) => {
  const jc = JSONCodec();
  const sc = StringCodec();
  const req = await nc.request("messages", sc.encode(chatId));  
  if (!req) return [{} as any];
  const messages :any = jc.decode(req.data);
  return messages;
}

const getChats = async (nc: any, userId: string) => {
  const jc = JSONCodec();
  const sc = StringCodec();
  const req = await nc.request("chats", sc.encode(userId));  
  if (!req) return [{} as any];
  const chats :any = jc.decode(req.data);
  return chats;
};

const getUsers = async (natsClient: any) => {
  const jc = JSONCodec();
  const reponse = await natsClient.request("users");
  if (!reponse) return [{} as User];
  const users = jc.decode(reponse.data) as [User];
  return users;
};

const handleMessages = (notification: any, setChat: any, setNotifications: any, setMessages: any) => {
  const newMessage = notification._doc;
  setChat((prevActiveChat: any) => {
    if (prevActiveChat !== newMessage.chatId) {
      setNotifications((prevNotif: [any]) => [...prevNotif, { chatId: newMessage.chatId, isRead: false }]);
    } else {
      setMessages((prevMessages: [any]) => _.uniqBy([...prevMessages, newMessage], '_id'));
    }
    return prevActiveChat;
  });
}

const handleChats = (notification: any, setChats: any, userId: any) => {
  const newChat = notification._doc;
  if (newChat.participants.includes(userId)) {
    setChats((prevActiveChat: [any]) => _.uniqBy([...prevActiveChat, newChat], '_id'));
  }
}

const handleStatusChange = (notification: any, setUsers: any) => {
  setUsers((prevUsers: any) => [...prevUsers.map((user: User) => user._id === notification.userId ? { ...user, active: notification.online === true } : user)]);
}

const ChatInterface = () => {
  const [activeChat, setChat] = useState('');  
  const [chatUser, setChatUser] = useState({} as User);
  const [chats, setChats] = useState([] as any);
  const [users, setUsers] = useState([] as any);
  const [messages, setMessages] = useState([{} as any]);
  const [natsClient, setNatsClient] = useState({} as any);
  const [notifications, setNotifications] = useState([{} as any]);
  const userId = (jwtDecode(localStorage.getItem("token") as string) as Token)._id;

  useEffect(() => {
    const setClient = async () => {
      setNatsClient(await nats());
    }
    setClient()
  }, []);

  useEffect(() => {
    if (!natsClient.options) return
    const fetchServers = async () => {
      
      const jc = JSONCodec();
      const sc = StringCodec();
      const notiftSub = natsClient.subscribe("notifications");

      const responseChats = await getChats(natsClient, userId || "");
      setChats(responseChats);
      const responseUsers = await getUsers(natsClient);
      setUsers(responseUsers);
      (async () => {
        for await (const m of notiftSub) {
          const notification : any = jc.decode(m.data);
          if (notification.type === 'message') {
            handleMessages(notification, setChat, setNotifications, setMessages);
        }
        if (notification.type === 'chat') {
          handleChats(notification, setChats, userId);
        }
        if (notification.type === 'status') {
          handleStatusChange(notification, setUsers);
        }
      }
      })();
      natsClient.publish('online', sc.encode(userId));  
    };
    fetchServers();
  }, [natsClient]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      natsClient.publish('offline', StringCodec().encode(userId));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [natsClient]);

  const createChat = async (user: any) => {
    if (!user) return;
    const receiverId = user._id;
    if (userId && chats.length > 0) {
      const existingChat = chats.find((chat: any) => chat.participants.includes(receiverId));
      if (existingChat) {
        const messages = await getMessages(natsClient, existingChat._id);
        if (notifications.length > 0) {
          setNotifications((prev) => prev.filter(notification => notification.chatId !== existingChat._id));
        }

        setChat(existingChat._id);
        setMessages(_.orderBy(messages, 'createdAt', 'asc'));
        setChatUser(user);
        return;
      }
    }
    try {
      
      const jc = JSONCodec();
      const reponse = await natsClient.request("chat:create", jc.encode({ userId, receiverId }));
      const chat: any = jc.decode(reponse.data);

      setMessages([]);
      setChat(chat._id);
      setChatUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (message: any) => {
    const jc = JSONCodec();
    const reponse = await natsClient.request("message:create", jc.encode({ chatId: activeChat, userId, content: message }));
    const msg = jc.decode(reponse.data);
    setMessages(prevMessages => [ ...prevMessages, msg ]);
  };

  return (
    <Container style={{ height: "80vh", width: "200vw", backgroundColor: "white", padding: "20px", borderRadius: "10px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Chats 
          natsClient={natsClient} 
          chats={chats} 
          notifications={notifications} 
          createChat={createChat}
          users={users}
         />
        <MessageList
          key={activeChat}
          messages={messages} 
          userId={userId} 
          chatUser={chatUser}
          handleSendMessage={handleSendMessage} 
        />
      </div>
    </Container>
  );
};

export default ChatInterface;
