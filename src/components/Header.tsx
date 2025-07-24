import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Bell, DollarSign, Menu } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationCenter } from "./NotificationCenter";
import { SettingsPanel } from "./SettingsPanel";
import { ProfilePanel } from "./ProfilePanel";

type FinancialDetails = {
  income: string;
  getsPension: boolean;
  pensionAmount: string;
  investsInStocks: boolean;
  yearlyStockInvestment: string;
  additionalDetails: string;
};

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  financialDetails: FinancialDetails;
}

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  userData: UserData;
}

export function Header({ onMenuToggle, showMenuButton = false, userData }: HeaderProps) {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const unreadNotifications = 2; // Replace with real notification count

  return (
    <>
      <header className="bg-card border-b border-border shadow-gentle sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-2.5">
          <div className="flex items-center justify-between">
            {/* Left: Menu & Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              {showMenuButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMenuToggle}
                  className="lg:hidden p-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 sm:h-11 sm:w-11 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>

                {/* Desktop title */}
                <div className="hidden sm:block leading-tight">
                  <h1 className="text-base sm:text-lg font-bold text-foreground">
                    {t("header.app_title")}
                  </h1>
                  <p className="text-sm text-muted-foreground hidden md:block">
                    {t("header.app_title_full")}
                  </p>
                </div>

                {/* Mobile title */}
                <div className="sm:hidden">
                  <h1 className="text-sm font-bold text-foreground">
                    {t("header.app_title")}
                  </h1>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <div onClick={() => setShowLanguageSelector(!showLanguageSelector)}>
                <LanguageSelector />
              </div>

              <Button
                variant="outline"
                size="lg"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowSettings(!showSettings)}
              >
                <UserCircle className="h-6 w-6" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="relative p-2"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2"
              >
                <UserCircle className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Panels */}
      <div className="relative">
        {showNotifications && (
          <div className="fixed top-16 right-4 z-50 lg:absolute lg:top-0 lg:right-0">
            <NotificationCenter
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 z-50 lg:absolute lg:top-0 lg:right-0">
            <ProfilePanel
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              userData={userData}
            />
          </div>
        )}
      </div>
    </>
  );
}
