
import { HydrateClient } from "~/trpc/server";
import Chat from "../components/chat";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Chat />
        </div>
      </main>
    </HydrateClient>
  );
}
