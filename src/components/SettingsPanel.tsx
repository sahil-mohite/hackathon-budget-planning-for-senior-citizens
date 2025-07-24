import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  RotateCcw,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    currency: "USD",
    monthlyIncome: "3500",
    fontSize: [18],
    highContrast: false,
    voiceSpeed: [1.0],
    budgetAlerts: true,
    monthlyReminders: true,
    savingsTips: true,
    soundEnabled: true,
    dataSharing: false,
    backupEnabled: true,
    biometricAuth: false,
    language: "en",
    darkMode: false,
    autoSave: true,
    mobileNumber: "xxxxxxxxxx"
  });

  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    console.log("Saving settings:", settings);
    setHasChanges(false);
  };

  // const resetSettings = () => {
  //   setSettings({
  //     name: "John Doe",
  //     email: "john.doe@email.com",
  //     currency: "USD",
  //     monthlyIncome: "3500",
  //     fontSize: [18],
  //     highContrast: false,
  //     voiceSpeed: [1.0],
  //     budgetAlerts: true,
  //     monthlyReminders: true,
  //     savingsTips: true,
  //     soundEnabled: true,
  //     dataSharing: false,
  //     backupEnabled: true,
  //     biometricAuth: false,
  //     language: "en",
  //     darkMode: false,
  //     autoSave: true,
  //   });
  //   setHasChanges(false);
  // };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  // Handle click outside
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
        className="w-full max-w-md h-full z-50 bg-white dark:bg-zinc-900 shadow-lg border border-border flex flex-col"
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={settings.name}
              onChange={(e) => updateSetting("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={settings.email}
              onChange={(e) => updateSetting("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Monthly Income</Label>
            <Input
              value={settings.monthlyIncome}
              onChange={(e) => updateSetting("monthlyIncome", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input
              value={settings.mobileNumber}
              onChange={(e) => updateSetting("mobileNumber", e.target.value)}
            />
          </div>
          {/* <div className="space-y-2">
            <Label>Font Size</Label>
            <Slider
              min={12}
              max={24}
              step={1}
              value={settings.fontSize}
              onValueChange={(val) => updateSetting("fontSize", val)}
            />
          </div>

          <div className="space-y-2">
            <Label>Voice Speed</Label>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={settings.voiceSpeed}
              onValueChange={(val) => updateSetting("voiceSpeed", val)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable Dark Mode</Label>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(val) => updateSetting("darkMode", val)}
            />
          </div> */}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-between items-center">
          {/* <Button
            variant="outline"
            onClick={resetSettings}
            disabled={!hasChanges}
          >
           
            Update
          </Button> */}
          <Button onClick={saveSettings} disabled={!hasChanges}>
           
            Update
          </Button>
        </div>
      </Card>
    </div>
  );
}
