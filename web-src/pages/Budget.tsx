import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const budgets = [
  { 
    category: "Food & Dining", 
    spent: 420, 
    limit: 600, 
    color: "bg-success",
    icon: "🍔"
  },
  { 
    category: "Shopping", 
    spent: 350, 
    limit: 400, 
    color: "bg-warning",
    icon: "🛍️"
  },
  { 
    category: "Transport", 
    spent: 280, 
    limit: 300, 
    color: "bg-destructive",
    icon: "🚗"
  },
  { 
    category: "Bills & Utilities", 
    spent: 180, 
    limit: 500, 
    color: "bg-primary",
    icon: "⚡"
  },
  { 
    category: "Entertainment", 
    spent: 150, 
    limit: 200, 
    color: "bg-accent",
    icon: "🎮"
  },
];

const Budget = () => {
  const navigate = useNavigate();

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const overallProgress = (totalSpent / totalLimit) * 100;

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
            <h1 className="text-2xl font-bold">Budget Manager</h1>
          </div>
          <Button 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 border-0"
            onClick={() => navigate("/add-expense")}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Budget
          </Button>
        </div>

        {/* Overall Summary */}
        <Card className="bg-white/20 border-0 p-5 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Budget</p>
              <p className="text-3xl font-bold">${totalLimit}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm mb-1">Spent</p>
              <p className="text-2xl font-bold">${totalSpent}</p>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2 bg-white/30" />
          <p className="text-white/80 text-sm mt-2">
            ${totalLimit - totalSpent} remaining this month
          </p>
        </Card>
      </div>

      <div className="px-4 -mt-4">
        {/* AI Insights */}
        <Card className="p-4 mb-6 shadow-card bg-gradient-subtle border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">SmartSense™ Suggestion</h3>
              <p className="text-sm text-muted-foreground">
                You're on track to save $200 this month! Consider reducing Shopping by $50 to increase savings.
              </p>
            </div>
          </div>
        </Card>

        {/* Budget Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button variant="ghost" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Trends
            </Button>
          </div>

          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isNearLimit = percentage > 80;
            const isOverLimit = percentage >= 100;

            return (
              <Card key={budget.category} className="p-5 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{budget.icon}</div>
                    <div>
                      <h3 className="font-semibold">{budget.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${budget.spent} of ${budget.limit}
                      </p>
                    </div>
                  </div>
                  {isOverLimit && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Over
                    </Badge>
                  )}
                  {isNearLimit && !isOverLimit && (
                    <Badge variant="secondary" className="gap-1 bg-warning/20 text-warning">
                      <AlertCircle className="h-3 w-3" />
                      Near Limit
                    </Badge>
                  )}
                </div>

                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2 mb-2"
                />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {percentage.toFixed(0)}% used
                  </span>
                  <span className={isOverLimit ? "text-destructive font-medium" : "text-success font-medium"}>
                    ${Math.abs(budget.limit - budget.spent)} {isOverLimit ? "over" : "left"}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Monthly Goal */}
        <Card className="p-5 mt-6 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Monthly Savings Goal</h3>
              <p className="text-sm text-muted-foreground">Save $500 this month</p>
            </div>
          </div>
          <Progress value={65} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            $325 saved • $175 to go
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Budget;
