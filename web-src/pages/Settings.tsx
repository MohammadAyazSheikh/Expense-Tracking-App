import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import { 
  User, 
  Bell, 
  Lock, 
  Wallet, 
  FileText, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Sparkles,
  Languages
} from "lucide-react";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile Settings", badge: null, path: "/profile" },
      { icon: Bell, label: "Notifications", badge: "3 New", path: "/notifications" },
      { icon: Lock, label: "Security", badge: null, path: "/security" },
    ]
  },
  {
    title: "Preferences",
    items: [
      { icon: Wallet, label: "Manage Accounts", badge: null, path: "/wallets" },
      { icon: FileText, label: "Export Data", badge: null, path: "/profile" },
    ]
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & Support", badge: null, path: "/help-support" },
      { icon: Sparkles, label: "SmartSense™ Settings", badge: "AI", path: "/smart-sense" },
    ]
  }
];

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ur' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 pb-12">
        <h1 className="text-2xl font-bold mb-6">{t('settings.title')}</h1>
        
        {/* Profile Card */}
        <Card className="bg-white/20 border-0 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-2xl font-bold">
              AJ
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Alex Johnson</h3>
              <p className="text-sm opacity-90">alex.johnson@email.com</p>
            </div>
            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
              Edit
            </Button>
          </div>
        </Card>
      </div>

      <div className="px-4 -mt-6">
        {/* Quick Toggles */}
        <Card className="p-5 mb-6 shadow-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t('settings.darkMode')}</div>
                <div className="text-sm text-muted-foreground">{t('settings.darkModeDesc')}</div>
              </div>
              <Switch 
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{t('settings.language')}</div>
                  <div className="text-sm text-muted-foreground">{t('settings.languageDesc')}</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleLanguage}
              >
                {i18n.language === 'en' ? 'اردو' : 'English'}
              </Button>
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t('settings.aiInsights')}</div>
                <div className="text-sm text-muted-foreground">{t('settings.aiInsightsDesc')}</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t('settings.pushNotifications')}</div>
                <div className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc')}</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                {t(`settings.${group.title.toLowerCase()}`)}
              </h3>
              <Card className="p-3 shadow-card">
                <div className="divide-y divide-border">
                  {group.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => item.path && navigate(item.path)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <Card className="p-4 mt-6 shadow-card">
          <button 
            onClick={() => navigate("/auth")}
            className="w-full flex items-center justify-center gap-2 text-destructive font-medium"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </Card>

        {/* App Version */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Settings;
