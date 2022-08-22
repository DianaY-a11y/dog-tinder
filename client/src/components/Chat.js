import "./ChatContainer.css";

const Chat = ({ orderMessages, clickedUser }) => {
  // const isClickedUser = () => {
  //   return;
  //   <>
  //     <div className="chat-messages-header">
  //       <div className="chat-name-header">{clickedUser.name}</div>
  //       <div className="message-card">
  //         <div className="img-container">
  //           <img src={message.img} alt={message.name + "profile"} />
  //         </div>
  //         {message.name}
  //       </div>
  //     </div>
  //     <p>{message.message}</p>
  //   </>;
  // };

  // const whichChatDisplay = (message) => {
  //   if (message.name === clickedUser) {
  //     return <isClickedUser />;
  //   } else {
  //     return <isNotClickedUser />;
  //   }
  // };

  return (
    <div className="chat-display">
      <div className="chat-name-header">{clickedUser.name}</div>
      {orderMessages.map((message, _index) => (
        <div key={_index}>
          <div className="chat-messages-header">
            <div className="message-card">
              <div className="img-container">
                <img src={message.img} alt={message.name + "profile"} />
              </div>
              {message.name}
            </div>
          </div>
          <p>{message.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;
