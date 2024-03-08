import React, { createContext, useState } from "react";

type MudaeContextType = {
  user: string | null;
  setUser: (value: string | null) => void;
  fetchUser: string;
  setFetchUser: (value: string) => void;
  mudaeFilter: string;
  setMudaeFilter: (value: string) => void;
  mudaeSort: string;
  setMudaeSort: (value: string) => void;
  mudaeSortType: string;
  setMudaeSortType: (value: string) => void;
};

const initialFilterState: MudaeContextType = {
  user: localStorage.getItem("user") || null,
  setUser: () => {},
  fetchUser: localStorage.getItem("user") || "",
  setFetchUser: (value: string) => {
    value;
  },
  mudaeFilter: "",
  setMudaeFilter: () => {},
  mudaeSort: "created",
  setMudaeSort: () => {},
  mudaeSortType: "",
  setMudaeSortType: () => {},
};

const MudaeContext = createContext<MudaeContextType>(initialFilterState);

const MudaeProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(initialFilterState.user);
  const [fetchUser, setFetchUser] = useState(initialFilterState.fetchUser);
  const [mudaeFilter, setMudaeFilter] = useState(
    initialFilterState.mudaeFilter
  );
  const [mudaeSort, setMudaeSort] = useState(initialFilterState.mudaeSort);
  const [mudaeSortType, setMudaeSortType] = useState(
    initialFilterState.mudaeSortType
  );

  return (
    <MudaeContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        setFetchUser,
        mudaeFilter,
        setMudaeFilter,
        mudaeSort,
        setMudaeSort,
        mudaeSortType,
        setMudaeSortType,
      }}
    >
      {children}
    </MudaeContext.Provider>
  );
};

export { MudaeProvider, MudaeContext };
