import type { Expense } from "../../types/expenses";
import { calculateUsdExpense } from "../../utils/calculateUsdExpense";

type ProjectedExpense = {
  name: string;
  category: string;
  currency: "ARS" | "USD";
  originalAmount: number;
  projectedAmountArs: number;
};

export const projectMonth = async (
  userId: string,
  targetMonth: string,
  fixedExpenses: Expense[]
) => {
  let totalArs = 0;

  const projectedExpenses: ProjectedExpense[] = [];

  for (const expense of fixedExpenses) {
    let projectedArs = expense.amount;

    if (expense.currency === "USD") {
      projectedArs = await calculateUsdExpense(
        userId,
        targetMonth,
        expense.amount,
        expense.taxProfileIds
      );
    }

    totalArs += projectedArs;

    projectedExpenses.push({
      name: expense.name,
      category: expense.category,
      currency: expense.currency,
      originalAmount: expense.amount,
      projectedAmountArs: projectedArs,
    });
  }

  return {
    month: targetMonth,
    totalArs: Math.round(totalArs),
    expenses: projectedExpenses,
  };
};
