import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';

function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState('');

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (e) => {
    const sym = e.unified.split("_")
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray)
    setMsg(msg + emoji)
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker theme='dark' onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 90% 5%;
  align-items: center;
  background-color: #080420;
  padding: 0.2rem;
  padding-bottom: 0.3rem;
  box-shadow: 0px 0px 10px #ad10f6;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  @media screen and (min-width: 360px) and (max-width: 720px) {
    padding: 0 0.5rem;
    gap: 0.5rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: yellow;
        cursor: pointer;
      }

      .emoji-picker {
        position: absolute;
        top: -455px;
        z-index: 1;
      }
    }
  }

  .input-container {
    display: flex;
    width: 100%;
    align-items: center;
    padding-left: 2rem;
    gap: 2rem;

    input {
      width: 100%;
      border-radius: 2rem;
      background: #ffffff36;
      padding: 0.5rem;
      height: 3rem;
      color: white;
      border: none;
      font-size: 1.2rem;

      &::selection {
        background-color: #b92cff87;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      border-radius: 2rem;
      padding: 0.5rem;
      background-color: blueviolet;
      border: none;

      &:hover {
        background-color: #ff00ff;
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }


  @media screen and (min-width: 720px) and (max-width: 1080px) {
    .input-container {
      input {
        font-size: 1rem;
        padding: 0.4rem;
        height: 2.5rem;
      }

      button {
        padding: 0.4rem;

        svg {
          font-size: 1.8rem;
        }
      }
    }
  }

 
  @media screen and (min-width: 360px) and (max-width: 720px) {
    grid-template-columns: 10% 80% 10%;

    .input-container {
      padding-left: 1rem;
      gap: 1rem;

      input {
        font-size: 0.9rem;
        padding: 0.4rem;
        height: 2.2rem;
      }

      button {
        padding: 0.3rem;

        svg {
          font-size: 1.5rem;
        }
      }
    }

    .button-container {
      .emoji svg {
        font-size: 1.2rem;
      }
    }
  }
`;


export default ChatInput;
