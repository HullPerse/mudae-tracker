import { useContext } from "react";
import { MudaeContext } from "@/components/providers/userProvider";

import MudaeForm from "./Mudae_Form";
import MudaeNavigation from "./Mudae_Navigation";

import { Separator } from "@/components/ui/separator";

export default function MudaeNavBar() {
  const { user } = useContext(MudaeContext);

  return (
    <main className="flex flex-col w-full lg:w-[350px] m-4 pb-3 bg-accent rounded-lg">
      <section className="flex flex-row w-full items-center justify-center">
        <div className="flex flex-col flex-grow items-center justify-center">
          <h1 className="text-base font-bold  text-center mt-1">
            MUDAE TRACKER
          </h1>
          <span className="flex items-center justify-center w-full text-base text-center gap-x-2 mb-1">
            <span>By:</span>
            <a
              className="hover:underline hover:cursor-pointer"
              href="https://github.com/hullperse"
              target="_blank"
            >
              @hullperse
            </a>
          </span>
        </div>
      </section>
      <Separator className="bg-accent-foreground/40" />

      {!user ? <MudaeForm /> : <MudaeNavigation />}
    </main>
  );
}

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";

// import { Input } from "@/components/ui/input";
// import { useContext, useEffect, useRef, useState } from "react";
// import { MudaeContext } from "@/hooks/mudaeProvider";
// import {
//   createUser,
//   loginUser,
//   getAllUsers,
//   Users,
//   getUserKakeraAmount,
// } from "@/api/userApi";

// import { getCharacterAmount } from "@/api/characterApi";
// import { Button } from "@/components/ui/button";

// import kakeraIcon from "@/assets/kakera.webp";
// import MudaeCountdown from "@/components/mudae_navbar/MudaeCountdown";

// export default function MudaeNavBar() {
//   const [registration, setRegistration] = useState(false);
//   const [usersData, setUsersData] = useState<Users[]>([]);
//   const [waiting, setWaiting] = useState(false);

//   const {
//     setMudaeFilter,
//     setMudaeSort,
//     setMudaeSortType,
//     user,
//     setUser,
//     setFetchUser,
//     fetchUser,
//     kakeraAmount,
//     setKakeraAmount,
//     characterAmount,
//     setCharacterAmount,
//   } = useContext(MudaeContext);

//   const mudaeFilterText = useRef<HTMLInputElement>(null);
//   const mudaeUsernameLogin = useRef<HTMLInputElement>(null);
//   const mudaePasswordLogin = useRef<HTMLInputElement>(null);

//   const handleLogin = async () => {
//     const username = mudaeUsernameLogin.current?.value;
//     const password = mudaePasswordLogin.current?.value;

//     if (!username || !password) {
//       return;
//     }

//     try {
//       await loginUser(username, password).then(() => {
//         setFetchUser(username);
//         setUser(username);

//         window.location.reload();
//       });
//     } catch (error) {
//       setWaiting(false);
//     }
//   };

//   const handleRegistration = async () => {
//     const username = mudaeUsernameLogin.current?.value;
//     const password = mudaePasswordLogin.current?.value;

//     if (!username || !password) {
//       return;
//     }

//     try {
//       await createUser(username, password, password).then(async () => {
//         setRegistration(false);
//         setWaiting(false);
//       });
//     } catch (error) {
//       setWaiting(false);
//     }
//   };

//   const handleLogout = async () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("pocketbase_auth");
//   };

//   const handleUsersFetch = async () => {
//     try {
//       const data = await getAllUsers();
//       const fetchedData: Users[] = data.map(record => ({
//         username: record.username,
//       }));
//       setUsersData(fetchedData);
//     } catch (error) {
//       console.error("Error fetching characters:", error);
//     }
//   };

//   useEffect(() => {
//     handleUsersFetch();
//   }, []);

//   useEffect(() => {
//     const fetchKakera = async () => {
//       const kakera = await getUserKakeraAmount(fetchUser);

//       const character = await getCharacterAmount(fetchUser);

//       const mappedCharacters = character.map(record => record.status);
//       const chracterAll = mappedCharacters.length;
//       const characterKeep = mappedCharacters.filter(
//         status => status == "MUDAE_KEEP"
//       ).length;
//       const characterSell = mappedCharacters.filter(
//         status => status == "MUDAE_SELL"
//       ).length;
//       const chracterSellHigher = mappedCharacters.filter(
//         status => status == "MUDAE_SELL_HIGHER"
//       ).length;
//       const characterExchange = mappedCharacters.filter(
//         status => status == "MUDAE_EXCHANGE"
//       ).length;

//       setCharacterAmount([
//         chracterAll,
//         characterKeep,
//         characterSell,
//         chracterSellHigher,
//         characterExchange,
//       ]);

//       setKakeraAmount(kakera);
//     };

//     fetchKakera();
//   }, [fetchUser, setKakeraAmount, setCharacterAmount]);

