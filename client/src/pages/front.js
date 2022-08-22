import NavBar from "../components/navbar.js";
import "../index.css";
import "./front.css";
import { useState } from "react";
import { useCookies } from "react-cookie";
import AuthModal from '../components/AuthModal'

const Front = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const authToken = cookies.AuthToken;

  const handleClick = () => {
    if (authToken) {
      removeCookie('UserId', cookies.UserId)
      removeCookie('AuthToken',cookies.AuthToken)
      window.location.reload()
      return 
    }
    setShowModal(true);
    setIsSignUp(true);
  };

  return (
    <div className="Main">
      <NavBar 
        authToken={authToken} 
        setShowModal={setShowModal} 
        showModal={showModal}
        setIsSignUp = {setIsSignUp}/>
      <div className="Home">
        <h1 className="FrontTitle">It's Paw-Fect</h1>
        <h2 className="title">Meet your pupper soulmate on Paw-Fect!</h2>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "Signout" : "Create Account"}
        </button>

        {showModal && (
            <AuthModal setShowModal={setShowModal} isSignUp = {isSignUp} />
        )
        }
      </div>
    </div>
  ); 
};

export default Front;
