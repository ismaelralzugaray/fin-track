export interface MonthlySummary {
  id?: string;
  userId: string;
  month: string;

  totals: {
    ars: number;
    usd: number;
  };

  byType: {
    fixed: number;
    variable: number;
  };

  byCategory: Record<string, number>;

  comparison: {
    previousMonthArs: number;
    diffArs: number;
    diffPercentage: number;
  } | null;

  metadata: {
    expensesCount: number;
  };

  updatedAt: Date;
}
