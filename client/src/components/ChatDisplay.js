import "./ChatContainer.css";
import Chat from "./Chat.js";
import ChatInput from "./ChatInput.js";
import axios from "axios";
import { useEffect, useState } from "react";

const ChatDisplay = ({ user, clickedUser }) => {
  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;
  const [userMessages, setUserMessages] = useState(null);
  const [clickedUserMessages, setClickedUserMessages] = useState(null);

  const getUserMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/messages", {
        params: { userId: userId, correspondingUserId: clickedUserId },
      });
      setUserMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClickedUserMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/messages", {
        params: { userId: clickedUserId, correspondingUserId: userId },
      });
      setClickedUserMessages(response.data);
      console.log(user.name, "userId", clickedUser.name, "clicked");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserMessages();
    getClickedUserMessages();
  }, []);

  const messages = [];

  userMessages?.forEach((message) => {
    const formmattedMessage = {};
    formmattedMessage["name"] = user?.name;
    formmattedMessage["img"] = user?.url;
    formmattedMessage["message"] = message.messages;
    formmattedMessage["timestamp"] = message.timestamp;
    messages.push(formmattedMessage);
  });

  clickedUserMessages?.forEach((message) => {
    const formmattedMessage = {};
    formmattedMessage["name"] = clickedUser?.name;
    formmattedMessage["img"] = clickedUser?.url;
    formmattedMessage["message"] = message.messages;
    formmattedMessage["timestamp"] = message.timestamp;
    messages.push(formmattedMessage);
  });

  const orderMessages = messages?.sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  return (
    <div>
      <Chat orderMessages={orderMessages} clickedUser={clickedUser} />
      <ChatInput
        user={user}
        clickedUser={clickedUser}
        getUserMessages={getUserMessages}
        getClickedUserMessages={getClickedUserMessages}
      />
    </div>
  );
};

export default ChatDisplay;
