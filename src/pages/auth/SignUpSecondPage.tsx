import { useSignup } from "@/context/SignupContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";

const SignUpSecondPage = () => {
    const { formData, setFormData } = useSignup();
    const navigate = useNavigate();

    const [showStockFields, setShowStockFields] = useState(formData.investsInStocks || false);
    const [getsPension, setGetsPension] = useState(formData.getsPension || false);

    const [errors, setErrors] = useState<{ phone?: string; income?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const validate = () => {
        const newErrors: { phone?: string; income?: string } = {};

        if (!/^\d{10}$/.test(formData.phone || "")) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        }

        const income = Number(formData.income);
        if (isNaN(income) || income <= 0) {
            newErrors.income = "Income must be a valid positive number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!formData.phone || !formData.income || !formData.address) {
            alert("Please complete all required fields");
            return;
        }

        if (!validate()) return;

        console.log("Final Signup Data:", formData);
        navigate("/login");
    };

    const handleBack = () => {
        navigate("/signup-step-one");
    };

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
                    <h2 className="text-senior-xl font-bold text-foreground text-center">
                        BudgetWise Senior
                    </h2>
                    <p className="text-muted-foreground text-center text-sm max-w-sm">
                        Tell us a bit more to personalize your experience.
                    </p>
                </div>

                {/* Signup Form */}
                <Card className="w-full p-8 shadow-xl h-fit space-y-6 relative">
                    <div className="absolute left-6 top-6">
                        <Button variant="outline" size="sm" onClick={handleBack}>
                            Back
                        </Button>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">
                                First Name
                            </label>
                            <Input value={formData.firstName} disabled />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">
                                Last Name
                            </label>
                            <Input value={formData.lastName} disabled />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="Enter 10-digit phone number"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">
                                Yearly Income <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="income"
                                value={formData.income}
                                onChange={handleChange}
                                required
                                placeholder="Enter your annual income"
                            />
                            {errors.income && (
                                <p className="text-red-500 text-xs mt-1">{errors.income}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Pension Section */}
                        <div className="space-y-2">
                            <p className="font-medium text-muted-foreground">
                                Do you get pension? <span className="text-red-500">*</span>
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    variant={getsPension ? "default" : "outline"}
                                    onClick={() => {
                                        setGetsPension(true);
                                        setFormData({ ...formData, getsPension: true });
                                    }}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant={!getsPension ? "default" : "outline"}
                                    onClick={() => {
                                        setGetsPension(false);
                                        setFormData({ ...formData, getsPension: false, pensionAmount: "" });
                                    }}
                                >
                                    No
                                </Button>
                            </div>
                            {getsPension && (
                                <Input
                                    name="pensionAmount"
                                    placeholder="How much pension do you get yearly?"
                                    value={formData.pensionAmount}
                                    onChange={handleChange}
                                />
                            )}
                        </div>

                        {/* Stocks Section */}
                        <div className="space-y-2">
                            <p className="font-medium text-muted-foreground">
                                Do you invest in stocks? <span className="text-red-500">*</span>
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    variant={showStockFields ? "default" : "outline"}
                                    onClick={() => {
                                        setShowStockFields(true);
                                        setFormData({ ...formData, investsInStocks: true });
                                    }}
                                >
                                    Yes
                                </Button>
                                <Button
                                    variant={!showStockFields ? "default" : "outline"}
                                    onClick={() => {
                                        setShowStockFields(false);
                                        setFormData({
                                            ...formData,
                                            investsInStocks: false,
                                            yearlyStockInvestment: "",
                                            stockPlatforms: "",
                                        });
                                    }}
                                >
                                    No
                                </Button>
                            </div>

                            {showStockFields && (
                                <div className="space-y-4">
                                    <Input
                                        name="yearlyStockInvestment"
                                        placeholder="How much do you invest yearly?"
                                        value={formData.yearlyStockInvestment}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="stockPlatforms"
                                        placeholder="Which platforms do you use?"
                                        value={formData.stockPlatforms}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>

                        <Button onClick={handleSubmit} className="w-full mt-2">
                            Complete Signup
                        </Button>
                    </div>

                    <p className="text-sm text-center text-muted-foreground mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="text-primary hover:underline font-medium">
                            Login
                        </a>
                    </p>
                </Card>
            </div>
        </main>
    );
};

export default SignUpSecondPage;
