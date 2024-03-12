import PocketBase from "pocketbase";

const pb = new PocketBase("https://mudae-tracker.pockethost.io");

export const getCharacterData = async (fetchUser: string) => {
  const characters = await pb
    .collection("mudae_collection")
    .getFullList({
      fields: "id,name,series,kakera,picture,status",
      filter: `owner = "${fetchUser}"`,
    })
    .then(res => res);

  return characters;
};

export const updateStatus = async (id: string, status: string) => {
  await pb.collection("mudae_collection").update(id, { status: status });
};

export const deleteCharacter = async (id: string) => {
  await pb.collection("mudae_collection").delete(id);
};

export const updateCharacter = async (
  id: string,
  name: string,
  series: string,
  kakera: number,
  picture: string
) => {
  await pb
    .collection("mudae_collection")
    .update(id, {
      name: name,
      series: series,
      kakera: kakera,
      picture: picture,
    })
    .then(res => {
      res;
    });

  const data = {
    name: name,
    series: series,
    kakera: kakera,
    picture: picture,
  };

  return data;
};

export const createCharacter = async (
  name: string,
  username: string,
  series: string,
  kakera: number,
  picture: string
) => {
  const data = await pb.collection("mudae_collection").create({
    name: name,
    owner: username,
    series: series,
    kakera: kakera,
    picture: picture,
    status: "MUDAE_KEEP",
  });

  return data;
};

export type Character = {
  id: string;
  name: string;
  series: string;
  kakera: number;
  picture: string;
  status: string;
};