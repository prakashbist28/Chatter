import React from 'react'
import {useState, useEffect} from 'react'
import styled from 'styled-components'
import Logo from "../assets/logo.svg"


const Contacts = ({contacts, currentuser, changeChat}) => {
    const[currentusername,setcurrentusername] = useState(undefined);
    const[currentuserimage,setcurrentuserimage] = useState(undefined);
    const[currentselected,setcurrentselected] = useState(undefined);//chat

    const [search, setSearch] = useState('')

   const filteredContacts = contacts.filter((item)=> item.username.toLowerCase().includes(search.toLowerCase()))

    useEffect(()=>{  
        if(currentuser){
            setcurrentusername(currentuser.username) ;
            setcurrentuserimage(currentuser.avatarImage);
        }
    },[currentuser]);

    const changeCurrentchat = (index,contact) =>{
        setcurrentselected(index);
        changeChat(contact);
    }

    const highlightSearch = (text, highlight) =>{
      if(!highlight) return text;
      const parts = text.split(new RegExp())
    }

  return (
    <>
    {
        currentuserimage && currentusername && (
            <Container>
                <div className='brand'>
                    {/* <img src={Logo} alt="logo" />
                    <h3> chatter </h3> */}
                    <input className='searchbar' onChange={(e) => setSearch(e.target.value)} placeholder='search by username...'/>
                </div>
                <div className='contacts'>
                    { filteredContacts.length>0 ?
                        filteredContacts.map((contact,index)=>{
                            return (
                                <div className={`contact ${index === currentselected ? "selected" : "" }`} 
                                key={index} 
                                onClick={()=>changeCurrentchat(index, contact)}>
                                    <div className='avatar'>
                                        <img 
                                        src={`data:image/svg+xml;base64,${contact.avatarImage}`} 
                                        alt="avatar" 
                                        />
                                    </div>

                                    <div className='username'>
                                        <h3>{contact.username}</h3>
                                    </div>
                                </div>
                            )
                        }):
                        <div style={{color:"white"}}>no such user</div>
                      }
                </div>

                <div className='current-user'>
                    <div className='avatar'>
                            <img 
                              src={`data:image/svg+xml;base64,${currentuserimage}`} 
                              alt="avatar" 
                            />
                    </div>

                    <div className='username'>
                        <h3>{currentusername}</h3>
                    </div>

                </div>
            </Container>
        )
    }
    </>
  )
}

const Container = styled.div`
display: grid;
z-index: 10;
grid-template-rows: 10% 75% 15%;
overflow: hidden;
border-radius: 25px;
backdrop-filter: blur(50px);
border: 1px solid #b700ff;
.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  background: black;
  box-shadow: 0px 0px 10px #ad10f6;
  
  .searchbar{
    width: 15rem;
    border: 1px solid #ad10f6;
    padding: 0.5rem;
    border-radius: 10px;
    background: transparent;
    color: white;
    outline: none;
    &:focus{
      box-shadow: 0px 0px 10px #b700ff;
    }
  }
}
.contacts {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 0.8rem;
  margin-top: 10px;

 
  &::-webkit-scrollbar {
      width: 0.5rem;
      &-thumb {
        background-color: #b700ff;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
  .contact {
    background-color: #c53eff6d;
    min-height: 5rem;
    cursor: pointer;
    width: 90%;
    border-radius: 20px;
    padding: 0.4rem;
    display: flex;
    gap: 1rem;
    border:1px solid #b700ff;
    align-items: center;
    transition: 0.25s ease-in-out;
    &:hover{
    background-color: #00000061;
    border:1px solid #b700ff
}
    .avatar {
      img { 
        height: 3rem;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
  }
  .selected {
    background-color: #8a00c145;
    border:1px solid #b700ff
  }
}

.current-user {
  background-color: #000000;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  box-shadow: 0px 0px 10px #ad10f6;
  .avatar {
    img {
      height: 4rem;
      max-inline-size: 100%;
    }
  }
  .username {
    h3 {
      color: #f9f9f9;
    }
  }
}

@media screen and (min-width: 800px) and (max-width: 1300px) {
.brand{
  .searchbar{
    width:80%
  }
}

.current-user{
.username {
  h3 {
    font-size: 1rem;
  }
}
}
}

@media screen and (min-width: 360px) and (max-width: 800px) {
         
        }
`;

export default Contacts;