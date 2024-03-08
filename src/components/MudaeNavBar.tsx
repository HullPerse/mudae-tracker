import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useContext, useEffect, useRef, useState } from "react";
import { MudaeContext } from "@/hooks/mudaeProvider";
import { createUser, loginUser, getAllUsers, Users } from "@/api/userApi";
import { Button } from "./ui/button";

export default function MudaeNavBar() {
  const [registration, setRegistration] = useState(false);
  const [usersData, setUsersData] = useState<Users[]>([]);

  const {
    setMudaeFilter,
    setMudaeSort,
    setMudaeSortType,
    user,
    setUser,
    setFetchUser,
  } = useContext(MudaeContext);

  const mudaeFilterText = useRef<HTMLInputElement>(null);
  const mudaeUsernameLogin = useRef<HTMLInputElement>(null);
  const mudaePasswordLogin = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    const username = mudaeUsernameLogin.current?.value;
    const password = mudaePasswordLogin.current?.value;

    if (!username || !password) {
      return;
    }

    await loginUser(username, password).then(() => {
      setFetchUser(username);
      setUser(username);

      window.location.reload();
    });
  };

  const handleRegistration = async () => {
    const username = mudaeUsernameLogin.current?.value;
    const password = mudaePasswordLogin.current?.value;

    if (!username || !password) {
      return;
    }

    await createUser(username, password, password).then(async () => {
      setRegistration(false);
    });
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("pocketbase_auth");
  };

  const handleUsersFetch = async () => {
    try {
      const data = await getAllUsers();
      const fetchedData: Users[] = data.map(record => ({
        username: record.username,
      }));
      setUsersData(fetchedData);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  useEffect(() => {
    handleUsersFetch();
  }, []);

  return (
    <nav className="flex flex-col lg:w-[350px] lg:h-[450px]">
      <h1 className="text-base font-bold  text-center">MUDAE TRACKER</h1>
      <a className="text-base text-center">By: @hullperse</a>

      <div className="flex items-center justify-center">
        {!user ? (
          <section className="flex flex-col w-full mx-2 pt-2 gap-y-1">
            <Input
              type="text"
              placeholder="Имя пользователя"
              ref={mudaeUsernameLogin}
            />
            <Input
              type="password"
              placeholder="Пароль"
              ref={mudaePasswordLogin}
            />
            {registration ? (
              <Button variant={"secondary"} onClick={handleRegistration}>
                Зарегистрироваться
              </Button>
            ) : (
              <Button variant={"secondary"} onClick={handleLogin}>
                Войти
              </Button>
            )}

            <div className="flex justify-end">
              <a
                className="hover:cursor-pointer hover:underline"
                onClick={() => {
                  setRegistration(!registration);
                }}
              >
                {registration ? "Войти" : "Зарегистрироваться"}
              </a>
            </div>
          </section>
        ) : (
          <section className="flex flex-col px-2 py-4 gap-y-1 w-full">
            <div className="inline-flex">
              <Select
                onValueChange={value => {
                  setFetchUser(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={user} defaultValue={user} />
                </SelectTrigger>
                <SelectContent>
                  {usersData.map((user, index) => (
                    <SelectItem key={index} value={user.username}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={"destructive"}
                className="ml-2"
                onClick={() => {
                  handleLogout();
                }}
              >
                Выйти
              </Button>
            </div>
            <div>
              <label className="text-base font-bold">Поиск</label>
              <Input
                placeholder="Имя персонажа или тайтл"
                ref={mudaeFilterText}
                onChange={() =>
                  setMudaeFilter(mudaeFilterText.current?.value || "")
                }
              />
            </div>
            <div>
              <label className="text-base font-bold">Сортировка</label>
              <div className="flex flex-row">
                <Select
                  onValueChange={value => {
                    setMudaeSort(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="По дате добавления"
                      defaultValue="created"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created">По дате добавления</SelectItem>
                    <SelectItem value="name">По имени</SelectItem>
                    <SelectItem value="series">По тайтлу </SelectItem>
                    <SelectItem value="kakera">По какере</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={value => {
                    setMudaeSortType(value);
                  }}
                >
                  <SelectTrigger className="w-1/4">
                    <SelectValue placeholder="Тип" defaultValue=" " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">По возрастанию</SelectItem>
                    <SelectItem value="-">По убыванию</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        )}
      </div>
    </nav>
  );
}
