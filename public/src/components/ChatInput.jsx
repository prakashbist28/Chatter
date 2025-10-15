import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  const handleEmojiClick = (emojiData) => {
    const sym = emojiData.unified.split("_");
    const codes = sym.map((el) => "0x" + el);
    const emoji = String.fromCodePoint(...codes);
    setMsg((prev) => prev + emoji);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    handleSendMsg(msg);
    setMsg("");
  };

  return (
    <Container>
      <div className="emoji-container">
        <BsEmojiSmileFill onClick={toggleEmojiPicker} />
        {showEmojiPicker && (
          <div className="emoji-picker">
            <Picker theme="dark" onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.3rem 1rem;
  background-color: #080420;
  position: relative;

  .emoji-container {
    position: relative;
    svg {
      font-size: 1.8rem;
      color: yellow;
      cursor: pointer;
    }
    .emoji-picker {
      position: absolute;
      bottom: 50px; /* positions above input */
      left: 0;
      z-index: 100;
    }
  }

  .input-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;

    input {
      flex: 1;
      border-radius: 2rem;
      background: #ffffff36;
      padding: 0.5rem 1rem;
      height: 3rem;
      color: white;
      border: none;
      font-size: 1rem;

      &::placeholder {
        color: #ddd;
      }
    }

    button {
      border-radius: 50%;
      padding: 0.5rem;
      background-color: blueviolet;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #ff00ff;
      }

      svg {
        font-size: 1.5rem;
        color: white;
      }
    }
  }

  @media screen and (max-width: 720px) {
    .input-container input {
      font-size: 0.9rem;
      height: 2.5rem;
    }
    .input-container button svg {
      font-size: 1.2rem;
    }
    .emoji-container svg {
      font-size: 1.5rem;
    }
  }
`;

export default ChatInput;
