import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_API);

export type User = {
  username: string;
};

export const createUser = async (username: string, password: string) => {
  const user = await pb.collection("users").create({
    username: username.toLowerCase(),
    password: password,
    passwordConfirm: password,
  });
  return user;
};

export const loginUser = async (username: string, password: string) => {
  const user = await pb
    .collection("users")
    .authWithPassword(username.toLowerCase(), password);
  return user;
};

export const getUserList = async () => {
  const users = await pb.collection("users").getFullList({
    fields: "username",
  });

  return users;
};
