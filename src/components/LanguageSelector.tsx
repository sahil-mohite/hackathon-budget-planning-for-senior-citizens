import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Check } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
];

interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
  variant?: "dropdown" | "grid";
}

export function LanguageSelector({ 
  currentLanguage = "en", 
  onLanguageChange,
  variant = "dropdown" 
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageChange?.(languageCode);
  };

  const currentLang = languages.find(lang => lang.code === selectedLanguage);

  if (variant === "dropdown") {
    return (
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px] h-12 text-senior-base">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <SelectValue placeholder="Select language" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {languages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="text-senior-base cursor-pointer hover:bg-accent"
            >
              <div className="flex items-center gap-3 py-1">
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {language.nativeName}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-senior-lg font-semibold text-foreground flex items-center gap-2">
        <Globe className="h-6 w-6 text-primary" />
        Select Your Language
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={selectedLanguage === language.code ? "default" : "outline"}
            onClick={() => handleLanguageChange(language.code)}
            className={`h-16 justify-start text-left transition-all duration-200 ${
              selectedLanguage === language.code 
                ? "bg-gradient-primary text-primary-foreground shadow-gentle" 
                : "hover:bg-secondary hover:text-secondary-foreground"
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <span className="text-xl">{language.flag}</span>
              <div className="flex flex-col items-start">
                <span className="text-senior-sm font-medium">
                  {language.name}
                </span>
                <span className="text-xs opacity-75">
                  {language.nativeName}
                </span>
              </div>
              {selectedLanguage === language.code && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </div>
          </Button>
        ))}
      </div>
      
      <Card className="p-4 bg-accent">
        <p className="text-senior-sm text-accent-foreground">
          <strong>Current Language:</strong> {currentLang?.flag} {currentLang?.name} ({currentLang?.nativeName})
        </p>
      </Card>
    </div>
  );
}