export interface User {
  _id: {
    $oid: string;
  };
  name: string;
  username: string;
  email: string;
  imgurl: string;
  password: string;
  tokensfcm: string[];
  role: Role;
}

export interface Role {
  id: number;
  name: string;
}

export interface LoginKeys {
  email: string;
  password: string;
}

export interface AddedUser {
  $oid: string
}