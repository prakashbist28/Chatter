import React,{useState, useEffect} from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg'
import {ToastContainer, toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { registerRoute } from '../utils/APIroutes';

function Register() {
    const navigate = useNavigate()

    const [values,setvalues]= useState({
        username: "",
        email : "",
        password:"",
        confirmpassword:"",
    });

    const toastOptions= {
        position:"top-center",
        autoClose:5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }

      //to keep user logged in at chat page
      useEffect(()=> {
        if(localStorage.getItem('chatter-users')) {
          navigate('/')
        }
      },[])

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(handleValidation()){
            const {password,username,email} = values;
            const {data}= await axios.post(registerRoute, {
                username,
                email,
                password,
            });
            if(data.status===false){
                toast.error(data.msg, toastOptions)
            }
            if(data.status===true){
                localStorage.setItem('chatter-users',JSON.stringify(data.user));
                navigate("/");
            }
            
        };
    }

    const handleValidation =() => {
        const {password,confirmPassword,username,email} = values;

        if(password !== confirmPassword){
            toast.error("password and confirm password donot match", toastOptions);
            return false;
        } else if (username.length < 3) {
            toast.error("username should have more than 3 characters", toastOptions);
            return false;
        }else if (password.length < 8) {
            toast.error("password should have more than 8 characters", toastOptions);
            return false;
        }else if(email===""){
            toast.error("email is required", toastOptions);
            return false;
        }
        return true;
    }
    
    const handleChange = (event) =>{
        setvalues({...values, [event.target.name]: event.target.value })
    }

  return (
  <>
  <FormContainer >
    <form onSubmit={(event)=>handleSubmit(event)}>
        <div className='brand'>
            <img src={Logo} alt="logo" />
            <h1>Chatter</h1>
        </div>
        <input
           type="text" 
           placeholder='username' 
           name="username" 
           onChange={(e)=>handleChange(e)}
        /> 
        <input
           type="email" 
           placeholder='email' 
           name="email" 
           onChange={(e)=>handleChange(e)}
        /> 
        <input
           type="password" 
           placeholder='password' 
           name="password" 
           onChange={(e)=>handleChange(e)}
        /> 
        <input
           type="password" 
           placeholder='confirm password' 
           name="confirmPassword" 
           onChange={(e)=>handleChange(e)}
        /> 
        <button type="submit"> Create user </button>
        <span> 
            Already have an account ? <Link to="/login">Login</Link>
        </span>
    </form>
  </FormContainer>
  <ToastContainer />
  </>
  )
  
}

const FormContainer = styled.div`
   height: 100vh;
   width: 100vw;
   display: flex;
   flex-direction:column;
   justify-content :center;
   gap: 1rem;
   align-items: center;
   background-color: #131324;
   .brand {
    display: flex;
    align-items: center;
    gap:1rem;
    justify-content:center;
    img{ 
        height:5rem
    }
    h1{
        color:white;
        text-transform: uppercase;
    }
    
   }
   form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius:2rem;
    padding : 3rem;
    input{
        color:white;
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid blueviolet;
        border-style:solid ;
        border-radius: 0.4rem;
        font-size: 1rem;
        &:focus {
            border:0.1rem solid #ff00ff;
            outline:none;
            color:white;
        }
    }
    button{
        padding:1rem;
        color: white;
        background-color: blueviolet;
        border: 0.1rem solid blueviolet;
        border-radius:1rem;
        cursor: pointer;
        font-weight: bold;
        text-transform: uppercase;
        transition: 0.25s;
        &:hover{
            background-color:#ff00ff;
        }
    }
    span{
        color:white;
        a{
            color: blueviolet;
            font-weight: bold;
            text-decoration: none;
            &:hover{
                color: #ff00ff;
            }
        }
    }
}
`;

export default Register