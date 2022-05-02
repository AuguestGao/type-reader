export interface TUser {
  id: string;
  displayName: string;
}

export interface TCurrentUser {
  currentUser: TUser | null;
}
