import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIroutes";
import { FaArrowRightLong } from "react-icons/fa6";
import Blob from "../assets/Blob";
import ScaleLoader from "react-spinners/ScaleLoader";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // to keep user logged in at chat page
  useEffect(() => {
    if (localStorage.getItem("chatter-users")) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      setLoading(true);
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        setLoading(false);
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        setLoading(false);
        localStorage.setItem("chatter-users", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { password, username } = values;

    if (password === "") {
      toast.error("username and password are required", toastOptions);
      return false;
    } else if (username.length === "") {
      toast.error("username and password are required", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <Blob />
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chatter</h1>
          </div>
          <input
            type="text"
            placeholder="username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={(e) => handleChange(e)}
          />

          <button type="submit">
            <span className="circle">
              <FaArrowRightLong className="arrow" />
            </span>
            <span className="text">Login</span>
          </button>

          <span>
            Don't have an account ? <Link to="/register">Register</Link>
          </span>

          {loading && (
            <div className="loading">
              <ScaleLoader />
            </div>
          )}
        </form>
        <h1 className="demotext">
          {" "}
          For demo( Username : demo1 , password : Demo@123 )
        </h1>
      </FormContainer>

      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  position: relative;

  .brand {
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 8rem;
      filter: drop-shadow(0px 0px 5px #a200ff);
    }

    h1 {
      color: white;
      text-transform: uppercase;
      font-size: 3rem;
      color: transparent;
      font-weight: bolder;
      background: linear-gradient(to right, #f986ff, #9d57ff);
      -webkit-background-clip: text;
      transition: background 1s ease-in-out;
    }

    h1:hover {
      background: linear-gradient(to right, #9d57ff, #f986ff);
      -webkit-background-clip: text;
    }
  }

  form {
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90%;
    max-width: 40rem;
    gap: 4rem;
    border: 2px solid #5800b0;
    box-shadow: 0rem 0rem 100rem #5800b0;
    backdrop-filter: blur(50px);
    border-radius: 2rem;
    padding: 3rem;

    input {
      color: white;
      background-color: transparent;
      width: 100%;
      padding: 1rem;
      border: 0.1rem solid blueviolet;
      border-style: solid;
      border-radius: 0.4rem;
      font-size: 1rem;

      &:focus {
        border: 0.1rem solid #ff00ff;
        outline: none;
        color: white;
      }
    }

    button {
      z-index: 1;
      width: 60%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: white;
      background-color: blueviolet;
      border: 0.1rem solid blueviolet;
      border-radius: 50px;
      cursor: pointer;
      font-weight: bold;
      font-size: 22px;
      text-transform: uppercase;
      position: relative;
      overflow: hidden;
      transition: 0.5s ease-in-out;
    }

    button:hover {
      box-shadow: 0px 0px 20px blueviolet;
    }

    .text {
      z-index: 10;
    }

    .circle {
      z-index: 2;
      position: absolute;
      height: 60px;
      width: 60px;
      left: 0;
      border-radius: 50px;
      background-color: black;
      transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    button:hover .circle {
      width: 100%;
    }

    .arrow {
      position: absolute;
      width: 40px;
      height: 40px;
      left: 10px;
      z-index: 10;
      transition: 1s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    button:hover .arrow {
      left: 80%;
    }

    span {
      color: white;
      font-size: medium;
      display: flex;
      align-items: center;
      justify-content: center;

      a {
        color: #a749fe;
        font-weight: bold;
        margin-left: 1rem;
        text-decoration: none;

        &:hover {
          color: #ff00ff;
        }
      }
    }
  }

  .demotext {
    font-family: "Courier New", Courier, monospace;
    color: #ffffff;
  }

  .loading {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #9d57ff;
    position: absolute;
    z-index: 20;
  }

  @media (max-width: 700px) {
    height: 100vh;

    .brand {
      img {
        height: 4rem;
        width: auto;
        filter: drop-shadow(0px 0px 5px #a200ff);
      }
      h1 {
        font-size: 28px;
      }
    }

    form {
      width: 90%;
      padding: 2rem;

      input {
        width: 100%;
      }

      button {
        font-size: 18px;
        width: 100%;
      }
    }

    .demotext {
      font-size: 10px;
    }
  }
`;

export default Login;
