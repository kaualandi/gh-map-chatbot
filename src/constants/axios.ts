import axios from "axios";

export const api = axios.create({
  baseURL: "https://ghmap-a4aebd12be1f.herokuapp.com/",
  headers: {
    "Content-Type": "application/json",
  },
});
