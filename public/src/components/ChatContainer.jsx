import React,{useState,useEffect,useRef} from 'react'
import styled from 'styled-components'
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios'
import {sendMessageRoute,getallMessagesRoute} from '../utils/APIroutes'
import {v4 as uuidv4} from 'uuid';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


function ChatContainer({ currentchat, currentuser, socket, backToContacts }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();


  useEffect(() => {
    const fetchData = async () => {
      try {
        let sentMessages, receivedMessages;

        const responseSent = await axios.post(getallMessagesRoute, {
          from: currentuser._id,
          to: currentchat._id,
        });

        sentMessages = responseSent.data;

        const responseReceived = await axios.post(getallMessagesRoute, {
          from: currentchat._id,
          to: currentuser._id,
        });

        receivedMessages = responseReceived.data;

        sentMessages = sentMessages.map((message) => ({
          ...message,
          fromSelf: true,
        }));

        receivedMessages = receivedMessages.map((message) => ({
          ...message,
          fromSelf: false,
        }));

        const allMessages = [...sentMessages, ...receivedMessages];
        allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(allMessages);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentchat ) {
      fetchData();
    }
  }, [currentchat, currentuser]);



  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentuser._id,
      to: currentchat._id,
      message: msg,
    });

    socket.current.emit('send-msg', {
      to: currentchat._id,
      from: currentuser._id,
      message: msg,
    });

    const newMessage = { fromSelf: true, message: msg };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-receive', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  return (
    <>
    { 
    currentchat && (
    <Container>
      <div className="chat-header">
        <div className="user-details">
        <div className='back' onClick={backToContacts}>
          <IoMdArrowRoundBack />
          </div>
          <div>
          <div className="avatar">
          <img 
             src={`data:image/svg+xml;base64,${currentchat.avatarImage}`} 
              alt="avatar" 
          />
          </div>
          
          <div className="username">
            <h3>{currentchat.username}</h3>
          </div>
          </div>

          
        </div>
       
      </div>

      <div className="chat-messages">
        {
          messages.map((message)=>{
            return(
              <div ref={scrollRef} key={uuidv4}>
                <div className={`message ${message.fromSelf ? "sent" : "received"}`}>
                  <div className="content">
                    <h1>
                      {message.message}
                    </h1>
                  </div>
                </div>
              </div>
            )
            })
        }
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  )}
  </>
  )
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
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 10% 80% 10%;
  }
  .chat-header {
    box-shadow: 0px 0px 10px #ad10f6;
    background: black;
    padding: 0 2rem;
    .user-details {
      display: flex;
      width: 1005;
      align-items: center;
      padding-top: 1rem;
      justify-content: space-between;
      .back{
        padding: 4px;
        border: 2px solid #a600ff;
        border-radius: 50px;
        width:4rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease-in-out;

        &:hover{
          background-color: #a600ff;
        }

      }
    
      div{
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
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
      &-thumb {
        background-color: #a600ff;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1rem;
        border-radius: 1rem;
        color: #d1d1d1;

      
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
        background-color: #ffffff1f;
        border: 1px solid #939393;
      }
    }
  }
  @media screen and (min-width: 800px) and (max-width: 1000px) {
          max-width: 100%;
        }

  @media screen and (min-width: 360px) and (max-width: 800px) {
          max-width: 100%;
          
          .chat-messages {
    padding: 0.5rem 1rem; 

    .message {
      .content {
        max-width: 70%;
        padding: 0.5rem;  
        font-size: 0.8rem; 
      }
    }
  } 
        }
`;

export default ChatContainer
