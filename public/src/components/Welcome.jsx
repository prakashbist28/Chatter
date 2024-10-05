import React from 'react'
import { styled } from 'styled-components'
import Robot from '../assets/robot.gif'

function Welcome({currentuser}) {
  return (
    <Container>

        <img src={Robot} alt="robot" />
        <h1> Welcome, <span>{currentuser.username}</span></h1>
        <h3> Please select a chat to start messaging</h3>
    </Container>
  )
}
const Container = styled.div`
display:flex;
justify-content:center;
align-items: center;
flex-direction: column;
z-index: 5;
border: 1px solid #ae00ff;
border-radius: 20px;
backdrop-filter: blur(50px);
color:white;
img{
  height:20 rem;
}
span{
  color:blueviolet;
}

@media(max-width:800px){
  display:none
}
`

export default Welcome
