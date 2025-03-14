import React, { useEffect, useRef } from "react";
import { useChatStore } from "./../../stores/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { formatMessageTime } from "../../lib/util";
import { useAuthStore } from "./../../stores/useAuthStore";
const ChatContainer = () => {
  const {
    messages,
    getMessage,
    isMessageLoading,
    selectedUser,
    subscribeToMessage,
    unsubscribeFromMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef();
  //getChatMessage
  useEffect(() => {

    //get history message
    getMessage(selectedUser._id);
    //listen to socket
    subscribeToMessage();

    return () => unsubscribeFromMessage;
  }, [
    selectedUser._id,
    getMessage,
    subscribeToMessage,
    unsubscribeFromMessage,
  ]);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log(messages)

  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (          
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avata.png"
                      : selectedUser.profilePic || "/avata.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
