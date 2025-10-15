import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import Welcome from "../components/Welcome";
import Header from "../components/Header";

function Chat() {
  const {
    currentuser,
    setcurrentuser,
    currentChat,
    setCurrentChat,
    contacts,
    setcontacts,
    socket,
    isLoaded,
    setIsLoaded,
    markMessagesAsRead, // <-- get from context
  } = useContext(AppContext);

  const [showChatContainer, setShowChatContainer] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("chatter-users");
    if (!storedUser) navigate("/login");
    else {
      try {
        setcurrentuser(JSON.parse(storedUser));
        setIsLoaded(true);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("chatter-users");
        navigate("/login");
      }
    }
  }, [navigate, setcurrentuser, setIsLoaded]);

  // Mark as read when opening a chat
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    if (chat && chat._id) {
      markMessagesAsRead(chat._id);
    }
    if (windowWidth < 800) setShowChatContainer(true);
  };

  const handleBackToContacts = () => {
    setCurrentChat(undefined);
    setShowChatContainer(false);
  };

  return (
    <div>
      <Header />
      <Container>
        <div className="container">
          {windowWidth < 800 ? (
            showChatContainer ? (
              <ChatContainer backToContacts={handleBackToContacts} />
            ) : (
              <Contacts changeChat={handleChatChange} />
            )
          ) : (
            <>
              <Contacts changeChat={handleChatChange} />
              {isLoaded && !currentChat ? (
                <Welcome />
              ) : (
                <ChatContainer backToContacts={handleBackToContacts} />
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #1c1c32;

  .container {
    height: 85vh;
    width: 85vw;
    display: grid;
    grid-template-columns: 30% 70%;

    gap: 10px;

    @media screen and (min-width: 800px) and (max-width: 1000px) {
      grid-template-columns: 35% 65%;
    }
    @media screen and (min-width: 360px) and (max-width: 800px) {
      grid-template-columns: 100%;
    }
  }
`;

export default Chat;