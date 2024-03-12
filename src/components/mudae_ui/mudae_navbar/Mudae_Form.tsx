import { useContext, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser, loginUser } from "@/api/user_api";
import { MudaeContext } from "@/components/providers/userProvider";

export default function MudaeForm() {
  const { setUser, setFetchedUser } = useContext(MudaeContext);

  const [login, setLogin] = useState(true);
  const [waiting, setWaiting] = useState(false);

  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleAuth = async () => {
    const username = loginRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      return;
    }

    if (username.length < 3 || password.length < 8) {
      return;
    }

    if (login) {
      await loginUser(username, password).then(() => {
        localStorage.setItem("user", username);
        setUser(username.toLowerCase());
        setFetchedUser(username.toLowerCase());
      });
    } else {
      await createUser(username, password).then(async () => {
        await loginUser(username, password).then(() => {
          localStorage.setItem("user", username);
          setUser(username.toLowerCase());
          setFetchedUser(username.toLowerCase());
        });
      });
    }
  };

  return (
    <form
      className="flex flex-col justify-center w-full gap-y-1 px-2 pt-2"
      onSubmit={e => e.preventDefault()}
    >
      <Input type="text" placeholder="Логин" className="" ref={loginRef} />
      <Input type="password" placeholder="Пароль" ref={passwordRef} />

      <Button
        variant={"outline"}
        className="bg-green-500/20 hover:bg-green-500/60"
        onClick={() => {
          setWaiting(true);
          setTimeout(() => setWaiting(false), 3000);

          handleAuth();
        }}
        disabled={waiting}
      >
        {login ? "Войти" : "Зарегистрироваться"}
      </Button>

      <div className="flex flex-row-reverse justify-between gap-x-5">
        <a
          className="hover:cursor-pointer hover:underline"
          onClick={() => setLogin(!login)}
        >
          {login ? "Зарегистрироваться" : "Войти"}
        </a>
      </div>

      {!login && (
        <ul className="list-disc list-inside text-sm border-red-500/50 px-2 border-[1px] rounded-md">
          <li>Имя пользователя не должно содержать пробелов</li>
          <li>Пароль должен быть не менее 8 символов</li>
        </ul>
      )}
    </form>
  );
}