//   return (
//     <nav className="flex flex-col lg:w-[350px] lg:h-[450px]">
//       <h1 className="text-base font-bold  text-center">MUDAE TRACKER</h1>
//       <span className="flex items-center justify-center w-full text-base text-center gap-x-2">
//         <span>By:</span>
//         <a
//           className="hover:underline hover:cursor-pointer"
//           href="https://github.com/hullperse"
//           target="_blank"
//         >
//           @hullperse
//         </a>
//       </span>

//       <div className="flex items-center justify-center">
//         {!user ? (
//           <form
//             className="flex flex-col w-full mx-2 pt-2 gap-y-1"
//             onSubmit={async e => {
//               e.preventDefault();
//               if (registration) {
//                 setWaiting(true);
//                 return handleRegistration();
//               }

//               handleLogin();
//               setWaiting(true);
//             }}
//           >
//             <Input
//               type="text"
//               placeholder="Имя пользователя"
//               ref={mudaeUsernameLogin}
//             />
//             <Input
//               type="password"
//               placeholder="Пароль"
//               ref={mudaePasswordLogin}
//             />
//             {registration ? (
//               <Button
//                 variant={"secondary"}
//                 onClick={handleRegistration}
//                 disabled={waiting}
//               >
//                 Зарегистрироваться
//               </Button>
//             ) : (
//               <Button
//                 variant={"secondary"}
//                 onClick={handleLogin}
//                 disabled={waiting}
//               >
//                 Войти
//               </Button>
//             )}

//             <div className="flex flex-row-reverse justify-between">
//               <a
//                 className="hover:cursor-pointer hover:underline"
//                 onClick={() => {
//                   setRegistration(!registration);
//                 }}
//               >
//                 {registration ? "Войти" : "Зарегистрироваться"}
//               </a>
//               {registration && (
//                 <HoverCard>
//                   <HoverCardTrigger className="hover:cursor-pointer hover:underline">
//                     Требования
//                   </HoverCardTrigger>
//                   <HoverCardContent className="w-full">
//                     <ul className="list-disc list-inside">
//                       <li>Имя пользователя не должно содержать пробелов</li>
//                       <li>Пароль должен иметь минимум 8 символов</li>
//                     </ul>
//                   </HoverCardContent>
//                 </HoverCard>
//               )}
//             </div>
//           </form>
//         ) : (
//           <section className="flex flex-col px-2 py-4 gap-y-1 w-full">
//             <div className="inline-flex">
//               <Select
//                 onValueChange={value => {
//                   setFetchUser(value);
//                 }}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue
//                     placeholder="Выберите пользователя"
//                     defaultValue={user.toUpperCase()}
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {usersData.map((user, index) => (
//                     <SelectItem key={index} value={user.username}>
//                       {user.username.toUpperCase()}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Button
//                 variant={"destructive"}
//                 className="ml-2"
//                 onClick={() => {
//                   handleLogout();
//                 }}
//               >
//                 Выйти
//               </Button>
//             </div>
//             <div>
//               <label className="text-base font-bold">Поиск</label>
//               <Input
//                 placeholder="Имя персонажа или тайтл"
//                 ref={mudaeFilterText}
//                 onChange={() =>
//                   setMudaeFilter(mudaeFilterText.current?.value || "")
//                 }
//               />
//             </div>
//             <div>
//               <label className="text-base font-bold">Сортировка</label>
//               <div className="flex flex-row">
//                 <Select
//                   onValueChange={value => {
//                     setMudaeSort(value);
//                   }}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue
//                       placeholder="По дате добавления"
//                       defaultValue="created"
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="created">По дате добавления</SelectItem>
//                     <SelectItem value="name">По имени</SelectItem>
//                     <SelectItem value="series">По тайтлу </SelectItem>
//                     <SelectItem value="kakera">По какере</SelectItem>
//                     <SelectItem value="status">По статусу</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   onValueChange={value => {
//                     setMudaeSortType(value);
//                   }}
//                 >
//                   <SelectTrigger className="w-1/4">
//                     <SelectValue placeholder="Тип" defaultValue=" " />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value=" ">По возрастанию</SelectItem>
//                     <SelectItem value="-">По убыванию</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="inline-flex items-start justify-between">
//               <div className="mr-2">
//                 <ul className="flex flex-col list-decimal ml-4">
//                   <li key={"all"}>
//                     Всего:
//                     <span className="font-bold ml-1">{characterAmount[0]}</span>
//                   </li>
//                   <li key={"keep"}>
//                     Оставить:
//                     <span className="font-bold ml-1">{characterAmount[1]}</span>
//                   </li>
//                   <li key={"sell"}>
//                     Продать:
//                     <span className="font-bold ml-1">{characterAmount[2]}</span>
//                   </li>
//                   <li key={"exchange"}>
//                     На обмен:
//                     <span className="font-bold ml-1">{characterAmount[4]}</span>
//                   </li>
//                 </ul>
//               </div>
//               <div className="inline-flex">
//                 <span>{kakeraAmount}</span>
//                 <img src={kakeraIcon} className="w-6 h-6" />
//               </div>
//             </div>
//             <div className="flex items-center justify-center">
//               <MudaeCountdown />
//             </div>
//           </section>
//         )}
//       </div>
//     </nav>
//   );
// }
