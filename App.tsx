import { getExpensesByMonth } from "./services/expense.service";
import { createExpense } from "./services/expense.service";
import { recalculateMonthlySummary } from "./domain/monthlySummaries/recalculateMonthlySummary";
import "./App.css";
import { useEffect } from "react";
import { getMonthlySummaries } from "./services/monthlySummaries.service";

function App() {
  useEffect(() => {
    getMonthlySummaries("test-user").then(console.log);
  }, []);
  
  return (
    <>
      <button
        onClick={() =>
          createExpense({
            userId: "test-user",
            month: "2026-01",
            name: "Netflix",
            category: "Servicios",
            type: "fixed",
            currency: "USD",
            amount: 15,
            taxProfileIds: ["cardUsd", "advanceGain"],
          })
        }
      >
        Crear gasto USD
      </button>

      <button
        onClick={async () => {
          const expenses = await getExpensesByMonth(
            "test-user",
            "2026-01"
          );
          console.log(expenses);
        }}
      >
        Leer gastos Enero
      </button>

      <button
        onClick={async () => {
          await recalculateMonthlySummary("test-user", "2026-01");
          console.log("Summary recalculado");
        }}
      >
        Recalcular Enero
      </button>
    </>
  );
}

export default App;
