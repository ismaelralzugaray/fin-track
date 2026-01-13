import {
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  Timestamp,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import type { MonthlySummary } from "../types/monthlySummary";

const COLLECTION = "monthlySummary";

const summaryDocId = (userId: string, month: string) =>
  `${userId}_${month}`;

export const saveMonthlySummary = async (
  userId: string,
  month: string,
  summary: Omit<
    MonthlySummary,
    "id" | "userId" | "month" | "updateAt"
  >
): Promise<void> => {
  const ref = doc(db, COLLECTION, summaryDocId(userId, month));

  await setDoc(ref, {
    ...summary,
    userId,
    month,
    updatedAt: Timestamp.now(),
  });
};

export const getMonthlySummary = async (
  userId: string,
  month: string
): Promise<MonthlySummary | null> => {
  const ref = doc(
    db,
    COLLECTION,
    summaryDocId(userId, month)
  );

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as MonthlySummary;
};

export const getMonthlySummaries = async (
  userId: string
): Promise<MonthlySummary[]> => {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MonthlySummary[];
};

export const deleteMonthlySummary = async (
  userId: string,
  month: string
): Promise<void> => {
  const ref = doc(db, COLLECTION, summaryDocId(userId, month));
  await deleteDoc(ref);
};
