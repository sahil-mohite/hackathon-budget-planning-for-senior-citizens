
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    firstName: "Shri",
    lastName: "Alex",
    address:
      "Parijat, Dnyanesh Park, Road No. 2, Plot No. 6, Near Krishna Chowk, New Sanghvi, Pimple Gurav, Pune, Maharashtra - 411061",
    phone: "7387133118",
    income: "1000000",
    getsPension: true,
    pensionAmount: "",
    investsInStocks: true,
    yearlyStockInvestment: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    console.log("Saving settings:", settings);
    setHasChanges(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  // Close panel on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex justify-end">
      <Card
        ref={panelRef}
        className="w-full max-w-2xl h-full z-50 bg-white dark:bg-zinc-900 shadow-lg border border-border flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={settings.firstName}
                onChange={(e) => updateSetting("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={settings.lastName}
                onChange={(e) => updateSetting("lastName", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input
                value={settings.address}
                onChange={(e) => updateSetting("address", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Phone</Label>
              <Input
                value={settings.phone}
                onChange={(e) => updateSetting("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Financial Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label>Income</Label>
              <Input
                value={settings.income}
                onChange={(e) => updateSetting("income", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mt-6">
              <Label>Gets Pension</Label>
              <Switch
                checked={settings.getsPension}
                onCheckedChange={(val) => updateSetting("getsPension", val)}
              />
            </div>
            {settings.getsPension && (
              <div className="space-y-2 sm:col-span-2">
                <Label>Pension Amount</Label>
                <Input
                  value={settings.pensionAmount}
                  onChange={(e) => updateSetting("pensionAmount", e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <Label>Invests in Stocks</Label>
              <Switch
                checked={settings.investsInStocks}
                onCheckedChange={(val) => updateSetting("investsInStocks", val)}
              />
            </div>
            {settings.investsInStocks && (
              <div className="space-y-2 sm:col-span-2">
                <Label>Yearly Stock Investment</Label>
                <Input
                  value={settings.yearlyStockInvestment}
                  onChange={(e) =>
                    updateSetting("yearlyStockInvestment", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end items-center gap-2">
          <Button onClick={saveSettings} disabled={!hasChanges}>
            Update
          </Button>
        </div>
      </Card>
    </div>
  );
}
