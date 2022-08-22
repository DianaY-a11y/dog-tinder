import Logo from "../images/Logo.jpeg";
import "./navbar.css";

const NavBar = ({ authToken, setShowModal, showModal, setIsSignUp }) => {
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };
  return (
    <nav>
      <div className="LogoContainer">
        <img className="logo" src={Logo} alt="logo" />
      </div>
      {!authToken && (
        <button
          className="nav-button"
          onClick={handleClick}
          disabled={showModal}
        >
          Log in
        </button>
      )}
    </nav>
  );
};

export default NavBar;
