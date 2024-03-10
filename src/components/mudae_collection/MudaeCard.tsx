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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
import { Input } from "@/components/ui/input";
import { getUserKakeraAmount } from "@/api/userApi";
import { Button } from "../ui/button";

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
  const [photoArray, setPhotoArray] = useState<string[]>([]);
  const [pictureArray, setPictureArray] = useState<string[]>([""]);

  const mudaeName = useRef<HTMLInputElement>(null);
  const mudaeSeries = useRef<HTMLInputElement>(null);
  const mudaeKakera = useRef<HTMLInputElement>(null);

  const { fetchUser, setKakeraAmount, setCharacterAmount } =
    useContext(MudaeContext);

  const getInputAmount = async () => {
    const data = JSON.stringify(picture)
      .replace(/"/g, "")
      .replace("[", "")
      .replace("]", "")
      .replace(" ", "")
      .split(",").length;

    const newArray = new Array(data).fill("");

    setPictureArray(newArray);
  };

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

    pictureArray.forEach((element, index) => {
      if (!element) {
        pictureArray[index] = JSON.stringify(picture)
          .replace(/"/g, "")
          .replace("[", "")
          .replace("]", "")
          .replace(" ", "")
          .split(",")[index];
      }
    });

    pictureArray.forEach((element, index) => {
      if (element == " ") {
        pictureArray.splice(index, 1);
      }
    });

    if (
      mudaeName.current?.value &&
      mudaeSeries.current?.value &&
      mudaeKakera.current?.value
    ) {
      await updateCharacter(
        id,
        mudaeName.current?.value,
        mudaeSeries.current?.value,
        Number(mudaeKakera.current?.value),
        JSON.parse(JSON.stringify(pictureArray))
      ).then(async () => {
        handleMudaeFetch(fetchUser);
        setKakeraAmount(await getUserKakeraAmount(fetchUser));
        setPictureArray([""]);
      });
    }
  };

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

  useEffect(() => {
    setCurrentColor(STATUS[currentStatus as keyof typeof STATUS].color);

    const pictureString = JSON.stringify(picture);
    const pictureStringArray: string[] = [];

    pictureString
      .replace(/"/g, "")
      .replace("[", "")
      .replace("]", "")
      .split(",")
      .forEach(element => {
        pictureStringArray.push(element);
      });

    setPhotoArray(pictureStringArray);
  }, [currentStatus, picture]);

  return (
    <section className="flex flex-col  min-w-[200px] max-w-[200px] min-h-[550px] max-h-[550px] p-2 min-w-30 bg-colorSecond border-black/70 shadow-lg border-2 rounded-md drop-shadow-xl shadow-black/40 ">
      <div className="inline-flex justify-between z-50">
        <p className="font-extralight text-white/30 h-[25px] w-[25px]">
          {index + 1}.
        </p>
      </div>

      <Carousel>
        <CarouselContent>
          {photoArray.map((picture, index) => (
            <CarouselItem key={index}>
              <div className="flex w-full h-[280px] justify-center border-[1px] border-white rounded">
                <img
                  src={picture}
                  loading="lazy"
                  className="rounded object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute -top-7 right-0 h-[20px] mr-2 z-50">
          <CarouselPrevious className="flex items-center justify-center h-[25px] w-[25px]" />

          <CarouselNext className="flex items-center justify-center h-[25px] w-[25px]" />
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
      </Carousel>
      <section className="flex flex-col justify-end w-full mt-auto pt-1">
        <div className="inline-flex ">
          <Select onValueChange={handleMudaeCurrentStatus}>
            <SelectTrigger
              className={`${
                fetchUser === localStorage.getItem("user")
                  ? "w-[80%]"
                  : "w-full"
              } font-bold`}
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
          {fetchUser === localStorage.getItem("user") && (
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
          )}
        </div>

        {fetchUser === localStorage.getItem("user") && (
          <AlertDialog>
            <AlertDialogTrigger className="flex items-center justify-center">
              <span
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1 w-full h-10 px-4 py-2"
                onClick={() => getInputAmount()}
              >
                Настроить
              </span>
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

                {pictureArray.map((value, index) => (
                  <span key={index} className="inline-flex">
                    <Input
                      key={index}
                      value={value}
                      type="text"
                      placeholder={photoArray[index]}
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
    </section>
  );
}
