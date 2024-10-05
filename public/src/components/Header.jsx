import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.svg';
import Logout from './Logout';

function Header() {

  return (
    <HeaderContainer>
      <LogoSection>
        <div>
        <img src={logo} alt="Quiz Champs Logo" />
        <h1>CHATTER</h1>
        </div>
        <Logout />
      </LogoSection>
      
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #1c1c32;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }

  @media screen and (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 1rem;
  background-color: black;
  width: 100%;
  border: 2px solid #aa00ff;
  border-radius:50px;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  div{
    display: flex;
    gap: 10px;
  }
  img {
    height: 50px;
    width: auto;

    @media screen and (max-width: 768px) {
      height: 40px;
    }

    @media screen and (max-width: 480px) {
      height: 30px;
    }
  }

  h1 {
    color: #ffffff;
    font-size: 2rem;
    font-weight: 700;

    @media screen and (max-width: 768px) {
      font-size: 1.5rem;
    }

    @media screen and (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
`;

export default Header;
