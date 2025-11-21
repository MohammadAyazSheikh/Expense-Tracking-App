import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const monthlyData = [
  { month: "Jan", expenses: 1200, income: 3500 },
  { month: "Feb", expenses: 1350, income: 3500 },
  { month: "Mar", expenses: 1180, income: 3500 },
  { month: "Apr", expenses: 1420, income: 3700 },
  { month: "May", expenses: 1290, income: 3700 },
  { month: "Jun", expenses: 1430, income: 3500 },
];

const categoryBreakdown = [
  { name: "Food", amount: 420, percentage: 29 },
  { name: "Transport", amount: 230, percentage: 16 },
  { name: "Shopping", amount: 350, percentage: 24 },
  { name: "Bills", amount: 280, percentage: 20 },
  { name: "Entertainment", amount: 150, percentage: 11 },
];

const Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>
          <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
            <Calendar className="h-4 w-4 mr-2" />
            June 2024
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 shadow-card">
            <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-accent">$1,430</div>
            <div className="text-xs text-success mt-1">↓ 12% vs last month</div>
          </Card>
          <Card className="p-4 shadow-card">
            <div className="text-sm text-muted-foreground mb-1">Avg. Daily</div>
            <div className="text-2xl font-bold">$47.67</div>
            <div className="text-xs text-warning mt-1">↑ 5% vs last month</div>
          </Card>
        </div>

        {/* Spending Trends */}
        <Card className="p-5 mb-6 shadow-card">
          <h2 className="font-semibold text-lg mb-4">Spending Trends</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Income vs Expenses */}
        <Card className="p-5 mb-6 shadow-card">
          <h2 className="font-semibold text-lg mb-4">Income vs Expenses</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                />
                <Bar dataKey="income" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-sm">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span className="text-sm">Expenses</span>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-5 shadow-card">
          <h2 className="font-semibold text-lg mb-4">Category Breakdown</h2>
          <div className="space-y-4">
            {categoryBreakdown.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{category.name}</span>
                  <div className="text-right">
                    <span className="font-semibold">${category.amount}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
