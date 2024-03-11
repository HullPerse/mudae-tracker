import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getCharacters,
  getFilteredCharacters,
  Character,
  addNewCharacter,
  updateStatus,
  getCharacterAmount,
  deleteCharacter,
} from "@/api/characterApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const MudaeCard = React.lazy(
  () => import("@/components/mudae_collection/MudaeCard")
);

import { PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MudaeContext } from "@/hooks/mudaeProvider";
import { getUserKakeraAmount } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";

export default function MudaeMain() {
  const {
    mudaeFilter,
    mudaeSort,
    mudaeSortType,
    fetchUser,
    setKakeraAmount,
    setCharacterAmount,
  } = useContext(MudaeContext);

  const [characters, setCharacters] = useState<Character[]>([]);

  const [pictureArray, setPictureArray] = useState<string[]>([""]);

  const mudaeName = useRef<HTMLInputElement>(null);
  const mudaeSeries = useRef<HTMLInputElement>(null);
  const mudaeKakera = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleFilteredFetchData(mudaeFilter, mudaeSort, mudaeSortType, fetchUser);
  }, [mudaeFilter, mudaeSort, mudaeSortType, fetchUser]);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...pictureArray];
    values[index] = event.target.value;
    setPictureArray(values);
  };

  const addInputField = () => {
    if (pictureArray.length >= 5) {
      return;
    }

    setPictureArray([...pictureArray, ""]);
  };

  const removeInputField = (index: number) => {
    const values = [...pictureArray];
    values.splice(index, 1);
    setPictureArray(values);
  };

  const handleFetchData = async (fetchUser: string) => {
    try {
      const data = await getCharacters(fetchUser);
      const fetchedData: Character[] = data.map(record => ({
        id: record.id,
        name: record.name,
        series: record.series,
        kakera: record.kakera,
        picture: record.picture,
        status: record.status,
      }));
      setCharacters(fetchedData);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  const handleFilteredFetchData = async (
    mudaeFilter: string,
    mudaeSort: string,
    mudaeSortType: string,
    fetchUser: string
  ) => {
    try {
      let data = [];
      if (mudaeFilter.trim() == "" && mudaeSort == "") {
        data = await getCharacters(fetchUser);
      } else {
        data = await getFilteredCharacters(
          mudaeFilter,
          mudaeSort,
          mudaeSortType,
          fetchUser
        );
      }

      const fetchedData: Character[] = data.map(record => ({
        id: record.id,
        name: record.name,
        series: record.series,
        kakera: record.kakera,
        picture: record.picture,
        status: record.status,
      }));
      setCharacters(fetchedData);
    } catch (error) {
      console.error("Error fetching filtered characters:", error);
    }
  };

  const handleMudaeAdd = async () => {
    const characterName = mudaeName.current?.value || "";
    const characterSeries = mudaeSeries.current?.value || "";
    const characterKakera = mudaeKakera.current?.value || "";

    if (!characterName || !characterSeries || !characterKakera) {
      return;
    }

    try {
      await addNewCharacter(
        fetchUser,
        characterName,
        characterSeries,
        Number(characterKakera),
        JSON.parse(JSON.stringify(pictureArray)),
        "MUDAE_KEEP"
      );
      handleFetchData(fetchUser);

      const kakera = await getUserKakeraAmount(fetchUser);

      setKakeraAmount(kakera);

      const character = await getCharacterAmount(fetchUser);

      const mappedCharacters = character.map(record => record.status);
      const chracterAll = mappedCharacters.length;
      const characterKeep = mappedCharacters.filter(
        status => status == "MUDAE_KEEP"
      ).length;
      const characterSell = mappedCharacters.filter(
        status => status == "MUDAE_SELL"
      ).length;
      const chracterSellHigher = mappedCharacters.filter(
        status => status == "MUDAE_SELL_HIGHER"
      ).length;
      const characterExchange = mappedCharacters.filter(
        status => status == "MUDAE_EXCHANGE"
      ).length;

      setCharacterAmount([
        chracterAll,
        characterKeep,
        characterSell,
        chracterSellHigher,
        characterExchange,
      ]);

      setPictureArray([""]);
    } catch (error) {
      console.error("Error adding character:", error);
    }
  };

  const handleMudaeStatus = async (id: string, status: string) => {
    try {
      await updateStatus(id, status);

      const character = await getCharacterAmount(fetchUser);

      const mappedCharacters = character.map(record => record.status);
      const chracterAll = mappedCharacters.length;
      const characterKeep = mappedCharacters.filter(
        status => status == "MUDAE_KEEP"
      ).length;
      const characterSell = mappedCharacters.filter(
        status => status == "MUDAE_SELL"
      ).length;
      const chracterSellHigher = mappedCharacters.filter(
        status => status == "MUDAE_SELL_HIGHER"
      ).length;
      const characterExchange = mappedCharacters.filter(
        status => status == "MUDAE_EXCHANGE"
      ).length;

      setCharacterAmount([
        chracterAll,
        characterKeep,
        characterSell,
        chracterSellHigher,
        characterExchange,
      ]);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleMudaeDelete = async (id: string) => {
    if (fetchUser !== localStorage.getItem("user")) {
      return;
    }

    try {
      await deleteCharacter(id).then(() => {
        handleFetchData(fetchUser);
      });

      setKakeraAmount(await getUserKakeraAmount(fetchUser));

      const character = await getCharacterAmount(fetchUser);

      const mappedCharacters = character.map(record => record.status);
      const chracterAll = mappedCharacters.length;
      const characterKeep = mappedCharacters.filter(
        status => status == "MUDAE_KEEP"
      ).length;
      const characterSell = mappedCharacters.filter(
        status => status == "MUDAE_SELL"
      ).length;
      const chracterSellHigher = mappedCharacters.filter(
        status => status == "MUDAE_SELL_HIGHER"
      ).length;
      const characterExchange = mappedCharacters.filter(
        status => status == "MUDAE_EXCHANGE"
      ).length;

      setCharacterAmount([
        chracterAll,
        characterKeep,
        characterSell,
        chracterSellHigher,
        characterExchange,
      ]);
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  return (
    <section className="flex flex-row flex-wrap items-center p-2 gap-5">
      {fetchUser == localStorage.getItem("user") && (
        <AlertDialog>
          <AlertDialogTrigger className="flex flex-col w-[200px] h-[200px] pl-2 min-w-30 bg-colorSecond border-black/70 shadow-lg border-2 rounded-md drop-shadow-xl shadow-black/40  items-center justify-center">
            <PlusIcon className="h-20 w-20 rounded-full hover:bg-black/20 hover:cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Введите информацию о персонаже
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="flex flex-col gap-2 font-bold overflow-y-auto">
              <Input type="text" placeholder="Имя персонажа" ref={mudaeName} />
              <Input type="text" placeholder="Тайтл" ref={mudaeSeries} />
              <Input
                type="number"
                placeholder="Какера"
                min={0}
                max={9999}
                ref={mudaeKakera}
              />

              {pictureArray.map((value, index) => (
                <span key={index} className="inline-flex">
                  <Input
                    key={index}
                    value={value}
                    type="text"
                    placeholder={`${index == 0 ? "★" : ""} Ссылка на картинку`}
                    className="w-full"
                    onChange={event => handleInputChange(index, event)}
                  />
                  {index > 0 && (
                    <span
                      className="flex items-center justify-center w-[40px] h-[40px] ml-1 bg-red-500/50 hover:bg-red-500 rounded font-bold hover:cursor-pointer"
                      onClick={() => removeInputField(index)}
                    >
                      <TrashIcon
                        color="white"
                        className="text-white pointer-events-none"
                      />
                    </span>
                  )}
                </span>
              ))}
              <Button
                variant="outline"
                onClick={() => addInputField()}
                disabled={pictureArray.length >= 5}
              >
                Добавить картинку
              </Button>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-red-500/50 hover:bg-red-500"
                onClick={() => setPictureArray([""])}
              >
                Отменить
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-green-500/50 hover:bg-green-500 text-white"
                onClick={() => {
                  handleMudaeAdd();
                }}
              >
                Добавить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {characters.map((character: Character, index) => (
        <ContextMenu key={character.id}>
          <ContextMenuTrigger>
            <Suspense
              fallback={<ClipLoader color="#434343" loading size={40} />}
            >
              <MudaeCard
                key={character.id}
                id={character.id}
                index={index}
                name={character.name}
                series={character.series}
                kakera={character.kakera}
                picture={character.picture}
                status={character.status}
                handleMudaeFetch={handleFetchData}
                handleMudaeStatus={handleMudaeStatus}
              />
            </Suspense>
          </ContextMenuTrigger>
          <ContextMenuContent className="flex flex-col items-center justify-center">
            <a className="flex items-center justify-center w-full border-b-[2px] border-white/10 mb-2">
              {character.name}
            </a>
            <ContextMenuItem
              className="flex justify-center w-full bg-red-500/50 hover:bg-red-500 hover:cursor-pointer"
              onClick={() => handleMudaeDelete(character.id)}
            >
              Удалить
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </section>
  );
}
