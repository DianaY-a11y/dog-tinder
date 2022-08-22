import "./AuthModal.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies("[users]");
  let navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp && password != confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
        {
          email,
          password,
        }
      );

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);

      const success = response.status === 201;

      if (success && isSignUp) navigate("/onboarding");
      if (success && !isSignUp) navigate("/dashboard");

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth">
      x
      <div className="auth-modal">
        <div onClick={handleClick}>⨯</div>
        <h2>{isSignUp ? "CREATE ACCOUNT" : "LOG IN"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="email"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control form-group"
          />

          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control form-group"
          />

          {isSignUp && (
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control form-group"
            />
          )}

          <input
            type="submit"
            className="btn btn-danger btn-block"
            value="Submit"
          />
          <p>{error}</p>
        </form>
        <hr />
        <h2>MEET YOUR SOULWOOF</h2>
      </div>
    </div>
  );
};

export default AuthModal;
