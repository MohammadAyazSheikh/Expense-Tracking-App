import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const transactions = [
  { id: 1, name: "Starbucks Coffee", category: "Food", amount: -4.50, date: "2024-06-15", time: "10:30 AM", type: "expense", payment: "Card" },
  { id: 2, name: "Salary Deposit", category: "Income", amount: 3500, date: "2024-06-15", time: "09:00 AM", type: "income", payment: "Bank" },
  { id: 3, name: "Uber Ride", category: "Transport", amount: -12.30, date: "2024-06-14", time: "18:45 PM", type: "expense", payment: "Card" },
  { id: 4, name: "Netflix Subscription", category: "Bills", amount: -15.99, date: "2024-06-14", time: "12:00 PM", type: "expense", payment: "Card" },
  { id: 5, name: "Grocery Shopping", category: "Food", amount: -85.20, date: "2024-06-13", time: "14:20 PM", type: "expense", payment: "Cash" },
  { id: 6, name: "Freelance Project", category: "Income", amount: 850, date: "2024-06-12", time: "16:30 PM", type: "income", payment: "Bank" },
  { id: 7, name: "Gym Membership", category: "Health", amount: -45, date: "2024-06-11", time: "07:00 AM", type: "expense", payment: "Card" },
  { id: 8, name: "Amazon Purchase", category: "Shopping", amount: -32.99, date: "2024-06-10", time: "20:15 PM", type: "expense", payment: "Card" },
];

const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    "Food": "🍔",
    "Transport": "🚗",
    "Bills": "📱",
    "Income": "💰",
    "Shopping": "🛍️",
    "Health": "💊",
  };
  return emojis[category] || "📝";
};

const Transactions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel;
    if (date.toDateString() === today.toDateString()) {
      dateLabel = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Transactions</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
          <Input 
            placeholder="Search transactions..."
            className="pl-10 bg-white/20 border-0 text-white placeholder:text-white/60 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Summary Card */}
        <Card className="p-5 mb-6 shadow-card">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total</div>
              <div className="font-semibold">{transactions.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Income</div>
              <div className="font-semibold text-success">
                ${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Expenses</div>
              <div className="font-semibold text-accent">
                ${Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>
          </div>
        </Card>

        {/* Transactions List */}
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                {date}
              </h3>
              <div className="space-y-2">
                {dateTransactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {getCategoryEmoji(transaction.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{transaction.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {transaction.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'income' ? 'text-success' : 'text-foreground'
                        }`}>
                          {transaction.type === 'income' ? '+' : ''}{transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {transaction.payment}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
