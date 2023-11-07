"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";
import axios from "axios";
import { App_data } from "../../../../context/context";

export const bazeUrl: string = "http://localhost:8000";

export default function Login() {
  const router = useRouter();
  const passPhrase: string = "!@#$%^&*";

  const { appData, setAppData }: any = useContext(App_data);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    username1: "",
    username2: "",
    password1: "",
    password2: "",
  });

  useEffect(() => {
    const populateUsers = async () => {
      const response = await fetch(`${bazeUrl}/chat/users/`);
      const data = await response.json();

      console.log(data);
      setAppData((appData: {}) => {
        return { ...appData, usersList: [...data] };
      });
    };

    populateUsers();
  }, [setAppData]);

  return (
    <>
      <form
        onSubmit={async (event) => {
          try {
            event.preventDefault();

            // Login path if new user is created
            if (formData.password2 !== "") {
              await axios.post(`${bazeUrl}/signup/`, {
                username: formData.username1,
                password1: formData.password1,
                password2: formData.password2,
              });
              router.push("/ws/pickroom");
              return;
            }

            // Login as an existing user
            const response = await axios.post(`${bazeUrl}/chat/login/`, {
              username: formData.username2,
              password: formData.password1,
            });

            setAppData({
              ...appData,
              user: response.data.user,
              tokens: {
                access: response.data.access,
                refresh: response.data.refresh,
              },
            });
            router.push("/ws/pickroom");
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <label>Login as:</label>
        <select
          onChange={(event) => {
            const element = event.target;
            setFormData({
              username1: "",
              username2: element.value,
              password1: element.value + passPhrase,
              password2: "",
            });
          }}
          disabled={formData.username1 !== ""}
        >
          <option>No one Selected</option>
          {appData.usersList?.length !== 0 ? (
            appData.usersList.map((user: User) => {
              return (
                <option value={user.username} key={user.pk}>
                  {user.username}
                </option>
              );
            })
          ) : (
            <option disabled>No Available Users. Create One😁😗</option>
          )}
        </select>

        <label>Create New User:</label>
        <input
          onChange={(event) => {
            const username: string = event.target.value;

            setFormData({
              ...formData,
              username1: username,
              password1: username + passPhrase,
              password2: username + passPhrase,
            });

            for (let index = 0; index < appData.usersList.length; index++) {
              const user: User = appData.usersList[index];
              if (user.username === username) {
                setErrorMsg("username already exists😔");
                return;
              } else {
                setErrorMsg("");
                return;
              }
            }
          }}
          value={formData.username1}
        />

        <span style={{ display: errorMsg === "" ? "none" : "inline-block" }}>
          {errorMsg}
        </span>
        <button disabled={errorMsg !== ""}>Login</button>
      </form>
    </>
  );
}
