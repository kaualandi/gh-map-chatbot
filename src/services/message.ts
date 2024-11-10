import { Client, Message } from "@open-wa/wa-automate";
import { ChatCompletionMessageParam } from "openai/resources";
import {
  getSystemContextMonthEvents,
  getSystemContextMyCalendar,
  getSystemContextNotLogged,
  getSystemContextPlaces,
} from "../constants/system-context";
import { IPlace } from "../models/place";
import { askQuestion } from "./openai";
import { getEvents, getPlaces, getUserByPhone } from "./user";

export async function messageHandler(client: Client, message: Message) {
  if (message.isGroupMsg) return;

  client.getAmountOfLoadedMessages().then((msg) => {
    if (msg >= 3000) {
      client.cutMsgCache();
    }
  });

  if (message.body?.startsWith("!")) {
    let userEvents = getSystemContextNotLogged();
    try {
      const phone = message.from.split("@")[0];
      const userResponse = await getUserByPhone(phone);
      const user = userResponse.data;
      userEvents = getSystemContextMyCalendar(user.my_calendar);
    } catch (error) {
      console.log("Erro ao buscar usuário", error);
    }

    let eventsMessage = "";
    try {
      const eventsResponse = await getEvents();
      const events = eventsResponse.data;
      eventsMessage = getSystemContextMonthEvents(events);
    } catch (error) {
      console.log("Erro ao buscar eventos", error);
    }

    let placesMessage = "";
    let places: IPlace[] = [];
    try {
      const placesResponse = await getPlaces();
      places = placesResponse.data;
      placesMessage = getSystemContextPlaces(places);
    } catch (error) {
      console.log("Erro ao buscar places", error);
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: userEvents,
      },
      {
        role: "system",
        content: eventsMessage,
      },
      {
        role: "system",
        content: placesMessage,
      },
    ];

    console.log(messages);

    await askQuestion(client, message, messages, places);
  }
}
