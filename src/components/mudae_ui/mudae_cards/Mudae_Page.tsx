import { useContext, useEffect, useRef, useState } from "react";
import { getCharacterData } from "@/api/character_api";
import { MudaeContext } from "@/components/providers/userProvider";
import { useQuery } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";
import MudaeTable from "@/components/mudae_ui/Mudae_Table/Mudae_Table";

import { ArrowBigDown } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import MudaeCard from "@/components/mudae_ui/mudae_cards/Mudae_Card";
import { Button } from "@/components/ui/button";
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
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [charactersPerPage] = useState(50);

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

  const scrollToBottom = () => {
    const element = cardsContainerRef.current;
    if (element) {
      const maxPosition = document.body.offsetHeight - window.innerHeight;
      const currentPosition = window.scrollY;
      element?.scrollIntoView({
        behavior: "smooth",
        block: currentPosition + 100 < maxPosition ? "end" : "start",
      });
    }
  };

  // Get current characters
  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = characterDataArray.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <section className="flex w-full">
        <div className="flex flex-col w-full">
          <div
            id="cards"
            ref={cardsContainerRef} // Attach ref to the cards container
            className="flex flex-row flex-wrap items-center justify-center p-2 gap-5"
          >
            {currentCharacters.map((item, index) => (
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
                handleEvents={setCharacterDataArray} // Ensure setCharacterDataArray is defined elsewhere
              />
            ))}
          </div>
          <div className="fixed right-0 bottom-0 m-4">
            <div
              className="flex items-center justify-center bg-white/10 w-14 h-14 rounded-full hover:cursor-pointer hover:bg-white/50"
              onClick={scrollToBottom} // Attach scrollToBottom function to onClick event
            >
              <ArrowBigDown className="pointer-events-none" size={40} />
            </div>
          </div>
          <div>
            <Pagination>
              <PaginationPrevious
                isActive={currentPage !== 1}
                className="mx-2 hover:cursor-pointer"
              >
                <Button
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  ←
                </Button>
              </PaginationPrevious>
              <PaginationContent>
                {[
                  ...Array(
                    Math.ceil(characterDataArray.length / charactersPerPage)
                  ).keys(),
                ].map(number => (
                  <PaginationItem key={number + 1}>
                    <PaginationLink
                      isActive={currentPage === number + 1}
                      onClick={() => paginate(number + 1)}
                      className="hover:cursor-pointer"
                    >
                      {number + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
              <PaginationNext
                isActive={
                  currentPage ===
                  Math.ceil(characterDataArray.length / charactersPerPage)
                }
                className="mx-2 hover:cursor-pointer"
              ></PaginationNext>
            </Pagination>
          </div>
        </div>
      </section>
    );
  }
}
