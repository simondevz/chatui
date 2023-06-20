export interface User {
  id: number;
  username: string;
}

export interface Message {
  user: string;
  text: string;
  seen: boolean;
}
