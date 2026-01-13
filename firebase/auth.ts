import { getAuth } from "firebase/auth";
import { app } from "./config"; // donde inicializás Firebase

export const auth = getAuth(app);
