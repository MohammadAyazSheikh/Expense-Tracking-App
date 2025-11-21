import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Plus, Sparkles, Wallet, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const categoryData = [
  { name: "Food", value: 420, color: "hsl(10 80% 65%)" },
  { name: "Transport", value: 230, color: "hsl(255 70% 65%)" },
  { name: "Shopping", value: 350, color: "hsl(35 90% 60%)" },
  { name: "Bills", value: 280, color: "hsl(160 70% 60%)" },
  { name: "Entertainment", value: 150, color: "hsl(230 75% 70%)" },
];

const recentTransactions = [
  { id: 1, name: "Starbucks Coffee", category: "Food", amount: -4.50, date: "Today, 10:30 AM", type: "expense" },
  { id: 2, name: "Salary Deposit", category: "Income", amount: 3500, date: "Today, 09:00 AM", type: "income" },
  { id: 3, name: "Uber Ride", category: "Transport", amount: -12.30, date: "Yesterday", type: "expense" },
  { id: 4, name: "Netflix Subscription", category: "Bills", amount: -15.99, date: "Yesterday", type: "expense" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm text-muted-foreground">{t('dashboard.welcome')}</h2>
          <h1 className="text-2xl font-bold">Alex Johnson</h1>
        </div>
        <Button size="icon" variant="outline" className="rounded-full">
          <Sparkles className="h-5 w-5 text-primary" />
        </Button>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-primary text-white p-6 mb-6 shadow-lg border-0">
        <div className="mb-2 text-sm opacity-90">{t('dashboard.totalBalance')}</div>
        <div className="text-4xl font-bold mb-6">$8,432.50</div>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm opacity-90">{t('dashboard.income')}</span>
            </div>
            <div className="font-semibold">$5,240</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm opacity-90">{t('dashboard.expenses')}</span>
            </div>
            <div className="font-semibold">$1,430</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/analytics")}>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-xs">{t('dashboard.analytics')}</span>
          </div>
        </Card>
        <Card className="p-4 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/wallets")}>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-success" />
            </div>
            <span className="font-medium text-xs">{t('dashboard.wallets')}</span>
          </div>
        </Card>
        <Card className="p-4 shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/budget")}>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-warning" />
            </div>
            <span className="font-medium text-xs">{t('dashboard.budget')}</span>
          </div>
        </Card>
      </div>

      {/* Spending Overview */}
      <Card className="p-6 mb-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Spending Overview</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            See All
          </Button>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-2">
            {categoryData.slice(0, 3).map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm font-medium">${category.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Insights Card */}
      <Card className="bg-gradient-card p-5 mb-6 shadow-card border-primary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">SmartSense™ Insight</h4>
            <p className="text-sm text-muted-foreground">
              You're spending 23% more on food this week. Consider meal prepping to save $50/week.
            </p>
            <Button variant="link" className="px-0 mt-2 h-auto text-primary">
              View Full Analysis →
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            See All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{transaction.name}</div>
                  <div className="text-sm text-muted-foreground">{transaction.date}</div>
                </div>
                <div className={`font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-foreground'}`}>
                  {transaction.type === 'income' ? '+' : ''}{transaction.amount.toFixed(2)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button 
        size="lg" 
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-primary border-0 hover:scale-110 transition-transform"
        onClick={() => navigate("/add-expense")}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
