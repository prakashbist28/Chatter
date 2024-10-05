import React from 'react'
import { styled } from 'styled-components'
import Robot from '../assets/robot.gif'
import Logout from './Logout'

function Messages({currentuser}) {
  return (
    <Container>
      <Logout />
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
color:white;
img{
  height:20 rem;
}
span{
  color:blueviolet;
}
`

export default Messages