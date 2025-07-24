import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

type FinancialDetails = {
  income: string;
  getsPension: boolean;
  pensionAmount: string;
  investsInStocks: boolean;
  yearlyStockInvestment: string;
  additionalDetails: string;
};

interface UserData {
  firstName: string;
  lastName: string;
  email: string; // ✅ required for Header
  address: string;
  phone: string;
  financialDetails: FinancialDetails;
}

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
}

export function ProfilePanel({ isOpen, onClose, userData }: ProfilePanelProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.trim() === "" ? "NA" : value;
    if (name in user.financialDetails) {
      setUser((prev) => ({
        ...prev,
        financialDetails: { ...prev.financialDetails, [name]: sanitizedValue },
      }));
    } else {
      setUser((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  const handleSubmit = async () => {
    const phoneRegex = /^\d{10}$/;
    const incomeRegex = /^\d+$/;

    if (!phoneRegex.test(user.phone)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    if (!incomeRegex.test(user.financialDetails.income)) {
      alert("Annual income must be a valid number.");
      return;
    }

    const updatedUser = {
      ...user,
      financialDetails: {
        ...user.financialDetails,
        additionalDetails: user.financialDetails.additionalDetails || "NA",
        income: user.financialDetails.income || "NA",
        pensionAmount: user.financialDetails.pensionAmount || "NA",
        yearlyStockInvestment: user.financialDetails.yearlyStockInvestment || "NA",
      },
      phone: user.phone || "NA",
      address: user.address || "NA",
    };

    try {
      const response = await fetch("http://localhost:8050/updateUserData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("There was an error updating your profile.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <Card className="relative h-full w-full max-w-xl bg-white border shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <Label>Email *</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Phone *</Label>
            <Input
              name="phone"
              value={user.phone}
              onChange={handleUpdate}
              placeholder="NA"
              required
              maxLength={10}
              pattern="\\d{10}"
              title="Phone number must be 10 digits"
            />
          </div>
          <div>
            <Label>Address *</Label>
            <Input
              name="address"
              value={user.address}
              onChange={handleUpdate}
              placeholder="NA"
              required
            />
          </div>
          <div>
            <Label>Annual Income *</Label>
            <Input
              name="income"
              value={user.financialDetails.income}
              onChange={handleUpdate}
              placeholder="NA"
              required
              pattern="\\d+"
              title="Please enter a valid income amount"
            />
          </div>
          <div>
            <Label>Pension Amount</Label>
            <Input
              name="pensionAmount"
              value={user.financialDetails.pensionAmount}
              onChange={handleUpdate}
              placeholder="NA"
            />
          </div>
          <div>
            <Label>Yearly Stock Investment</Label>
            <Input
              name="yearlyStockInvestment"
              value={user.financialDetails.yearlyStockInvestment}
              onChange={handleUpdate}
              placeholder="NA"
            />
          </div>
          <div>
            <Label>Additional Details</Label>
            <Input
              name="additionalDetails"
              value={user.financialDetails.additionalDetails}
              onChange={handleUpdate}
              placeholder="NA"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button onClick={handleSubmit}>Update</Button>
        </div>
      </Card>
    </div>
  );
}