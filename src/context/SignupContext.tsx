import { createContext, useContext, useState, ReactNode } from "react";

type FinancialDetails = {
  income: string;
  getsPension: boolean;
  pensionAmount: string;
  investsInStocks: boolean;
  yearlyStockInvestment: string;
  additionalDetails: string;
};

type SignupFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  financialDetails: FinancialDetails;
};

type SignupContextType = {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

const initialState: SignupFormData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  address: "",
  phone: "",
  financialDetails: {
    income: "",
    getsPension: false,
    pensionAmount: "",
    investsInStocks: false,
    yearlyStockInvestment: "",
    additionalDetails: "",
  },
};

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<SignupFormData>(initialState);
  return (
    <SignupContext.Provider value={{ formData, setFormData }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup must be used within SignupProvider");
  return ctx;
};
