import { useContext, useEffect, useRef, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  deleteCharacter,
  updateCharacter,
  updateStatus,
} from "@/api/character_api";

import KakeraBlue from "@/assets/KakeraBlue.webp";
import KakeraTeal from "@/assets/KakeraTeal.webp";
import KakeraGreen from "@/assets/KakeraGreen.webp";
import KakeraYellow from "@/assets/KakeraYellow.webp";
import KakeraRed from "@/assets/KakeraRed.webp";
import KakeraOrange from "@/assets/KakeraOrange.webp";
import KakeraWhite from "@/assets/KakeraWhite.webp";

import Placeholder from "@/assets/placeholder.png";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MudaeContext } from "@/components/providers/userProvider";
import { STATUS } from "@/api/status_api";
import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Character {
  id: string;
  name: string;
  kakera: number;
  picture: string;
  series: string;
  status: string;
}

export default function MudaeCard({
  name,
  id,
  series,
  kakera,
  picture,
  status,
  index,
  getEvents,
  handleEvents,
}: {
  id: string;
  name: string;
  series: string;
  kakera: number;
  picture: string;
  status: string;
  index: number;
  getEvents: Character[];
  handleEvents: (data: Character[]) => void;
}) {
  const { fetchedUser, setCharacterDataArray, setKakera } =
    useContext(MudaeContext);

  const [imageArray, setImageArray] = useState<string[]>([]);
  const [pictureArray, setPictureArray] = useState<string[]>([]);

  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentColor, setCurrentColor] = useState(
    STATUS[status as keyof typeof STATUS].color
  );

  const mudaeName = useRef<HTMLInputElement>(null);
  const mudaeSeries = useRef<HTMLInputElement>(null);
  const mudaeKakera = useRef<HTMLInputElement>(null);

  const getInputAmount = async () => {
    const data = JSON.stringify(picture)
      .replace(/"/g, "")
      .replace("[", "")
      .replace("]", "")
      .replace(" ", "")
      .split(",").length;

    const newArray = new Array(data).fill("");

    setImageArray(newArray);
  };

  const handleMudaeCurrentStatus = (status: string) => {
    if (fetchedUser !== localStorage.getItem("user")) {
      return;
    }

    setCurrentStatus(status);

    handleMudaeStatus(id, status);
  };

  const handleMudaeStatus = async (id: string, status: string) => {
    try {
      await updateStatus(id, status);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const handleMudaeDelete = async (id: string) => {
    if (fetchedUser !== localStorage.getItem("user")) {
      return;
    }

    await deleteCharacter(id).then(() => {
      const newData = getEvents.filter(
        item => item.id !== id
      ) as unknown as CharacterData[];

      handleEvents(newData as unknown as Character[]);
    });
  };

  const handleMudaeUpdate = async (id: string) => {
    if (fetchedUser !== localStorage.getItem("user")) {
      return;
    }

    imageArray.forEach((element, index) => {
      if (!element) {
        imageArray[index] = JSON.stringify(picture)
          .replace(/"/g, "")
          .replace("[", "")
          .replace("]", "")
          .replace(" ", "")
          .split(",")[index];
      }
    });

    imageArray.forEach((element, index) => {
      if (element == " ") {
        imageArray.splice(index, 1);
      }
    });

    const characterName = mudaeName.current?.value;
    const characterSeries = mudaeSeries.current?.value;
    const characterKakera = Number(mudaeKakera.current?.value);

    if (characterName && characterSeries && characterKakera) {
      await updateCharacter(
        id,
        characterName,
        characterSeries,
        characterKakera,
        JSON.parse(JSON.stringify(imageArray))
      ).then(data => {
        const newData = getEvents.filter(item => item.id == id);

        newData[0].name = data.name;
        newData[0].series = data.series;
        newData[0].kakera = data.kakera;
        newData[0].picture = data.picture;

        const findIndex = getEvents.findIndex(item => item.id == id);

        getEvents[findIndex] = newData[0];

        setCharacterDataArray([...getEvents]);

        const getKakeraAmount = () => {
          let kakeraValue = 0;

          for (let i = 0; i < getEvents.length; i++) {
            kakeraValue += getEvents[i].kakera;
          }

          return kakeraValue;
        };

        setKakera(getKakeraAmount());
      });
    }

    setImageArray([""]);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const values = [...imageArray];
    values[index] = event.target.value;

    setImageArray(values);
  };

  const addInputField = () => {
    if (imageArray.length >= 5) {
      return;
    }

    setImageArray([...imageArray, ""]);
  };

  const removeInputField = (index: number) => {
    const values = [...imageArray];
    values.splice(index, 1);
    setImageArray(values);
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

    setPictureArray(pictureStringArray);
  }, [currentStatus, picture]);

  const getKakeraIcon = () => {
    if (name == "Vito Corleone") {
      return KakeraWhite as string;
    }

    if (kakera >= 0 && kakera < 151) {
      return KakeraBlue as string;
    }

    if (kakera >= 151 && kakera < 251) {
      return KakeraTeal as string;
    }

    if (kakera >= 251 && kakera < 401) {
      return KakeraGreen as string;
    }

    if (kakera >= 401 && kakera < 601) {
      return KakeraYellow as string;
    }

    if (kakera >= 601 && kakera < 801) {
      return KakeraOrange as string;
    }

    if (kakera >= 801) {
      return KakeraRed as string;
    }
  };

  return (
    <div
      className="flex flex-col max-xs:min-w-[165px] max-xs:max-w-[165px] min-w-[200px] max-w-[200px] min-h-[550px] max-h-[550px] p-2 min-w-30 bg-accent border-black/70 shadow-lg border-2 rounded-md drop-shadow-xl shadow-black/40
    "
    >
      <div className="inline-flex justify-between z-50">
        <p className="font-extralight text-accent-foreground h-[25px] w-[25px]">
          {index + 1}.
        </p>
      </div>

      <Carousel>
        <CarouselContent>
          {pictureArray.map((picture, index) => (
            <CarouselItem key={index}>
              <div className="flex w-full h-[280px] max-xs:h-[224px] justify-center border-[1px] border-white rounded">
                <LazyLoadImage
                  src={picture}
                  placeholderSrc={Placeholder}
                  effect="blur"
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
            src={getKakeraIcon()}
            height={20}
            width={20}
            className="pb-1"
            loading="lazy"
            draggable="false"
          />
        </div>
      </Carousel>
      <section className="flex flex-col justify-end w-full mt-auto pt-1">
        <div className="inline-flex ">
          <Select onValueChange={handleMudaeCurrentStatus}>
            <SelectTrigger
              className={`${
                fetchedUser === localStorage.getItem("user")
                  ? "w-[80%] max-xs:w-[65%]"
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
              <SelectItem value={"MUDAE_EXCHANGE"}>
                {STATUS.MUDAE_EXCHANGE.name}
              </SelectItem>
            </SelectContent>
          </Select>
          {fetchedUser === localStorage.getItem("user") && (
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

        {fetchedUser === localStorage.getItem("user") && (
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

                {imageArray.map((value, index) => (
                  <span key={index} className="inline-flex">
                    <Input
                      key={index}
                      type="text"
                      placeholder={value}
                      value={pictureArray[index]}
                      className="w-full"
                      onChange={event => handleInputChange(event, index)}
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
                  disabled={imageArray.length >= 5}
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
    </div>
  );
}
