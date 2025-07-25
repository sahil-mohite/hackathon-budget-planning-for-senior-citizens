import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Tbody, Td, Th, Thead, Tr } from "@/components/ui/tablecomp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { ScrollDownButton } from "./ScrollDownButton";
import { useNavigate } from 'react-router-dom';

const ExpenseSchema = z.object({
  id: z.string(),
  bill_date: z.string(),
  store_name: z.string(),
  item_name: z.string(),
  quantity: z.number(),
  category: z.string(),
  total_amount: z.number(),
});

type Expense = z.infer<typeof ExpenseSchema>;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const History = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Expense>({
    resolver: zodResolver(ExpenseSchema),
  });

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:8090/expenses", {
        headers: getAuthHeaders(),
      })
      if(res.status==401){
        localStorage.removeItem('token')
        navigate('/login')
      }
      else if (!res.ok) throw new Error();
      else{
          const data = await res.json();
    
          const cleanedData = data
            .map((item: any) => {
              const totalAmount =
                item.total_amount !== undefined
                  ? item.total_amount
                  : item.unit_price && item.quantity
                  ? item.unit_price * item.quantity
                  : 0;
    
              const cleaned: Expense = {
                id: String(item.id ?? ""),
                bill_date: String(item.bill_date ?? ""),
                store_name: String(item.store_name ?? ""),
                item_name: String(item.item_name ?? ""),
                quantity: Number(item.quantity ?? 0),
                category: String(item.category ?? ""),
                total_amount: Number(totalAmount ?? 0),
              };
    
              try {
                ExpenseSchema.parse(cleaned);
                return cleaned;
              } catch {
                return null;
              }
            })
            .filter((item): item is Expense => item !== null);
    
          setExpenses(cleanedData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onSubmit = async (values: Expense) => {
    try {
      const res = await fetch(`http://localhost:8090/expenses/${values.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(values),
      });
      if(res.status==401){
        localStorage.removeItem('token')
        navigate('/login')
      }
      else if (!res.ok) throw new Error();
      else{
          toast.success("Expense updated");
          setEditExpense(null);
          setIsEditDialogOpen(false);
          fetchExpenses();
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`http://localhost:8090/expenses/${deleteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if(res.status==401){
        localStorage.removeItem('token')
        navigate('/login')
      }
      else if (!res.ok) throw new Error();
      else{
          toast.success("Expense deleted");
          setDeleteId(null);
          fetchExpenses();
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Expense History</h2>
      <div className="overflow-auto">
        <Table className="min-w-full text-sm border-collapse table-fixed">
          <Thead className="bg-gray-100">
            <Tr>
              <Th className="px-2 py-2">Date</Th>
              <Th className="px-2 py-2">Store</Th>
              <Th className="px-2 py-2">Item</Th>
              <Th className="px-2 py-2">Qty</Th>
              <Th className="px-2 py-2">Category</Th>
              <Th className="px-2 py-2">Total</Th>
              <Th className="px-2 py-2 text-center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="text-center py-4">
                  No expenses found.
                </Td>
              </Tr>
            ) : (
              expenses.map((expense) => (
                <Tr key={expense.id}>
                  <Td className="px-2 py-2">{expense.bill_date}</Td>
                  <Td className="px-2 py-2">{expense.store_name}</Td>
                  <Td className="px-2 py-2">{expense.item_name}</Td>
                  <Td className="px-2 py-2">{expense.quantity}</Td>
                  <Td className="px-2 py-2">{expense.category}</Td>
                  <Td className="px-2 py-2">
                    ₹{expense.total_amount.toFixed(2)}
                  </Td>
                  <Td className="px-2 py-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditExpense(expense);
                            reset(expense);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(expense.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editExpense && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 py-2"
            >
              <Input type="hidden" {...register("id")} />
              <div className="space-y-1">
                <label className="text-sm font-medium">Bill Date</label>
                <Input disabled {...register("bill_date")} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Store Name</label>
                <Input {...register("store_name")} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Item Name</label>
                <Input {...register("item_name")} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <Input {...register("category")} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Total Amount</label>
                <Input
                  {...register("total_amount", { valueAsNumber: true })}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this expense?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete Expense
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScrollDownButton
        onClick={() =>
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
        }
      />
    </Card>
  );
};
