import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";
import type { Settings } from "../types/settings";

type GetSettings = (userId: string) => Promise<Settings | null>;

type SaveSettings = (settings: Settings) => Promise<void>;

//Obtiene la coleccion settings
export const getSettings: GetSettings = async (userId) => {
  const ref = doc(db, "settings", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data()

  return {
    userId: data.userId,
    usdRateCurrent: Number(data.usdRateCurrent),
    updatedAt: data.updatedAt.toDate(),
    taxProfiles: (data.taxProfiles ?? []).map((tp: any) => ({
      id: tp.id,
      name: tp.name,
      percentage: Number(tp.value), // 🔥 ACÁ ESTÁ LA MAGIA
    })),
  };
};

//Guarda la coleccion settings
export const saveSettings: SaveSettings = async (settings) => {
  const ref = doc(db, "settings", settings.userId);

  await setDoc(ref, { ...settings, updatedAt: Timestamp.now() });
};
