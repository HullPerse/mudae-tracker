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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import MudaeCountdown from "./Mudae_Countdown";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useQuery } from "@tanstack/react-query";

import { getUserList } from "@/api/user_api";

import { Oval } from "react-loader-spinner";
import { ModeToggle } from "@/components/mudae_ui/mudae_navbar/ThemeToggle";
import { useContext, useRef, useState } from "react";
import { MudaeContext } from "@/components/providers/userProvider";

import KakeraIcon from "@/assets/kakera.webp";
import { PlusIcon, TrashIcon } from "lucide-react";
import { createCharacter } from "@/api/character_api";

export default function MudaeNavigation() {
  const {
    setUser,
    kakera,
    setFilter,
    setFilterType,
    setFilterPosition,
    fetchedUser,
    setFetchedUser,
    setNewCharacter,
  } = useContext(MudaeContext);

  const [pictureArray, setPictureArray] = useState<string[]>([""]);

  const mudaeFilterText = useRef<HTMLInputElement>(null);

  const mudaeName = useRef<HTMLInputElement>(null);
  const mudaeSeries = useRef<HTMLInputElement>(null);
  const mudaeKakera = useRef<HTMLInputElement>(null);

  const { isPending, error, data } = useQuery({
    queryKey: ["userList"],
    queryFn: getUserList,
  });

  if (isPending)
    return (
      <div className="flex items-center justify-center">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="white"
          secondaryColor="black"
          ariaLabel="oval-loading"
          wrapperClass="py-20"
        />
      </div>
    );

  if (error) return "Произошла ошибка при загрузке данных: " + error.message;

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setFetchedUser("");
    setUser(null);
  };

  const handleMudaeAdd = async () => {
    const name = mudaeName.current?.value;
    const series = mudaeSeries.current?.value;
    const kakera = mudaeKakera.current?.value;

    if (name && series && kakera) {
      await createCharacter(
        name,
        localStorage.getItem("user") || fetchedUser,
        series,
        Number(kakera),
        JSON.parse(JSON.stringify(pictureArray))
      ).then(data => {
        const newData = {
          id: data.id,
          name: data.name,
          series: data.series,
          kakera: data.kakera,
          picture: data.picture,
          status: data.status,
        };

        setNewCharacter([newData]);
      });
    }

    setPictureArray([""]);
  };

  return (
    <main className="flex flex-col justify-center w-full gap-y-1 px-2 pt-2">
      <div className="inline-flex">
        <Select onValueChange={setFetchedUser}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите пользователя" />
          </SelectTrigger>
          <SelectContent>
            {data.map((user, index) => (
              <SelectItem key={index} value={user.username}>
                {user.username.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant={"destructive"} className="ml-2" onClick={handleLogout}>
          Выйти
        </Button>
      </div>

      <section>
        <Input
          type="text"
          placeholder="Поиск персонажа"
          ref={mudaeFilterText}
          onChange={() => {
            setFilter(mudaeFilterText.current?.value || "");
          }}
        />

        <div className="flex flex-col mt-2">
          <Label className="mb-1">Сортировка</Label>
          <div className="inline-flex">
            <Select onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="По дате добавления" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">По дате добавления</SelectItem>
                <SelectItem value="name">По имени</SelectItem>
                <SelectItem value="series">По тайтлу</SelectItem>
                <SelectItem value="kakera">По какере</SelectItem>
                <SelectItem value="status">По статусу</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setFilterPosition}>
              <SelectTrigger className="w-1/4">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">По возрастанию</SelectItem>
                <SelectItem value="desc">По убыванию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <section className="inline-flex justify-between items-center w-full">
          <div className="flex"></div>
          <div className="inline-flex">
            <span>{kakera}</span>
            <img src={KakeraIcon} alt="kakera" className="w-6 h-6" />
          </div>
        </section>

        <div className="mt-4 py-2 border-[1px] border-white/20 rounded-md">
          <MudaeCountdown />
        </div>

        <div className="flex flex-col justify-center gap-y-2 pt-2">
          {fetchedUser == localStorage.getItem("user") && (
            <AlertDialog>
              <AlertDialogTrigger className="flex items-center justify-center w-full py-1 rounded-md border border-input bg-white/10 hover:bg-white/15">
                <PlusIcon />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Введите информацию о персонаже
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="flex flex-col gap-2 font-bold overflow-y-auto">
                  <Input
                    type="text"
                    placeholder="Имя персонажа"
                    ref={mudaeName}
                  />
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
                        placeholder={`${
                          index == 0 ? "★" : ""
                        } Ссылка на картинку`}
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

          <ModeToggle />
        </div>
      </section>
    </main>
  );
}
