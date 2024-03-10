import PocketBase from "pocketbase";

const pb = new PocketBase("https://mudae-tracker.pockethost.io/");

export type Character = {
  id: string;
  name: string;
  series: string;
  kakera: number;
  picture: string;
  status: string;
};

const getCharacters = async (fetchUser: string) => {
  const characters = await pb
    .collection("mudae_collection")
    .getFullList({
      fields: "id,name,series,kakera,picture,status",
      filter: `owner = "${fetchUser}"`,
      $autoCancel: false,
    })
    .then(res => res);

  return characters;
};

const getFilteredCharacters = async (
  mudaeFilter: string,
  mudaeSort: string,
  mudaeSortType: string,
  fetchedUser: string
) => {
  const characters = await pb
    .collection("mudae_collection")
    .getFullList({
      fields: "id,name,series,kakera,picture,status",
      filter: `name~"${mudaeFilter}" && owner = "${fetchedUser}" || series~"${mudaeFilter}" && owner = "${fetchedUser}"`,
      sort: `${mudaeSortType}${mudaeSort}`,
      $autoCancel: false,
    })
    .then(res => res);

  return characters;
};

const addNewCharacter = async (
  owner: string,
  name: string,
  series: string,
  kakera: number,
  picture: string[],
  status: string
) => {
  const characterData = {
    owner: owner,
    name: name,
    series: series,
    kakera: kakera,
    picture: picture,
    status: status,
  };

  await pb.collection("mudae_collection").create(characterData);
};

const deleteCharacter = async (id: string) => {
  await pb.collection("mudae_collection").delete(id);
};

const updateStatus = async (id: string, status: string) => {
  await pb.collection("mudae_collection").update(id, { status: status });
};

const updateCharacter = async (
  id: string,
  name: string,
  series: string,
  kakera: number,
  picture: string
) => {
  const characterData = {
    name: name,
    series: series,
    kakera: kakera,
    picture: picture,
  };

  await pb.collection("mudae_collection").update(id, characterData);
};

const getCharacterAmount = async (fetchedUser: string) => {
  const data = await pb
    .collection("mudae_collection")
    .getFullList({
      filter: `owner = "${fetchedUser}"`,

      $autoCancel: false,
    })
    .then(res => res);

  return data;
};

export {
  getCharacters,
  getFilteredCharacters,
  addNewCharacter,
  deleteCharacter,
  updateStatus,
  updateCharacter,
  getCharacterAmount,
};
