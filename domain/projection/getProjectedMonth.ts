import { getFixedExpenses } from "../../services/expense.service";
import { projectMonth } from "./projectMonth";

export const getProjectedMonth = async (
  userId: string,
  targetMonth: string
) => {
  const fixedExpenses = await getFixedExpenses(userId);

  return projectMonth(userId, targetMonth, fixedExpenses);
};
