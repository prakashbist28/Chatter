import React,{useState} from 'react';
import { styled } from 'styled-components';
import Picker from "emoji-picker-react"
import {IoMdSend} from 'react-icons/io';
import {BsEmojiSmileFill} from 'react-icons/bs';
import InputEmoji from 'react-input-emoji'
import {} from './ChatContainer'

function ChatInput({handleSendMsg}) {

    const [showEmojiPicker,setShowEmojiPicker]=useState(false);
   let [msg,setMsg]= useState("");
    const [newmessage,setNewmessage] =useState("")

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker)
    };

    // const handleEmojiClick = (event, emojiObject) => {
    //     let message = msg;
    //     message += emojiObject.emoji;
    //     setMsg(message);
    //   };

      const sendChat = (event) => {
        event.preventDefault();

        if (msg.length > 0) {
          handleSendMsg(msg);
          setMsg("");
        }
      };

  return (
    <Container>
        {/* <div className="button-container">
            <div className="emoji">
                <BsEmojiSmileFill  onClick={handleEmojiPickerHideShow}/>
                {showEmojiPicker && <div className='emoji-picker'><Picker height={400} width={400} value={newmessage} onEmojiClick={handleEmojiClick}/></div>}
            </div>
        </div> */}
        <form className='input-container' onSubmit={(event)=> sendChat(event)}>
            <input type="text" placeholder='type your message here' value={msg} onChange={(e)=>setMsg(e.target.value)}/>
            <button className='submit'>
                <IoMdSend />
            </button>
        </form>
    </Container>
  )
}

const Container = styled.div`
display: grid;
grid-template-columns: 5% 95%;
align-items: center;
background-color: #080420;
padding:0.2rem;
padding-bottom: 0.3rem;
@media screen and (min-width: 720px) and (max-width: 1080px) {
    padding:0 1rem;
    gap:1rem;
  }
.button-container{
    display: flex;
    align-items: center;
    color:white;
    gap:1rem;
    .emoji{
        position: relative;
        svg{
            font-size: 1.5rem;
            color:yellow;
            cursor:pointer;
        }
        .emoji-picker{
            position: absolute;
            top:-455px;
        }
    }
    
}
.input-container{
    display: flex;
    border-radius: 2rem;
    width: 2000%;
    align-items: center;
    gap:2rem;
    background-color: #ffffff36;
    input{
        width:90%;
        height: 60%;
        background-color: transparent;
        color:white;
        border:none;
        padding-left: 1rem;
        font-size: 1.2rem;
        &::selection{
            background-color: #ffffff;
        }
        &:focus{
            outline: none; 
        }
    }
    button{
        padding:0.3rem 0.5rem;
        border-radius: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: blueviolet;
        border:none;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            padding:0.3rem 1rem;
            svg{
                font-size: 1rem;
            }
        }

        &:hover{
            background-color: #ff00ff;
        }
        svg{
            font-size: 2rem;
            color:white;
        }
    }
}
`;

export default ChatInput