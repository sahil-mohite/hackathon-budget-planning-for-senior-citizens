import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Plus, Minus, Equal } from "lucide-react";

export function SimpleCalculator() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState<{ name: string; amount: string }[]>([
    { name: "Housing", amount: "" },
    { name: "Food", amount: "" },
    { name: "Utilities", amount: "" },
    { name: "Healthcare", amount: "" },
    { name: "Transportation", amount: "" },
  ]);
  const [result, setResult] = useState<number | null>(null);

  const addExpenseCategory = () => {
    setExpenses([...expenses, { name: "", amount: "" }]);
  };

  const updateExpense = (index: number, field: "name" | "amount", value: string) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const calculateBudget = () => {
    const totalIncome = parseFloat(income) || 0;
    const totalExpenses = expenses.reduce((sum, expense) => {
      return sum + (parseFloat(expense.amount) || 0);
    }, 0);
    setResult(totalIncome - totalExpenses);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-senior-xl font-bold text-foreground flex items-center justify-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          Budget Calculator
        </h2>
        <p className="text-senior-base text-muted-foreground">
          Enter your income and expenses to see your budget balance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Section */}
        <Card className="p-6 space-y-4">
          <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5 text-success" />
            Monthly Income
          </h3>
          <div className="space-y-2">
            <label className="text-senior-base text-muted-foreground">
              Total Monthly Income ($)
            </label>
            <Input
              type="number"
              placeholder="Enter your monthly income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="text-senior-base h-12"
            />
          </div>
        </Card>

        {/* Expenses Section */}
        <Card className="p-6 space-y-4">
          <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2">
            <Minus className="h-5 w-5 text-destructive" />
            Monthly Expenses
          </h3>
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Category name"
                  value={expense.name}
                  onChange={(e) => updateExpense(index, "name", e.target.value)}
                  className="text-senior-sm h-10"
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={expense.amount}
                    onChange={(e) => updateExpense(index, "amount", e.target.value)}
                    className="text-senior-sm h-10"
                  />
                  {expenses.length > 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeExpense(index)}
                      className="px-2"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addExpenseCategory}
              className="w-full text-senior-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </Card>
      </div>

      {/* Calculate Button */}
      <div className="text-center">
        <Button
          onClick={calculateBudget}
          size="lg"
          className="h-16 px-12 text-senior-lg font-semibold bg-gradient-primary hover:shadow-gentle"
        >
          <Equal className="h-6 w-6 mr-3" />
          Calculate Budget
        </Button>
      </div>

      {/* Result */}
      {result !== null && (
        <Card className={`p-6 text-center ${result >= 0 ? "bg-success" : "bg-destructive"} text-white`}>
          <div className="space-y-2">
            <p className="text-senior-base opacity-90">
              {result >= 0 ? "Remaining Budget" : "Budget Deficit"}
            </p>
            <p className="text-senior-2xl font-bold">
              ${Math.abs(result).toLocaleString()}
            </p>
            <p className="text-senior-sm opacity-80">
              {result >= 0 
                ? "Great! You're within budget." 
                : "Consider reducing expenses or increasing income."
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}