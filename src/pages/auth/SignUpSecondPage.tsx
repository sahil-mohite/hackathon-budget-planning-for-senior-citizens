import { useSignup } from "@/context/SignupContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";

const SignUpSecondPage = () => {
  const { formData, setFormData } = useSignup();
  const navigate = useNavigate();

  const [showStockFields, setShowStockFields] = useState(formData.financialDetails?.investsInStocks || false);
  const [getsPension, setGetsPension] = useState(formData.financialDetails?.getsPension || false);

  const [errors, setErrors] = useState<{ phone?: string; income?: string; address?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const financialKeys = [
      "income",
      "getsPension",
      "pensionAmount",
      "investsInStocks",
      "yearlyStockInvestment",
      "stockPlatforms",
      "additionalDetails",
    ];

    if (financialKeys.includes(name)) {
      setFormData({
        ...formData,
        financialDetails: {
          ...formData.financialDetails,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({ ...errors, [name]: undefined });
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!/^\d{10}$/.test(formData.phone || "")) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    const income = Number(formData.financialDetails?.income);
    if (isNaN(income) || income <= 0) {
      newErrors.income = "Income must be a valid positive number.";
    }

    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      console.log(formData);
      const response = await fetch("http://localhost:8050/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(result.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };

  const handleBack = () => navigate("/signup-step-one");

  return (
    <main className="min-h-screen flex justify-center items-start py-16 bg-gradient-to-b from-[#eef6ff] to-white px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 items-start gap-12">
        {/* Branding Side */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-4">
          <div className="h-28 w-28 sm:h-32 sm:w-32 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <DollarSign className="h-10 w-10 sm:h-14 sm:w-14 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-senior-xl font-bold text-foreground text-center">BudgetWise Senior</h2>
          <p className="text-muted-foreground text-center text-sm max-w-sm">
            Tell us a bit more to personalize your experience.
          </p>
        </div>

        {/* Form Side */}
        <Card className="w-full p-8 shadow-xl h-fit space-y-6 relative">
          <div className="absolute left-6 top-6">
            <Button variant="outline" size="sm" onClick={handleBack}>Back</Button>
          </div>

          <h2 className="text-2xl font-semibold text-center text-foreground pt-4">
            Complete your profile
          </h2>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <Input disabled value={formData.firstName} />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <Input disabled value={formData.lastName} />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone <span className="text-red-500">*</span></label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                required
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Income */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Yearly Income <span className="text-red-500">*</span></label>
              <Input
                name="income"
                value={formData.financialDetails?.income}
                onChange={handleChange}
                placeholder="Enter yearly income"
                required
              />
              {errors.income && <p className="text-xs text-red-500 mt-1">{errors.income}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address <span className="text-red-500">*</span></label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, City"
                required
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* Pension Toggle */}
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Do you get pension? <span className="text-red-500">*</span></span>
                <Switch
                  checked={getsPension}
                  onCheckedChange={(checked) => {
                    setGetsPension(checked);
                    setFormData({
                      ...formData,
                      financialDetails: {
                        ...formData.financialDetails,
                        getsPension: checked,
                        pensionAmount: checked ? formData.financialDetails.pensionAmount : "",
                      },
                    });
                  }}
                />
              </label>
              {getsPension && (
                <Input
                  name="pensionAmount"
                  placeholder="How much pension yearly?"
                  value={formData.financialDetails?.pensionAmount}
                  onChange={handleChange}
                />
              )}
            </div>

            {/* Stocks Toggle */}
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Do you invest in stocks? <span className="text-red-500">*</span></span>
                <Switch
                  checked={showStockFields}
                  onCheckedChange={(checked) => {
                    setShowStockFields(checked);
                    setFormData({
                      ...formData,
                      financialDetails: {
                        ...formData.financialDetails,
                        investsInStocks: checked,
                        yearlyStockInvestment: checked ? formData.financialDetails.yearlyStockInvestment : "",
                      },
                    });
                  }}
                />
              </label>
              {showStockFields && (
                <Input
                  name="yearlyStockInvestment"
                  placeholder="Yearly stock investment"
                  value={formData.financialDetails?.yearlyStockInvestment}
                  onChange={handleChange}
                />
              )}
            </div>

            {/* Additional Details */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Additional Details (Optional)</label>
              <Input
                type="text"
                name="additionalDetails"
                value={formData.financialDetails?.additionalDetails}
                onChange={handleChange}
                placeholder="Any other info you'd like to share"
              />
            </div>

            {/* Financial Goals */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Financial Goals <span className="text-red-500">*</span></label>
              <Input
                type="text"
                name="financialGoals"
                value={formData.financialGoals}
                onChange={handleChange}
                placeholder="Please set your Financial goal"
                required
              />
            </div>

            <Button onClick={handleSubmit} className="w-full mt-4">Complete Signup</Button>
          </div>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">Login</a>
          </p>
        </Card>
      </div>
    </main>
  );
};

export default SignUpSecondPage;