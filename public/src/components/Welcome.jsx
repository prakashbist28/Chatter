import React, { useContext } from 'react';
import styled from 'styled-components';
import Robot from '../assets/robot.gif';
import { AppContext } from '../context/AppContext';

function Welcome() {
  const { currentuser } = useContext(AppContext);

  return (
    <Container>
      <img src={Robot} alt="robot" />
      <h1>
        Welcome, <span>{currentuser?.username}</span>
      </h1>
      <h3>Please select a chat to start messaging</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 5;
  border: 1px solid #ae00ff;
  border-radius: 20px;
  backdrop-filter: blur(50px);
  color: white;
  padding: 2rem;

  img {
    height: 20rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    span {
      color: blueviolet;
    }
  }

  h3 {
    font-size: 1.2rem;
    color: #ccc;
  }

  @media (max-width: 800px) {
    display: none;
  }
`;

export default Welcome;
