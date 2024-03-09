import PocketBase from "pocketbase";
const pb = new PocketBase("https://mudae-tracker.pockethost.io/");

export type Users = {
  username: string;
};

const createUser = async (
  username: string,
  password: string,
  confirmPassword: string
) => {
  const data = {
    username: username.toLocaleLowerCase(),
    password: password,
    passwordConfirm: confirmPassword,
  };

  await pb.collection("users").create(data);
};

const loginUser = async (username: string, password: string) => {
  await pb
    .collection("users")
    .authWithPassword(username.toLowerCase(), password);

  await pb
    .collection("users")
    .authWithPassword(username.toLowerCase(), password)
    .then(() => {
      localStorage.setItem("user", username.toLowerCase());
    });
};

const getAllUsers = async () => {
  return await pb.collection("users").getFullList();
};

const getUserKakeraAmount = async (user: string) => {
  const data = await pb
    .collection("mudae_collection")
    .getFullList({
      filter: `owner = "${user}"`,
      fields: "kakera",
    })
    .then(res => res);

  let kakeraValue = 0;

  for (let i = 0; i < data.length; i++) {
    kakeraValue += data[i].kakera;
  }

  return kakeraValue;
};

export { createUser, loginUser, getAllUsers, getUserKakeraAmount };
