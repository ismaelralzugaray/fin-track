import type { Expense } from "../types/expenses";
import type { MonthlySummary } from "../types/monthlySummary";

export const buildMonthlySummary = (
  userId: string,
  month: string,
  expenses: Expense[]
): MonthlySummary => {
  let totalArs = 0;
  let totalUsd = 0;

  const byType = {
    fixed: 0,
    variable: 0,
  };

  const byCategory: Record<string, number> = {};

  for (const expense of expenses) {
    // 🛡️ Guard básico
    if (isNaN(expense.finalAmountArs)) {
      throw new Error(`Expense ${expense.id} has NaN finalAmountArs`);
    }

    totalArs += expense.finalAmountArs;

    if (expense.currency === "USD") {
      totalUsd += expense.amount;
    }

    // byType
    byType[expense.type] += expense.finalAmountArs;

    // byCategory
    const category = expense.category || "Sin categoría";
    byCategory[category] =
      (byCategory[category] ?? 0) + expense.finalAmountArs;
  }

  return {
    userId,
    month,
    totals: {
      ars: Math.round(totalArs),
      usd: Math.round(totalUsd),
    },
    byType,
    byCategory,
    comparison: null, // se completa en A1.3
    metadata: {
      expensesCount: expenses.length,
    },
    updatedAt: new Date(),
  };
};
