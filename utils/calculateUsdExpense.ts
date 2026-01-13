import { getUsdRateForMonth } from "./getUsdRateForMonth";
import { getSettings } from "../services/settings.service";

type CalculateUsdExpense = (
  userId: string,
  month: string,
  amountUsd: number,
  taxProfileIds?: string[]
) => Promise<number>;

export const calculateUsdExpense: CalculateUsdExpense = async (
  userId,
  month,
  amountUsd,
  taxProfileIds = []
) => {
  const usdRate = await getUsdRateForMonth(userId, month);
  console.log("USD RATE →", usdRate, typeof usdRate);
  if (!usdRate || isNaN(usdRate)) {
    throw new Error(`USD rate not found for month ${month}`);
  }

  const settings = await getSettings(userId);
  if (!settings) throw new Error("Settings not found");

  const taxes = settings.taxProfiles.filter((tp) =>
    taxProfileIds.includes(tp.id)
  );

  const totalTaxPercentage = taxes.reduce(
    (acc, tax) => acc + tax.percentage,
    0
  );

  const taxedUsd = amountUsd * (1 + totalTaxPercentage / 100);

  return Math.round(taxedUsd * usdRate);
};
