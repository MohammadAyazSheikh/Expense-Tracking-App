import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, DollarSign, TrendingUp, Target, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notificationCategories = [
  {
    title: "Transaction Alerts",
    icon: DollarSign,
    color: "text-success",
    items: [
      { label: "Large expense alerts", description: "Notify when expense exceeds $100", enabled: true },
      { label: "Daily summary", description: "Daily spending recap at 9 PM", enabled: true },
      { label: "Weekly reports", description: "Weekly financial overview", enabled: false },
    ]
  },
  {
    title: "Budget & Goals",
    icon: Target,
    color: "text-warning",
    items: [
      { label: "Budget warnings", description: "Alert at 80% of budget limit", enabled: true },
      { label: "Budget exceeded", description: "Notify when over budget", enabled: true },
      { label: "Savings milestones", description: "Celebrate savings achievements", enabled: true },
    ]
  },
  {
    title: "AI Insights",
    icon: Sparkles,
    color: "text-primary",
    items: [
      { label: "SmartSense™ tips", description: "Personalized saving suggestions", enabled: true },
      { label: "Spending patterns", description: "Unusual activity detection", enabled: true },
      { label: "Monthly insights", description: "End of month AI analysis", enabled: false },
    ]
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    color: "text-accent",
    items: [
      { label: "Income received", description: "Notify on new income", enabled: true },
      { label: "Bill reminders", description: "Upcoming bill notifications", enabled: true },
    ]
  }
];

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          <Badge className="bg-white/20 border-0">3 New</Badge>
        </div>

        {/* Master Toggle */}
        <Card className="bg-white/20 border-0 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6" />
              <div>
                <p className="font-semibold">Push Notifications</p>
                <p className="text-sm opacity-90">Receive all app notifications</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>
      </div>

      <div className="px-4 -mt-4">
        {/* Notification Categories */}
        <div className="space-y-4">
          {notificationCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="p-5 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <h2 className="text-lg font-semibold">{category.title}</h2>
                </div>
                <div className="space-y-4">
                  {category.items.map((item, index) => (
                    <div key={index}>
                      {index > 0 && <div className="h-px bg-border mb-4"></div>}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch defaultChecked={item.enabled} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Email Preferences */}
        <Card className="p-5 mt-4 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Monthly Reports</p>
                <p className="text-sm text-muted-foreground">Detailed financial summary</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Product Updates</p>
                <p className="text-sm text-muted-foreground">New features and improvements</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
