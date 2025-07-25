import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: any) => {
    setServerError("");
    try {
      const res = await fetch("http://localhost:8050/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.access_token);
        navigate("/");
      } else {
        setServerError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setServerError("Something went wrong. Please try later.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-[#eef6ff] to-white px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 items-center gap-8">

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
            Track your budget, pension, and expenses with confidence and ease.
          </p>
        </div>

        {/* Login Form */}
        <Card className="w-full p-8 shadow-xl space-y-6">
          <div className="text-center">
            <h3 className="text-senior-lg font-semibold text-foreground">Welcome Back</h3>
            <p className="text-sm text-muted-foreground">Login to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="you@example.com"
                className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
              )}
            </div>

            {/* Password with eye toggle */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Enter your password"
                  className="w-full border border-border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
              )}
            </div>

            {/* Server error */}
            {serverError && <p className="text-red-600 text-sm mt-2 text-center">{serverError}</p>}

            <Button type="submit" className="w-full mt-2">
              Login
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Not registered?{" "}
            <Link to="/signup-step-one" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
