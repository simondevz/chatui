"use client";

import { useEffect, useState } from "react";
import { bazeUrl } from "../login/page";
import { User } from "../../ws/types";
import Link from "next/link";

export default function PickRoom() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const response = await fetch(`${bazeUrl}/chat/users/`);
      const data = await response.json();
      setRooms(data);
    }

    getUsers();
  });

  return (
    <div>
      <div>
        <span>Who do you want to chat with?</span>
        <ul>
          {rooms.map((room: User) => {
            return (
              <li key={room.id}>
                <Link
                  href={{
                    pathname: `/ws/chat`,
                    query: { chatroom: room.username },
                  }}
                >
                  {room.username}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
