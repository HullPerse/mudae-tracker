import { lazy, useContext, useEffect, useState } from "react";
import { getCharacterData } from "@/api/character_api";
import { MudaeContext } from "@/components/providers/userProvider";
import { useQuery } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";
import MudaeTable from "../Mudae_Table/Mudae_Table";

const MudaeCard = lazy(
  () => import("@/components/mudae_ui/mudae_cards/Mudae_Card")
);

interface Character {
  id: string;
  owner?: string;
  name: string;
  kakera: number;
  picture: string;
  series: string;
  status: string;
  created?: string;
}

type FilterPosition = "asc" | "desc";

export default function MudaePage() {
  const {
    fetchedUser,
    filter,
    filterType,
    filterPosition,
    setKakera,
    newCharacter,
  } = useContext(MudaeContext);

  const [characterDataArray, setCharacterDataArray] = useState<Character[]>([]);

  const { data, isPending, error } = useQuery({
    queryKey: ["characterData", fetchedUser],
    queryFn: async () => {
      return await getCharacterData(fetchedUser);
    },
  });

  useEffect(() => {
    if (data) {
      setCharacterDataArray(data as unknown as Character[]);
      setKakera(getKakeraAmount(data as unknown as Character[]));
    }
  }, [data, setKakera]);

  useEffect(() => {
    filterDataFetch(filter, filterType, filterPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, filterType, filterPosition]);

  useEffect(() => {
    setCharacterDataArray([...characterDataArray, ...newCharacter]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCharacter]);

  const filterDataFetch = (
    filter: string,
    filterType: string,
    filterPosition: FilterPosition
  ) => {
    if (data) {
      const filteredData = data.filter(
        item =>
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.series.toLowerCase().includes(filter.toLowerCase()) ||
          ""
      ) as unknown as Character[];

      if (filterType === "created") {
        if (filterPosition === "asc") {
          setCharacterDataArray(filteredData);
        } else {
          setCharacterDataArray(filteredData.reverse());
        }
      } else {
        const sortedData = filteredData.sort((a, b) => {
          let firstValue: string | number | Date;
          let secondValue: string | number | Date;

          switch (filterType) {
            case "name":
              firstValue = a.name.toLowerCase();
              secondValue = b.name.toLowerCase();
              break;
            case "series":
              firstValue = a.series.toLowerCase();
              secondValue = b.series.toLowerCase();
              break;
            case "kakera":
              firstValue = a.kakera;
              secondValue = b.kakera;
              break;
            case "status":
              firstValue = a.status;
              secondValue = b.status;
              break;
            default:
              firstValue = a.name.toLowerCase();
              secondValue = b.name.toLowerCase();
              break;
          }

          if (filterPosition === "asc") {
            return firstValue < secondValue
              ? -1
              : firstValue > secondValue
              ? 1
              : 0;
          } else if (filterPosition === "desc") {
            return firstValue > secondValue
              ? -1
              : firstValue < secondValue
              ? 1
              : 0;
          }
          return 0;
        });

        setCharacterDataArray(sortedData);
      }
    }
  };

  const getKakeraAmount = (data: Character[]) => {
    let kakeraValue = 0;
    for (let i = 0; i < data.length; i++) {
      kakeraValue += data[i].kakera;
    }
    return kakeraValue;
  };

  if (isPending)
    return (
      <div className="flex items-center justify-center">
        <Oval
          visible={true}
          height={80}
          width={80}
          color="white"
          secondaryColor="black"
          ariaLabel="oval-loading"
          wrapperClass="py-20"
        />
      </div>
    );

  if (error) {
    console.error(error);
    return <div>Произошла ошибка при загрузке данных: {error.message}</div>;
  }

  if (fetchedUser === "allCharactersTable") {
    return <MudaeTable dataArray={characterDataArray} />;
  } else {
    return (
      <div className="flex flex-row flex-wrap items-center justify-center p-2 gap-5">
        {characterDataArray.map((item, index) => (
          <MudaeCard
            id={item.id}
            name={item.name}
            series={item.series}
            kakera={item.kakera}
            picture={item.picture}
            status={item.status}
            key={item.id}
            index={index}
            getEvents={characterDataArray}
            handleEvents={setCharacterDataArray}
          />
        ))}
      </div>
    );
  }
}
