import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import type { Expense } from "../types/expenses";
import { calculateUsdExpense } from "../utils/calculateUsdExpense";
import { recalculateMonthlySummary } from "../domain/monthlySummaries/recalculateMonthlySummary";

type GetExpensesByMonth = (
  userId: string,
  month: string
) => Promise<Expense[]>;

//Crear una expense
export const createExpense = async (
  expense: Omit<Expense, "finalAmountArs" | "createdAt">
) => {
  let finalAmountArs = expense.amount;

  if (expense.currency === "USD") {
    finalAmountArs = await calculateUsdExpense(
      expense.userId,
      expense.month,
      expense.amount,
      expense.taxProfileIds
    );
  }

  if (isNaN(finalAmountArs)) {
    throw new Error("Final amount ARS is NaN");
  }

  await addDoc(collection(db, "expenses"), {
    ...expense,
    finalAmountArs,
    createdAt: Timestamp.now(),
  });

  await recalculateMonthlySummary(expense.userId, expense.month);
};

//Obtener expense por mes
export const getExpensesByMonth: GetExpensesByMonth = async (
  userId,
  month
) => {
  const q = query(
    collection(db, "expenses"),
    where("userId", "==", userId),
    where("month", "==", month)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Expense[];
};

export const updateExpense = async (
  expenseId: string,
  updated: Partial<Omit<Expense, "id" | "createdAt">>
) => {
  const ref = doc(db, "expenses", expenseId);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Expense not found");

  const prevExpense = snap.data() as Expense;

  let finalAmountArs = prevExpense.finalAmountArs;

  const currency = updated.currency ?? prevExpense.currency;
  const amount = updated.amount ?? prevExpense.amount;
  const month = updated.month ?? prevExpense.month;
  const taxProfileIds =
    updated.taxProfileIds ?? prevExpense.taxProfileIds;

  if (
    currency === "USD" &&
    (updated.amount || updated.taxProfileIds || updated.month)
  ) {
    finalAmountArs = await calculateUsdExpense(
      prevExpense.userId,
      month,
      amount,
      taxProfileIds
    );
  }

  if (currency === "ARS" && updated.amount !== undefined) {
    finalAmountArs = amount;
  }

  await updateDoc(ref, {
    ...updated,
    finalAmountArs,
    updatedAt: Timestamp.now(),
  });

  // 🔁 Recalcular meses afectados
  await recalculateMonthlySummary(
    prevExpense.userId,
    prevExpense.month
  );

  if (updated.month && updated.month !== prevExpense.month) {
    await recalculateMonthlySummary(
      prevExpense.userId,
      updated.month
    );
  }
};

export const deleteExpense = async (expenseId: string) => {
  const ref = doc(db, "expenses", expenseId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const expense = snap.data() as Expense;

  await deleteDoc(ref);

  await recalculateMonthlySummary(expense.userId, expense.month);
};

export const getFixedExpenses = async (
  userId: string
): Promise<Expense[]> => {
  const q = query(
    collection(db, "expenses"),
    where("userId", "==", userId),
    where("type", "==", "fixed")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Expense[];
};
