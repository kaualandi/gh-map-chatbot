import { api } from "../constants/axios";
import { IEvent } from "../models/event";
import { IPlace } from "../models/place";
import { User } from "../models/user";

export async function getPlaces() {
  return api.get<IPlace[]>(`/places/`);
}

export async function getEvents() {
  return api.get<IEvent[]>(`/event/`);
}

export async function getUserByPhone(phone: string) {
  return api.get<User>(`/user/user_by_phone/?phone=${phone}`);
}
