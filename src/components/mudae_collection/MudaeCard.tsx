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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { STATUS } from "@/api/statusApi";

import { deleteCharacter } from "@/api/characterApi";

import kakeraIcon from "@/assets/kakera.webp";
import { useContext, useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";
import { MudaeContext } from "@/hooks/mudaeProvider";

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
  const { fetchUser } = useContext(MudaeContext);

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
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  useEffect(() => {
    setCurrentColor(STATUS[currentStatus as keyof typeof STATUS].color);
  }, [currentStatus]);

  return (
    <section className="flex flex-col max-w-[200px] max-h-[415px] p-2 min-w-30 bg-colorSecond border-black/70 shadow-lg border-2 rounded-md drop-shadow-xl shadow-black/40">
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
    </section>
  );
}
