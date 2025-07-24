import { useNavigate } from "react-router-dom";
import { useSignup } from "@/context/SignupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useState } from "react";

const SignUpFirstPage = () => {
  const { formData, setFormData } = useSignup();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      financialDetails: {
        ...formData.financialDetails, // preserve existing nested data
      },
    });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email || "")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleNext = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formData.firstName && formData.lastName && formData.email && formData.password) {

      const res = await fetch(`http://localhost:8000/auth/validate-email?email=${formData.email}`, {
        method: "GET"
      })

      const result = await res.json();

      if(res.ok){
        navigate("/signup-step-two");
      }
      else if(res.status==400){
        alert("Email Already exist. Please use a different email id")
      }
    } else {
      alert("Please fill all fields");
    }
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
          <h2 className="text-senior-xl font-bold text-foreground text-center">BudgetWise Senior</h2>
          <p className="text-muted-foreground text-center text-sm max-w-sm">
            Sign up to start managing your pension and expenses smartly.
          </p>
        </div>

        {/* Sign-Up Form Side */}
        <Card className="w-full p-8 shadow-xl h-fit space-y-6">
          <div className="text-center">
            <h3 className="text-senior-lg font-semibold text-foreground">Create an Account</h3>
            <p className="text-sm text-muted-foreground">Enter your details to begin</p>
          </div>

          <div className="grid gap-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>

            <Button onClick={handleNext} className="w-full mt-2">
              Next
            </Button>
          </div>

          {/* Login Redirect */}
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

export default SignUpFirstPage;