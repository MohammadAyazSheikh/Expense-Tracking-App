import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb,
  ArrowLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const insights = [
  {
    type: "warning",
    icon: TrendingUp,
    title: "Spending Alert",
    description: "You're spending 23% more on food this week compared to last week.",
    suggestion: "Try meal prepping to save approximately $50/week",
    impact: "High Impact",
  },
  {
    type: "success",
    icon: TrendingDown,
    title: "Great Progress!",
    description: "Your entertainment expenses are down 15% this month.",
    suggestion: "Keep it up! You're on track to save $80 this month.",
    impact: "Positive",
  },
  {
    type: "info",
    icon: Target,
    title: "Budget Recommendation",
    description: "Based on your income, you could save an additional $200/month.",
    suggestion: "Consider setting up automatic savings of $50/week",
    impact: "Medium Impact",
  },
];

const predictions = [
  { category: "Food", predicted: "$420", trend: "+12%", status: "warning" },
  { category: "Transport", predicted: "$180", trend: "-5%", status: "success" },
  { category: "Shopping", predicted: "$320", trend: "+8%", status: "info" },
  { category: "Bills", predicted: "$280", trend: "0%", status: "neutral" },
];

const SmartSense = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-2xl font-bold">SmartSense™</h1>
          </div>
        </div>
        <p className="text-sm opacity-90">
          AI-powered financial insights and personalized recommendations
        </p>
      </div>

      <div className="px-4 -mt-6">
        {/* AI Insights */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Smart Insights</h2>
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index} className="p-5 shadow-card">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      insight.type === "warning" ? "bg-warning/10" :
                      insight.type === "success" ? "bg-success/10" :
                      "bg-primary/10"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        insight.type === "warning" ? "text-warning" :
                        insight.type === "success" ? "text-success" :
                        "text-primary"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {insight.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{insight.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Spending Predictions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Next Month Predictions</h2>
          <Card className="p-5 shadow-card">
            <div className="space-y-4">
              {predictions.map((pred, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{pred.category}</div>
                    <div className="text-sm text-muted-foreground">Predicted</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{pred.predicted}</div>
                    <div className={`text-sm ${
                      pred.status === "warning" ? "text-warning" :
                      pred.status === "success" ? "text-success" :
                      "text-muted-foreground"
                    }`}>
                      {pred.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Savings Goals Suggestion */}
        <Card className="bg-gradient-secondary text-white p-6 shadow-lg border-0">
          <div className="flex items-start gap-3">
            <Target className="h-6 w-6 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Suggested Savings Goal</h3>
              <p className="text-sm opacity-90 mb-4">
                Based on your spending patterns, you could save $500 in the next 3 months 
                by optimizing your food and entertainment expenses.
              </p>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                Set This Goal
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SmartSense;
