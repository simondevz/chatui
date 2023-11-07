export interface User {
  pk: number;
  username: string;
}

export interface Message {
  user: string;
  text: string;
  seen: boolean;
}

export interface AppData {
  user: User | null;
  usersList: User[] | null[];
}
