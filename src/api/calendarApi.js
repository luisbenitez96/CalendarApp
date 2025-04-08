import axios from "axios";
import { getEnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables();

const calendarApi = axios.create({
  baseURL: VITE_API_URL,
});

// TODO: configurar interceptores

calendarApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  }; // la funcionalidad de los interceptores es la misma que la de los middlewares en express, se ejecutan antes de que la petición llegue al servidor y después de que la respuesta llegue al cliente, sirven para modificar la petición o la respuesta, aqui se agrega el token a la cabecera de la petición en este caso es x-token, y despues en el local storage se guarda el token, y se le pasa al servidor para que lo valide, si no existe el token o es incorrecto el servidor no dejara pasar la peticion

  return config;
});

export default calendarApi;
