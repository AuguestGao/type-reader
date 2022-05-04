export interface IUser {
  id: string;
  displayName: string;
}

export interface TCurrentUser {
  currentUser: IUser | null;
}
