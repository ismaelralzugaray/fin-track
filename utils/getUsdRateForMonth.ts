import { getClosedRatesMonth } from "../services/exchangeRates.service";
import { getSettings } from "../services/settings.service";

type getUsdRateForMonth = (
  userId: string,
  month: string
) => Promise<number>;

export const getUsdRateForMonth: getUsdRateForMonth = async (
  userId,
  month
) => {
  const closedRate = await getClosedRatesMonth(month);
  if (closedRate) return closedRate;

  const settings = await getSettings(userId);
  if (!settings) throw new Error("Settings not found");

  return settings.usdRateCurrent;
};
