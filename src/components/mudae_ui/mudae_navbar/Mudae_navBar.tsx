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
