import "./ChatContainer.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ user }) => {
  let navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const logout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    navigate("/");
  };

  return (
    <div className="chat-header">
      <div className="profile">
        <div className="profile-container">
          <img src={user.url} alt={"photo of" + user.name} />
          {user.name}
        </div>
        <button className="log-out" onClick={logout}>
          logout
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
