"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext, useRef, useLayoutEffect } from "react";
import { bazeUrl } from "../login/page";
import { User } from "../../ws/types";
import Link from "next/link";
import { App_data } from "../../../../context/context";

export default function PickRoom() {
  // rooms is an array of users gotten from the server
  const { appData, setAppData }: any = useContext(App_data);
  const router = useRouter();
  const rooms = appData.usersList;

  let routerRef = useRef(router);
  let appDataRef = useRef(appData);

  useLayoutEffect(() => {
    routerRef.current = router;
    appDataRef.current = appData;
  }, [router, appData]);

  console.log(appData);
  useEffect(() => {
    if (!appDataRef.current.user) routerRef.current.push("/ws/login");

    async function getUsers() {
      if (appDataRef.current.usersList.length > 0) {
        getUnread(appDataRef.current.usersList);
        return;
      }

      const response = await fetch(`${bazeUrl}/chat/users/`);
      const data = await response.json();
      getUnread(data);
    }

    // Get rooms with unread messages
    function getUnread(data: any) {
      let unread: [] = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];

        if (element.pk === appDataRef.current.user?.pk) {
          unread = element.current_rooms;
        }
      }

      setAppData((appData: any) => {
        return { ...appData, usersList: data, unread };
      });
    }

    getUsers();
  }, [setAppData, appDataRef]);

  return (
    <div>
      <div>
        <span>Who do you want to chat with?</span>
        <ul>
          {/* room is the user object */}
          {rooms.map((room: User) => {
            return (
              <li key={room.pk + Math.random()}>
                <Link
                  href={{
                    pathname: `/ws/chat`,
                    query: {
                      chatroom: `${appData.user.username}_${room.username}`,
                    },
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
