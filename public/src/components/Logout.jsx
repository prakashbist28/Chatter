import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { styled } from 'styled-components'
import {BiPowerOff} from 'react-icons/bi'

function Logout() {
const navigate = useNavigate();
const handleClick = async()=>{
    localStorage.clear();
    navigate("/login");
};

  return (
    <Button >
        <BiPowerOff onClick={handleClick}/>

    </Button>
  )
}

const Button = styled.button`
display: flex;
align-items:center;
justify-content: center;
padding:0.5rem;
border-radius: 0.5rem;
background-color: #9900ff;
border:none;
cursor:pointer;
height:2.5rem;
width:2.5rem;
&:hover{
    background-color: #ff00ff;
}
svg{
    font-size: 1.5rem;
    color:#ebe7ff
}
`;

export default Logout