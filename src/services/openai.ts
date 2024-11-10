import { Client, Message } from "@open-wa/wa-automate";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { SYSTEM_CONTEXT } from "../constants/system-context";
import { IPlace } from "../models/place";

require("dotenv").config();

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askQuestion(
  waClient: Client,
  message: Message,
  backContext: ChatCompletionMessageParam[],
  places: IPlace[]
) {
  const messages: ChatCompletionMessageParam[] = [];
  messages.push({
    role: "system",
    content: SYSTEM_CONTEXT,
  });
  messages.push(...backContext);

  const allMessages = await waClient.getAllMessagesInChat(
    message.from,
    true,
    false
  );

  allMessages.slice(0, 10);

  allMessages.forEach((msg) => {
    messages.push({
      role: msg.fromMe ? "assistant" : "user",
      content: msg.body,
    });
  });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    response.choices.forEach(async (choice) => {
      let content = choice.message.content || "";
      const match = content.match(/\[sendLocation\((\d+)\)\]/);
      if (match) content = content.replace(match[0], "");

      if (content) {
        await waClient.sendText(message.from, content);
      }

      if (match) {
        const id = match[1];
        console.log("ID", id);
        const place = places.find((p) => p.id === parseInt(id));
        if (place) {
          await waClient.sendLocation(
            message.from,
            place.latitude,
            place.longitude,
            `${place.title}\n${place.subtitle}\n${place.description}`
          );
        }
      }
    });
  } catch (error) {
    console.error(error);
    return "Tá pegando fogo, bicho!";
  }
}
