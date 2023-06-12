export enum UserType {
  Guest,
  Host,
}

export type CredentialsAccount = {
  username: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  type: UserType;
};
