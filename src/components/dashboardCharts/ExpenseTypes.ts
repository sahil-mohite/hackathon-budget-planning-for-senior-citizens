export interface DailyExpense {
    day: string;
    expense: number;
  }
  
  export interface CategoryExpense {
    category: string;
    value: number;
  }
  
  export interface ExpenseData {
    dailyExpenses: DailyExpense[];
    categoryBreakdown: CategoryExpense[];
  }
  