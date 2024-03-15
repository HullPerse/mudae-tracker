import { columns } from "@/components/mudae_ui/Mudae_Table/Mudae_Columns";
import { DataTable } from "@/components/mudae_ui/Mudae_Table/Mudae_Data";

export interface Character {
  id: string;
  owner?: string;
  name: string;
  kakera: number;
  picture: string;
  series: string;
  status: string;
  created?: string;
}
export default function MudaeTable({ dataArray }: { dataArray: Character[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={dataArray} />
    </div>
  );
}
