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
    DialogTrigger,
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
import { toast } from "sonner";

// Schema
const ExpenseSchema = z.object({
    id: z.string(),
    bill_date: z.string(),
    store_name: z.string().min(1),
    item_name: z.string().min(1),
    quantity: z.number().min(1),
    category: z.string().min(1),
    total_amount: z.number().min(0),
});

type Expense = z.infer<typeof ExpenseSchema>;

export const History = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [editExpense, setEditExpense] = useState<Expense | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Expense>({
        resolver: zodResolver(ExpenseSchema),
    });

    // Fetch expenses from backend
    const fetchExpenses = async () => {
        try {
            //   const res = await fetch("http://localhost:8000/expenses");
            //   const data = await res.json();
            const data = [{
                "id": "68820924e7071958281175f3",
                "user_id": "abc@gmail.com",
                "store_name": "Krishna Services",
                "bill_date": "2023-04-01",
                "total_amount": 7000,
                "input_type": "image",
                "created_at": "2025-07-24T10:21:24.012Z",
                "item_name": "W/m Rent",
                "quantity": 400,
                "unit_price": 12,
                "category": "Other"
            }];
            setExpenses(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch expenses");
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Update expense
    const onSubmit = async (values: Expense) => {
        try {
            // const res = await fetch(`http://localhost:8000/expenses/${values.id}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(values),
            // });
            // if (!res.ok) throw new Error();
            // toast.success("Expense updated");
            setEditExpense(null);
            fetchExpenses();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    // Delete expense
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            // const res = await fetch(`http://localhost:8000/expenses/${deleteId}`, {
            //     method: "DELETE",
            // });
            // if (!res.ok) throw new Error();
            // toast.success("Expense deleted");
            setDeleteId(null);
            fetchExpenses();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Expense History</h2>
            <div className="overflow-auto">
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Bill Date</Th>
                            <Th>Store</Th>
                            <Th>Item</Th>
                            <Th>Qty</Th>
                            <Th>Category</Th>
                            <Th>Total</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {expenses.map((expense) => (
                            <Tr key={expense.id}>
                                <Td>{expense.bill_date}</Td>
                                <Td>{expense.store_name}</Td>
                                <Td>{expense.item_name}</Td>
                                <Td>{expense.quantity}</Td>
                                <Td>{expense.category}</Td>
                                <Td>${expense.total_amount.toFixed(2)}</Td>
                                <Td className="flex gap-2">
                                    {/* Edit Dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setEditExpense(expense);
                                                    reset(expense);
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Edit Expense</DialogTitle>
                                            </DialogHeader>
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
                                                    {errors.store_name && (
                                                        <p className="text-red-500 text-sm">{errors.store_name.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium">Item Name</label>
                                                    <Input {...register("item_name")} />
                                                    {errors.item_name && (
                                                        <p className="text-red-500 text-sm">{errors.item_name.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium">Quantity</label>
                                                    <Input type="number" {...register("quantity", { valueAsNumber: true })} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium">Category</label>
                                                    <Input {...register("category")} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium">Total Amount</label>
                                                    <Input type="number" {...register("total_amount", { valueAsNumber: true })} />
                                                </div>
                                                <div className="flex justify-end">
                                                    <Button type="submit">Save</Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Delete Dialog */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setDeleteId(expense.id)}
                                            >
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you sure you want to delete this expense?
                                                </AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete}>
                                                    Delete Expense
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </div>
        </Card>
    );
};
