import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LuLogOut } from "react-icons/lu";

function Logout() {
  const navigate = useNavigate();
  const [out, setOut] = useState(false);

  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleLogout = () => {
    setOut(!out);
  };

  return (
    <LogoutContainer>
      <button onClick={handleLogout}>
        <LuLogOut />
      </button>
      {out && (
        <div className="backdrop">
          <div className="confirm">
            <h1 className="ques">Do you want to logout?</h1>
            <div className='btns'>
            <button className="confirm-btn yes" onClick={handleClick}>Yes</button>
            <button className="confirm-btn no" onClick={handleLogout}>No</button>
            </div>
          </div>
        </div>
      )}
    </LogoutContainer>
  );
}

const LogoutContainer = styled.div`
  position: relative;
  z-index: 30;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #9900ff;
    border: none;
    cursor: pointer;
    height: 2.5rem;
    width: 2.5rem;

    &:hover {
      background-color: #ff00ff;
    }

    svg {
      font-size: 1.5rem;
      color: #ebe7ff;
    }
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);  /* Dim background */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    .confirm {
      background-color: #2c2c2c;
      padding: 2rem;
      border-radius: 0.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;

      .ques {
        color: white;
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }

      .btns{
        display: flex;

      }

      .confirm-btn {
        padding: 0.5rem 1rem;
        margin: 0.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        color: white;

        &.yes {
          background-color: #ff0000;
          width: 50%;
        }
        
        &.no {
          background-color: #4caf50;
          width: 50%;
        }

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
`;

export default Logout;
