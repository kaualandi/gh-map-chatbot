import { Client, create, STATE } from "@open-wa/wa-automate";
import { WA_CREATE } from "./constants/wa-create";
import { messageHandler } from "./services/message";

create(WA_CREATE).then((client) => start(client));

function start(client: Client) {
  console.log("\n\x1b[32m", "[SERVER]", "\x1b[0m", "Server is running!");

  client.onStateChanged((state: STATE) => {
    console.log("[Status do cliente]", state);
    if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
  });

  client.onMessage((message) => messageHandler(client, message));
}
