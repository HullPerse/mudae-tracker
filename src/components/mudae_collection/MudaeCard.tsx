import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import { STATUS } from "@/api/statusApi";

import {
  deleteCharacter,
  getCharacterAmount,
  updateCharacter,
} from "@/api/characterApi";

import kakeraIcon from "@/assets/kakera.webp";
import { useContext, useEffect, useRef, useState } from "react";
import { TrashIcon } from "lucide-react";
import { MudaeContext } from "@/hooks/mudaeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserKakeraAmount } from "@/api/userApi";

export default function MudaeCard({
  name,
  index,
  id,
  series,
  kakera,
  picture,
  status,
  handleMudaeFetch,
  handleMudaeStatus,
}: {
  name: string;
  id: string;
  index: number;
  series: string;
  kakera: number;
  picture: string;
  status: string;
  handleMudaeFetch: (fetchUser: string) => Promise<void>;
  handleMudaeStatus: (id: string, status: string) => void;
}) {
  const [currentColor, setCurrentColor] = useState(
    STATUS[status as keyof typeof STATUS].color
  );
  const [currentStatus, setCurrentStatus] = useState(status);

  const mudaeName = useRef<HTMLInputElement>(null);
  const mudaeSeries = useRef<HTMLInputElement>(null);
  const mudaeKakera = useRef<HTMLInputElement>(null);
  const mudaePicture = useRef<HTMLInputElement>(null);

  const { fetchUser, setKakeraAmount, setCharacterAmount } =
    useContext(MudaeContext);

  const handleMudaeCurrentStatus = (status: string) => {
    if (fetchUser !== localStorage.getItem("user")) {
      return;
    }

    setCurrentStatus(status);

    handleMudaeStatus(id, status);
  };

  const handleMudaeDelete = async (id: string) => {
    if (fetchUser !== localStorage.getItem("user")) {
      return;
    }

    try {
      await deleteCharacter(id).then(() => {
        handleMudaeFetch(fetchUser);
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

  const handleMudaeUpdate = async (id: string) => {
    if (fetchUser !== localStorage.getItem("user")) {
      return;
    }

    if (
      mudaeName.current?.value &&
      mudaeSeries.current?.value &&
      mudaeKakera.current?.value &&
      mudaePicture.current?.value
    ) {
      await updateCharacter(
        id,
        mudaeName.current?.value,
        mudaeSeries.current?.value,
        Number(mudaeKakera.current?.value),
        mudaePicture.current?.value
      ).then(async () => {
        handleMudaeFetch(fetchUser);
        setKakeraAmount(await getUserKakeraAmount(fetchUser));
      });
    }
  };

  useEffect(() => {
    setCurrentColor(STATUS[currentStatus as keyof typeof STATUS].color);
  }, [currentStatus]);

  return (
    <section className="flex flex-col max-w-[200px] max-h-[450px] p-2 min-w-30 bg-colorSecond border-black/70 shadow-lg border-2 rounded-md drop-shadow-xl shadow-black/40">
      <p className="font-extralight text-white/30 h-[25px] w-[25px]">
        {index + 1}.
      </p>
      <div className="w-[100%] h-[100%] object-cover overflow-hidden">
        <img
          src={picture}
          height={200}
          width={200}
          loading="lazy"
          className="rounded"
        />
      </div>

      <h2 className="font-extrabold pt-1">{name}</h2>
      <p className="font-extralight">{series}</p>
      <div className="inline-flex">
        <p className="font-bold">{kakera}</p>
        <img
          src={kakeraIcon}
          height={20}
          width={20}
          className="pb-1"
          loading="lazy"
        />
      </div>
      <div className="inline-flex">
        <Select onValueChange={handleMudaeCurrentStatus}>
          <SelectTrigger
            className={`w-[80%] font-bold`}
            style={{ backgroundColor: currentColor }}
          >
            <SelectValue
              placeholder={STATUS[status as keyof typeof STATUS].name}
              defaultValue={status}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"MUDAE_KEEP"}>
              {STATUS.MUDAE_KEEP.name}
            </SelectItem>
            <SelectItem value={"MUDAE_SELL"}>
              {STATUS.MUDAE_SELL.name}
            </SelectItem>
            <SelectItem value={"MUDAE_SELL_HIGHER"}>
              {STATUS.MUDAE_SELL_HIGHER.name}
            </SelectItem>
            <SelectItem value={"MUDAE_EXCHANGE"}>
              {STATUS.MUDAE_EXCHANGE.name}
            </SelectItem>
          </SelectContent>
        </Select>

        <AlertDialog>
          <AlertDialogTrigger className="text-center bg-red-500/50 hover:bg-red-500/30 p-2 ml-2 rounded-md items-end justify-evenly hover:cursor-pointer">
            <TrashIcon size={24} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Вы уверены, что хотите удалить этого персонажа?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500/50 hover:bg-red-500 text-white"
                onClick={() => handleMudaeDelete(id)}
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {fetchUser === localStorage.getItem("user") && (
        <AlertDialog>
          <AlertDialogTrigger className="flex items-center justify-center">
            <Button variant="outline" className="mt-1 w-full">
              Настроить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Измените информацию о персонаже
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="flex flex-col gap-2 font-bold">
              <Input
                type="text"
                placeholder="Имя персонажа"
                defaultValue={name}
                ref={mudaeName}
              />
              <Input
                type="text"
                placeholder="Тайтл"
                defaultValue={series}
                ref={mudaeSeries}
              />
              <Input
                type="number"
                placeholder="Какера"
                defaultValue={kakera}
                ref={mudaeKakera}
              />
              <Input
                type="text"
                placeholder="Ссылка на картинку"
                defaultValue={picture}
                ref={mudaePicture}
              />
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                className="bg-green-500/50 hover:bg-green-500 text-white"
                onClick={() => handleMudaeUpdate(id)}
              >
                Сохранить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </section>
  );
}
