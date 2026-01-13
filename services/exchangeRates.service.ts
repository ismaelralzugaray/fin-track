import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";

type GetClosedRatesMonth = (month: string) => Promise<number | null>;

type CloseMonth = (month: string, usdRate: number) => Promise<void>;

//Obtener meses cerrados
export const getClosedRatesMonth: GetClosedRatesMonth = async (
  month
) => {
  const ref = doc(db, "exchangeRates", month);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data().usdRate : null;
};

//Cerrar mes
export const closeMonth: CloseMonth = async (month, usdRate) => {
  await setDoc(doc(db, "exchangeRates", month), {
    month,
    usdRate,
    closedAt: Timestamp.now(),
  });
};
