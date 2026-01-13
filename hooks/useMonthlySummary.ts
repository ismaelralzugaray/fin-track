import { useEffect, useState } from "react";
import { getMonthlySummary } from "../services/monthlySummaries.service";
import type { MonthlySummary } from "../types/monthlySummary";

export const useMonthlySummary = (
  userId: string,
  month: string
) => {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMonthlySummary(userId, month)
      .then(setSummary)
      .finally(() => setLoading(false));
  }, [userId, month]);

  return { summary, loading };
};
