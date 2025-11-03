export type ExpenseIdT = string & { readonly __brand: unique symbol };

export type Expense = {
  id: ExpenseIdT;
  name: string;
  totalAmount: number;
  date: string;
  remainingAmount: number;
};
