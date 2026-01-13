import { getExpensesByMonth } from "../../services/expense.service";
import {
  saveMonthlySummary,
  getMonthlySummary,
} from "../../services/monthlySummaries.service";
import { getPreviousMonth } from "../../utils/month";
import { buildMonthlySummary } from "../../utils/buildMonthlySummary";
import { deleteMonthlySummary } from "../../services/monthlySummaries.service";

export const recalculateMonthlySummary = async (
  userId: string,
  month: string
) => {
  const expenses = await getExpensesByMonth(userId, month);

  if (expenses.length === 0) {
    await deleteMonthlySummary(userId, month);
    return;
  }

  const summary = buildMonthlySummary(userId, month, expenses);

  const previousMonth = getPreviousMonth(month);
  const previousSummary = await getMonthlySummary(
    userId,
    previousMonth
  );

  if (previousSummary) {
    const diffArs = summary.totals.ars - previousSummary.totals.ars;
    const diffPercentage =
      previousSummary.totals.ars > 0
        ? (diffArs / previousSummary.totals.ars) * 100
        : 0;

    summary.comparison = {
      previousMonthArs: previousSummary.totals.ars,
      diffArs,
      diffPercentage,
    };
  }

  await saveMonthlySummary(userId, month, summary);
};
