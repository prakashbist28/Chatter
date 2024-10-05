import React,{useState, useEffect} from 'react'
import styled from 'styled-components'
import {  useNavigate } from 'react-router-dom';
import Loader from '../assets/loader.gif'
import {ToastContainer, toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { SetAvatarRoute } from '../utils/APIroutes';

const SetAvatar = () => {

    const api = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions= {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }

    useEffect(() => {
        if (!localStorage.getItem('chatter-users')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = [];
                for (let i = 0; i < 4; i++) {
                    const response = await axios.get(
                        `https://api.multiavatar.com/1/${Math.round(Math.random() * 1000)}`
                    );
        
                    const blob = new Blob([response.data], { type: 'image/svg+xml' });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        data.push(reader.result.split(',')[1]);
                        if (data.length === 4) {
                            setAvatars(data);
                            setIsLoading(false);
                        }
                    };
                    reader.readAsDataURL(blob);
        
                    // Delay to prevent hitting rate limit
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    toast.error("Rate limit exceeded. Please try again later.", toastOptions);
                } else {
                    console.error('Error fetching avatars:', error);
                }
                setIsLoading(false);
            }
        };
        

        fetchData();
    }, [api]);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            const user = JSON.parse(localStorage.getItem('chatter-users'));
            const { data } = await axios.post(`${SetAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chatter-users", JSON.stringify(user));
                navigate("/");
            } else {
                toast.error("Error setting avatar, Please try again", toastOptions);
            }
        }
    };



    return (
        <>
            {
                isLoading ? 
                <Container>
                    <img src={Loader} alt="loader" className="loader" />
                </Container> : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an Avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {
                            avatars.map((avatar, index) => {
                                return (
                                    <div 
                                        key={index} 
                                        className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                                        onClick={() => setSelectedAvatar(index)}
                                    >
                                        <img 
                                            src={`data:image/svg+xml;base64,${avatar}`} 
                                            alt="avatar" 
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button className="submit-btn" onClick={setProfilePicture}>
                        Set as Profile Picture
                    </button>
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
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;
.loader {
    max-inline-size: 100%;
}
.title-container {
    h1 {
        color: white;
    }
}
.avatars {
    display: flex;
    gap: 2rem;

    .avatar {
        display: flex;
        border: 0.4rem solid transparent;
        padding: 0.4rem;
        border-radius: 5rem;
        justify-content: center;
        align-items: center;
        transition: 0.25s ease-in-out;

        img {
            height: 6rem;
        }
    }
    .selected {
        border: 0.4rem solid blueviolet;
    }
}
.submit-btn {
    padding: 1rem;
    color: white;
    background-color: blueviolet;
    border: 0.1rem solid blueviolet;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;
    transition: 0.25s;
    &:hover {
        background-color: #ff00ff;
    }
}
`;

export default SetAvatar;
