import { useContext, useEffect, useRef, useState } from "react";
import {
  getCharacters,
  getFilteredCharacters,
  Character,
  addNewCharacter,
  updateStatus,
  getCharacterAmount,
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
import MudaeCard from "@/components/mudae_collection/MudaeCard";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MudaeContext } from "@/hooks/mudaeProvider";
import { getUserKakeraAmount } from "@/api/userApi";

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

  const mudaeName = useRef<HTMLInputElement>(null);
  const mudaeSeries = useRef<HTMLInputElement>(null);
  const mudaeKakera = useRef<HTMLInputElement>(null);
  const mudaePicture = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleFilteredFetchData(mudaeFilter, mudaeSort, mudaeSortType, fetchUser);
  }, [mudaeFilter, mudaeSort, mudaeSortType, fetchUser]);

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
    const characterPicture = mudaePicture.current?.value || "";

    if (
      !characterName ||
      !characterSeries ||
      !characterKakera ||
      !characterPicture
    ) {
      return;
    }

    try {
      await addNewCharacter(
        fetchUser,
        characterName,
        characterSeries,
        Number(characterKakera),
        characterPicture,
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
            <AlertDialogDescription className="flex flex-col gap-2 font-bold">
              <Input type="text" placeholder="Имя персонажа" ref={mudaeName} />
              <Input type="text" placeholder="Тайтл" ref={mudaeSeries} />
              <Input
                type="number"
                placeholder="Какера"
                min={0}
                max={9999}
                ref={mudaeKakera}
              />
              <Input
                type="text"
                placeholder="Ссылка на картинку"
                ref={mudaePicture}
              />
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-red-500/50 hover:bg-red-500">
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
      ))}
    </section>
  );
}
