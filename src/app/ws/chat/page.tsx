"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Message } from "../types";

export default function Chat() {
  const searchParams = useSearchParams();
  const roomName = searchParams.get("chatroom");
  const socketUrl = `ws://127.0.0.1:8000/ws/chat/${roomName}/`;

  const [messageHistory, setMessageHistory] = useState([]);
  const [message, setMessage] = useState({
    user: "Test User",
    text: "",
  });

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(socketUrl, {
      onOpen: () => console.log("Opened"),
    });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessageHistory((messageHistory) =>
        messageHistory.concat(lastJsonMessage)
      );
    }
    console.log(lastJsonMessage);
  }, [setMessageHistory, lastJsonMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting...",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing...",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <h3>{roomName}</h3>
      <span>the wedsocket is currently {connectionStatus}</span>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendJsonMessage(message);
        }}
      >
        <input
          value={message.text}
          onChange={(event) =>
            setMessage({ ...message, text: event.target.value })
          }
        />
        <button>Send Message</button>
      </form>
      <div>
        {messageHistory.map((item: Message, index) => (
          <span key={index + item?.text}>{item?.text}</span>
        ))}
      </div>
    </div>
  );
}
