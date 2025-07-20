import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Volume2,
  DollarSign,
  Save,
  RotateCcw
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    // Profile Settings
    name: "John Doe",
    email: "john.doe@email.com",
    currency: "USD",
    monthlyIncome: "3500",
    
    // Accessibility Settings
    fontSize: [18], // Array for Slider component
    highContrast: false,
    voiceSpeed: [1.0],
    
    // Notification Settings
    budgetAlerts: true,
    monthlyReminders: true,
    savingsTips: true,
    soundEnabled: true,
    
    // Privacy Settings
    dataSharing: false,
    backupEnabled: true,
    biometricAuth: false,
    
    // App Preferences
    language: "en",
    darkMode: false,
    autoSave: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Here you would save to your backend
    console.log("Saving settings:", settings);
    setHasChanges(false);
    // Show success toast
  };

  const resetSettings = () => {
    // Reset to defaults
    setSettings({
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
    });
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      
      {/* Settings panel */}
      <Card className="fixed right-0 top-0 h-full w-full max-w-2xl lg:relative lg:h-auto lg:max-h-[700px] overflow-hidden bg-card border-border shadow-card">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Settings className="h-7 w-7 text-primary" />
              <h2 className="text-senior-xl font-bold text-foreground">Settings</h2>
            </div>
            <div className="flex gap-2">
              {hasChanges && (
                <Button onClick={saveSettings} size="sm" className="text-senior-sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
              <Button variant="outline" onClick={onClose} size="sm">
                Close
              </Button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Profile Settings */}
            <div className="space-y-4">
              <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Profile Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-senior-base">Full Name</Label>
                  <Input
                    value={settings.name}
                    onChange={(e) => updateSetting("name", e.target.value)}
                    className="text-senior-base h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-senior-base">Email</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                    className="text-senior-base h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-senior-base">Currency</Label>
                  <Input
                    value={settings.currency}
                    onChange={(e) => updateSetting("currency", e.target.value)}
                    className="text-senior-base h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-senior-base">Monthly Income</Label>
                  <Input
                    type="number"
                    value={settings.monthlyIncome}
                    onChange={(e) => updateSetting("monthlyIncome", e.target.value)}
                    className="text-senior-base h-12"
                  />
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="space-y-4">
              <LanguageSelector 
                variant="grid"
                currentLanguage={settings.language}
                onLanguageChange={(lang) => updateSetting("language", lang)}
              />
            </div>

            {/* Accessibility Settings */}
            <div className="space-y-4">
              <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2">
                <Palette className="h-6 w-6 text-primary" />
                Accessibility
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-senior-base">Font Size: {settings.fontSize[0]}px</Label>
                  <Slider
                    value={settings.fontSize}
                    onValueChange={(value) => updateSetting("fontSize", value)}
                    max={24}
                    min={14}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-senior-base">Voice Speed: {settings.voiceSpeed[0]}x</Label>
                  <Slider
                    value={settings.voiceSpeed}
                    onValueChange={(value) => updateSetting("voiceSpeed", value)}
                    max={2.0}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-senior-base">High Contrast Mode</Label>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                Notifications
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-senior-base">Budget Alerts</Label>
                    <p className="text-senior-sm text-muted-foreground">Get notified when you exceed budget limits</p>
                  </div>
                  <Switch
                    checked={settings.budgetAlerts}
                    onCheckedChange={(checked) => updateSetting("budgetAlerts", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-senior-base">Monthly Reminders</Label>
                    <p className="text-senior-sm text-muted-foreground">Reminders to review your budget</p>
                  </div>
                  <Switch
                    checked={settings.monthlyReminders}
                    onCheckedChange={(checked) => updateSetting("monthlyReminders", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-senior-base">Savings Tips</Label>
                    <p className="text-senior-sm text-muted-foreground">Helpful tips to save money</p>
                  </div>
                  <Switch
                    checked={settings.savingsTips}
                    onCheckedChange={(checked) => updateSetting("savingsTips", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-senior-base">Sound Notifications</Label>
                    <p className="text-senior-sm text-muted-foreground">Play sounds for notifications</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="space-y-4">
              <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Privacy & Security
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-senior-base">Data Backup</Label>
                    <p className="text-senior-sm text-muted-foreground">Automatically backup your data</p>
                  </div>
                  <Switch
                    checked={settings.backupEnabled}
                    onCheckedChange={(checked) => updateSetting("backupEnabled", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-senior-base">Biometric Authentication</Label>
                    <p className="text-senior-sm text-muted-foreground">Use fingerprint or face recognition</p>
                  </div>
                  <Switch
                    checked={settings.biometricAuth}
                    onCheckedChange={(checked) => updateSetting("biometricAuth", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-senior-base">Auto-Save</Label>
                    <p className="text-senior-sm text-muted-foreground">Automatically save your entries</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={saveSettings}
                disabled={!hasChanges}
                className="text-senior-base bg-gradient-primary"
              >
                <Save className="h-5 w-5 mr-2" />
                Save All Changes
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetSettings}
                className="text-senior-base"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}