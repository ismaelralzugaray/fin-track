import type { Timestamp } from "firebase/firestore"

export type Currency = "ARS" | "USD"
export type ExpenseType = "fixed" | "variable"

export interface Expense {
    id?: string,
    userId: string,
    month: string,
    name: string,
    category: string,
    type: ExpenseType,
    currency: Currency,
    amount: number,
    taxProfileIds?: string[],
    finalAmountArs: number,
    createdAt: Timestamp

}