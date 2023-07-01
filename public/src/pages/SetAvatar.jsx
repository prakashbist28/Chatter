import React,{useState, useEffect} from 'react'
import styled from 'styled-components'
import {  useNavigate } from 'react-router-dom';
import Loader from '../assets/loader.gif'
import {ToastContainer, toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { SetAvatarRoute } from '../utils/APIroutes';
import { Buffer } from "buffer";

const SetAvatar = () => {
//api for avatar
    const api = 'http://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setavatars]=useState([]);
    const [isloading, setisloading]= useState(true);
    const [selectedavatar,setselectedavatar]=useState(undefined);

    const toastOptions= {
        position:"top-center",
        autoClose:5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }

     //if no user in local storage navigate to /
     useEffect(()=> {
        if(!localStorage.getItem('chatter-users')) {
          navigate('/login')
        }
      },[])

    const setProfilePicture = async()=>{
        if(selectedavatar===undefined){
            toast.error("please select an avatar", toastOptions)
        } else {
            const user = await JSON.parse(localStorage.getItem('chatter-users'))
            const {data} = await axios.post(`${SetAvatarRoute}/${user._id}`, {
                image: avatars[selectedavatar],
            });

            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chatter-users",JSON.stringify(user));
                navigate("/")
            } else{
                toast.error("Error setting avatar, Please try again",toastOptions)
            }

        }
    };

    useEffect( ()=>{
    const fetchData = async () => {
        try{
        const data = [];
        for (let i=0; i<4; i++)
        {
        const image = await axios.get(
            `${api}/${Math.round(Math.random()*1000)}`
            ); //get random avatar from api each time
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
        }
        setavatars(data);
        setisloading(false) ;   
        } 
        catch (error) {
            console.error('Error fetching avatars:', error);
            setisloading(false);
          }
        };
        fetchData();
        
    }, []);

  return (
    <>
    {
        isloading ? <Container>
            <img src={Loader} alt="loader" className='loader' />
        </Container> : (

    <Container>
        <div className='title-container'>
            <h1> Pick an Avatar as your profile picture </h1>
        </div>
        <div className='avatars'>
            {
                avatars.map((avatar,index)=>{
                    return (
                        <div key={index} className={ `avatar ${
                            selectedavatar === index ? "selected":""
                            }` }>
                            <img 
                            src={`data:image/svg+xml;base64,${avatar}`} 
                            alt="avatar" 
                            onClick={ ()=>setselectedavatar(index) }
                            />
                        </div>
                    )
                })}
        </div>
        <button className='submit-btn' onClick={setProfilePicture}> Set as Profile Picture</button>
    </Container>
    )
    }
    <ToastContainer />
    </>
  )
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap:3rem;
background-color: #131324;
height : 100vh;
width: 100vw;
.loader{
    max-inline-size: 100%;
}
.title-container{
    h1{
        color:white;
    }
}
    .avatars{
        display:flex;
        gap: 2rem;

        .avatar{
            display:flex;
            border:0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            justify-content: center;
            align-items:center;
            transition : 0.25s ease-in-out;

            img{
                height:6rem;   
            }
        }
        .selected{
            border: 0.4rem solid blueviolet;
        }
        
    }
    .submit-btn{
        padding:1rem;
        color: white;
        background-color: blueviolet;
        border: 0.1rem solid blueviolet;
        border-radius:0.25rem;
        cursor: pointer;
        font-weight: bold;
        text-transform: uppercase;
        transition: 0.25s;
        &:hover{
            background-color:#ff00ff;
        }
    }

`;

export default SetAvatar


