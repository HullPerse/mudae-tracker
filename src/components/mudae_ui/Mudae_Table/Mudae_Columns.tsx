import { ColumnDef } from "@tanstack/react-table";

import { Character } from "@/components/mudae_ui/Mudae_Table/Mudae_Table";

import { Button } from "@/components/ui/button";

import { ArrowUpDown } from "lucide-react";
import { STATUS } from "@/api/status_api";

export const columns: ColumnDef<Character>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Имя
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "series",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Тайтл
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "kakera",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Какера
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Статус
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({
      row: {
        original: { status: value },
      },
    }) => (
      <div
        style={{
          color: STATUS[value as keyof typeof STATUS].color,
          fontWeight: "bold",
        }}
      >
        {STATUS[value as keyof typeof STATUS].name}
      </div>
    ),
  },

  {
    accessorKey: "owner",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Владелец
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({
      row: {
        original: { owner: value },
      },
    }) => <div>{value}</div>,
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Создан
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({
      row: {
        original: { created: value },
      },
    }) => (
      <div className="flex flex-col justify-center">
        <span>{value?.split(" ")[0]}</span>
        <span>{value?.split(" ")[1].split(".")[0]}</span>
      </div>
    ),
  },
];
