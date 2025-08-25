import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host } from '../utils/APIroutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';
import Header from '../components/Header';

function Chat() {
  const socket = useRef();
  const [contacts, setcontacts] = useState([]);
  const [currentuser, setcurrentuser] = useState(undefined);
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isloaded, setisloaded] = useState(false);
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem('chatter-users');
      if (!storedUser) {
        navigate('/login');
      } else {
        try {
          setcurrentuser(JSON.parse(storedUser));
          setisloaded(true);
        } catch (err) {
          console.error("Invalid JSON in chatter-users:", err);
          localStorage.removeItem('chatter-users'); // clear corrupted data
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);
  

  useEffect(() => {
    if (currentuser) {
      socket.current = io(host);
      socket.current.emit('add-user', currentuser._id);
    }
  }, [currentuser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentuser) {
        if (currentuser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentuser._id}`);
          setcontacts(data.data);
        } else {
          navigate('/setavatar');
        }
      }
    };
    fetchData();
  }, [currentuser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    if (windowWidth < 800) {
      setShowChatContainer(true); 
    }
  };

  const handleBackToContacts = () => {
    setCurrentChat(undefined); // Reset currentChat when going back to contacts
    setShowChatContainer(false); 
  };

  return (
    <div>
      <Header />
      <Container>
        <div className="container">
          {windowWidth < 800 ? (
            showChatContainer ? (
              <ChatContainer
                className="chatcontainer"
                currentchat={currentChat}
                currentuser={currentuser}
                socket={socket}
                backToContacts={handleBackToContacts} // Pass the function
              />
            ) : (
              <Contacts
                contacts={contacts}
                currentuser={currentuser}
                changeChat={handleChatChange}
              />
            )
          ) : (
            <>
              <Contacts
                contacts={contacts}
                currentuser={currentuser}
                changeChat={handleChatChange}
              />
              {isloaded && currentChat === undefined ? (
                <Welcome currentuser={currentuser} />
              ) : (
                <ChatContainer
                  className="chatcontainer"
                  currentchat={currentChat}
                  currentuser={currentuser}
                  socket={socket}
                  backToContacts={handleBackToContacts} // Pass the function
                />
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
    grid-template-columns: 25% 75%;
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
