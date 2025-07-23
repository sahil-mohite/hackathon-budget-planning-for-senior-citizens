import { createContext, useContext, useState } from "react";

export const SignupContext = createContext<any>(null);

export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    income: "",
    address: "",
    investsInStocks: false,
    yearlyStockInvestment: "",
    stockPlatforms: "",
  });

  return (
    <SignupContext.Provider value={{ formData, setFormData }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => useContext(SignupContext);
