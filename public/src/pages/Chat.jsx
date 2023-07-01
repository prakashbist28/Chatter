import React,{useState,useEffect,useRef} from 'react'
import styled from 'styled-components'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'
import { allUsersRoute,host } from '../utils/APIroutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from 'socket.io-client'

function Chat() {
  const socket = useRef();
const [contacts,setcontacts]= useState([])
const [currentuser,setcurrentuser] = useState(undefined)
const navigate=useNavigate();
const[currentChat,setCurrentChat] = useState(undefined)
const[isloaded,setisloaded] =useState(false);


//if no user in local storage navigate to /
useEffect(()=>{
  const fetchData = async () => {
  if(!localStorage.getItem('chatter-users')) {
    navigate('/login')
  } else{
    setcurrentuser(await JSON.parse(localStorage.getItem('chatter-users')))
    setisloaded(true);
  }
}
fetchData();
},[])

useEffect(()=>{

  if(currentuser){
    socket.current = io(host);
    socket.current.emit("add-user", currentuser._id)
  }

},[currentuser])

  useEffect(() => {
    const fetchData = async () => {
      if (currentuser) {
        if (currentuser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentuser._id}`);
          setcontacts(data.data);
        } else {
          navigate("/setavatar");
        }
      }
    };

    fetchData();
  }, [currentuser,navigate]);

const handleChatChange = (chat) =>{
  setCurrentChat(chat);
}

  return (
    <Container>
      <div className='container'>
        <Contacts 
        contacts={contacts} 
        currentuser={currentuser} 
        changeChat={handleChatChange}
        />
        {
          isloaded && currentChat === undefined ? (
          <Welcome currentuser={currentuser}/>
          ) : ( <ChatContainer currentchat={currentChat} currentuser={currentuser} socket={socket}/>)
        }
        
      </div>
      
    </Container>
  )
}

const Container = styled.div`
height:100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap:1rem;
align-items: center;
background-color: #1c1c32;
.container{
  height:85vh;
  width:85vw;
  background-color: #00000076;
  display: grid;
  grid-template-columns: 25% 75%;
  //responsive tab /mobile
  @media screen and (min-width: 720px) and (max-width:1080px){
    grid-template-columns: 35% 65%;
  }
  @media screen and (min-width: 360px) and (max-width:480px){
    grid-template-columns: 35% 65%;
  }


}
`;
export default Chat