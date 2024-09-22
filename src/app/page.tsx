
import { HydrateClient } from "~/trpc/server";
import Chat from "../components/chat";
import { Aff } from "~/components/aff";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2">
          <Aff />
        </div>
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16 overflow-hidden">
          <Chat />
        </div>
      </main>
    </HydrateClient>
  );
}
