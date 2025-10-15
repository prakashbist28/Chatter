import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { AppContext } from "../context/AppContext";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sendMessageRoute, getallMessagesRoute } from "../utils/APIroutes";
import { v4 as uuidv4 } from "uuid";
import { IoMdArrowRoundBack } from "react-icons/io";



function ChatContainer({ backToContacts }) {
  const { currentChat, currentuser, socket, onlineUsers, setcontacts } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      try {
        const { data } = await axios.post(getallMessagesRoute, {
          from: currentuser._id,
          to: currentChat._id,
        });
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [currentChat, currentuser]);

  // Send message handler
  const handleSendMsg = async (msg) => {
    if (!msg) return;
    try {
      const now = new Date();
      await axios.post(sendMessageRoute, {
        from: currentuser._id,
        to: currentChat._id,
        message: msg,
      });

      socket.current.emit("send-msg", {
        from: currentuser._id,
        to: currentChat._id,
        message: msg,
        createdAt: now,
      });

      setMessages((prev) => [
        ...prev,
        { fromSelf: true, message: msg, createdAt: now, isRead: true },
      ]);

      setcontacts((prev) => {
        return prev
          .map((contact) =>
            contact._id === currentChat._id
              ? {
                  ...contact,
                  lastMessage: msg,
                  lastMessageTime: now,
                  unreadCount: 0,
                }
              : contact
          )
          .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      });

      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (!socket.current) return;

    const handleReceive = (msg) => {
      // Use msg.createdAt if provided, else fallback to now
      const msgTime = msg.createdAt ? new Date(msg.createdAt) : new Date();
      setMessages((prev) => [
        ...prev,
        { fromSelf: false, message: msg, createdAt: msgTime, isRead: false },
      ]);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    socket.current.on("msg-receive", handleReceive);

    return () => {
      socket.current.off("msg-receive", handleReceive);
    };
  }, [socket, currentuser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentChat) return <div>Select a chat to start messaging</div>;

  const isOnline = onlineUsers && onlineUsers[currentChat._id];

  const getAvatarSrc = () =>
    currentChat?.avatarImage
      ? `data:image/svg+xml;base64,${currentChat.avatarImage}`
      : "";

  return (
    <Container>
      <div className="chat-header">
        <div className="back" onClick={backToContacts}>
          <IoMdArrowRoundBack />
        </div>
        <div className="">
          <div className="avatar">
            {currentChat.avatarImage ? (
              <img
                src={getAvatarSrc()}
                alt={currentChat.username}
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23999'/%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="placeholder-avatar">👤</div>
            )}
          </div>
          <div className="username">
            <div className="username-specifics">
              <h2>{currentChat.username}</h2>
              {isOnline ? <h3> online </h3> : <h3 style={{ color: "#939393" }}>offline</h3>}
            </div>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={uuidv4()} ref={scrollRef}>
            <div className={`message ${message.fromSelf ? "sent" : "received"}`}>
              <div className="content">
                {message.message}
                <div className="msg-time">
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}


const Container = styled.div`
  display: grid;
  border: 2px solid #7916a7;
  backdrop-filter: blur(50px);
  border-radius: 25px;
  z-index: 10;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  .chat-header {
    box-shadow: 0px 0px 10px #ad10f6;
    background: black;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

      .back {
        padding: 4px;
        border: 2px solid #a600ff;
        border-radius: 50px;
        width: 3rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease-in-out;
        cursor: pointer;

        &:hover {
          background-color: #a600ff;
        }
      }

      div {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 50%;
        background-color: #333;

        img {
          height: 3rem;
          width: 3rem;
          object-fit: cover;
        }

        .placeholder-avatar {
          height: 3rem;
          width: 3rem;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .username h3 {
        color: white;
      }
  }

  .username {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .username-specifics{
      display: flex;
      flex-direction: column;
      gap: 0rem;

      h3{
        font-size: small;
        color: #4ade80;
      }
    }

    h3 {
      color: white;
      margin: 0;
    }

    .status {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: gray; /* default offline */
      transition: background-color 0.3s ease;
    }

    .status.online {
      background-color: #4ade80;
      box-shadow: 0 0 6px #4ade80;
    }

    .status.offline {
      background-color: #888;
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #a600ff;
      border-radius: 1rem;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    .message {
      display: flex;
      align-items: center;
      
      .content {
        display: flex;
        flex-direction: column;
        max-width: 60%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1rem;
        border-radius: 12px;
        line-height: 1.3;
        color: #d1d1d1;
        position: relative;

        .msg-time{
          font-size: 0.2rem;
          color: #888;
          margin-top: 0.2rem;
          display: flex;
          justify-content: flex-end;
        }
      }
    }

    .sent {
      justify-content: flex-end;

      .content {
        background-color: #b804ff44;
        border: 1px solid #ad10f6;
      }
    }

    .received {
      justify-content: flex-start;

      .content {
        background-color: #1212128f;
        border: 1px  solid #939393;
      }
    }
  }

  @media screen and (max-width: 800px) {
    .chat-messages .message .content {
      max-width: 60%;
      padding: 0.5rem;
      font-size: 0.8rem;
      .msg-time{
        font-size: 0.7rem;
        display: flex;
        justify-content: flex-end;        
    }
    }
    
    .chat-header {
      .user-details {
        .avatar img {
          height: 2rem;
          width: 2rem;
        }
      }
    }
  }
`;

export default ChatContainer;
