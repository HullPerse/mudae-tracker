import { Character } from "@/api/character_api";
import React, { createContext, useState } from "react";

type MudaeContextType = {
  user: string | null;
  setUser: (value: string | null) => void;
  fetchedUser: string;
  setFetchedUser: (value: string) => void;
  kakera: number;
  setKakera: (value: number) => void;
  filter: string;
  setFilter: (value: string) => void;
  filterType: "created" | "name" | "series" | "kakera" | "status";
  setFilterType: (
    value: "created" | "name" | "series" | "kakera" | "status"
  ) => void;
  filterPosition: "asc" | "desc";
  setFilterPosition: (value: "asc" | "desc") => void;
  characterDataArray: Character[];
  setCharacterDataArray: (value: Character[]) => void;
  newCharacter: Character[];
  setNewCharacter: (value: Character[]) => void;
};

const initialFilterState: MudaeContextType = {
  user: localStorage.getItem("user") || null,
  setUser: () => {},
  fetchedUser: localStorage.getItem("user") || "",
  setFetchedUser: () => {},
  kakera: 0,
  setKakera: () => {},
  filter: "",
  setFilter: () => {},
  filterType: "created",
  setFilterType: () => {},
  filterPosition: "asc",
  setFilterPosition: () => {},
  characterDataArray: [],
  setCharacterDataArray: () => {},
  newCharacter: [],
  setNewCharacter: () => {},
};

const MudaeContext = createContext<MudaeContextType>(initialFilterState);

const MudaeProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(initialFilterState.user);
  const [fetchedUser, setFetchedUser] = useState(
    initialFilterState.fetchedUser
  );
  const [kakera, setKakera] = useState(initialFilterState.kakera);
  const [filter, setFilter] = useState(initialFilterState.filter);
  const [filterType, setFilterType] = useState(initialFilterState.filterType);
  const [filterPosition, setFilterPosition] = useState(
    initialFilterState.filterPosition
  );
  const [characterDataArray, setCharacterDataArray] = useState(
    initialFilterState.characterDataArray
  );
  const [newCharacter, setNewCharacter] = useState(
    initialFilterState.newCharacter
  );

  return (
    <MudaeContext.Provider
      value={{
        user,
        setUser,
        fetchedUser,
        setFetchedUser,
        kakera,
        setKakera,

        filter,
        setFilter,
        filterType,
        setFilterType,
        filterPosition,
        setFilterPosition,

        characterDataArray,
        setCharacterDataArray,
        newCharacter,
        setNewCharacter,
      }}
    >
      {children}
    </MudaeContext.Provider>
  );
};

export { MudaeProvider, MudaeContext };
