// src/components/ScrollDownButton.tsx

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollDownButtonProps {
  onClick?: () => void;
  className?: string;
}

export function ScrollDownButton({ onClick, className }: ScrollDownButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`fixed bottom-6 right-6 bg-transparent hover:bg-gray-100 p-2 rounded-full shadow-md transition-all ${className || ""}`}
      aria-label="Scroll Down"
    >
      <ChevronDown className="h-6 w-6 text-muted-foreground" />
    </Button>
  );
}
