import { lazy, Suspense, useContext } from "react";

const LazyMudaeMain = lazy(() => import("@/components/mudaeMain"));
import MudaeNavBar from "@/components/MudaeNavBar";

import { Triangle } from "react-loader-spinner";
import { MudaeContext } from "@/hooks/mudaeProvider";

function App() {
  const { user } = useContext(MudaeContext);

  return (
    <main
      className="flex lg:flex-row flex-col"
      onContextMenu={event => event.preventDefault()}
    >
      <nav className="lg:sticky top-2 lg:w-fit lg:h-fit w-full bg-colorSecond border-2 border-foreground pt-2 lg:mt-2 lg:ml-2 rounded-md">
        <MudaeNavBar />
      </nav>
      <div className="flex-grow">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <Triangle
                color="#ffffff"
                height={80}
                width={80}
                ariaLabel="triangle-loading"
              />
            </div>
          }
        >
          {user && <LazyMudaeMain />}
        </Suspense>
      </div>
    </main>
  );
}

export default App;
