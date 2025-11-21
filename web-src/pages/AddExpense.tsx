import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "food", name: "Food", emoji: "🍔", color: "hsl(10 80% 65%)" },
  { id: "transport", name: "Transport", emoji: "🚗", color: "hsl(255 70% 65%)" },
  { id: "shopping", name: "Shopping", emoji: "🛍️", color: "hsl(35 90% 60%)" },
  { id: "bills", name: "Bills", emoji: "📱", color: "hsl(160 70% 60%)" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬", color: "hsl(230 75% 70%)" },
  { id: "health", name: "Health", emoji: "💊", color: "hsl(145 70% 55%)" },
];

const paymentModes = ["Cash", "Bank", "Card", "Wallet"];

const AddExpense = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [selectedPayment, setSelectedPayment] = useState("Card");
  const [isRecurring, setIsRecurring] = useState(false);

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
          <h1 className="text-2xl font-bold">Add Expense</h1>
        </div>

        {/* Amount Input */}
        <div className="text-center">
          <div className="text-sm opacity-90 mb-2">Amount</div>
          <div className="text-5xl font-bold">
            $<input 
              type="number" 
              className="bg-transparent border-none outline-none text-center w-48" 
              placeholder="0.00"
              defaultValue="24.50"
            />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Category Selection */}
        <Card className="p-6 mb-4 shadow-card">
          <Label className="text-base font-semibold mb-3 block">Category</Label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === category.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-3xl mb-1">{category.emoji}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Payment Mode */}
        <Card className="p-6 mb-4 shadow-card">
          <Label className="text-base font-semibold mb-3 block">Payment Mode</Label>
          <div className="flex gap-2">
            {paymentModes.map((mode) => (
              <Button
                key={mode}
                variant={selectedPayment === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPayment(mode)}
                className="flex-1"
              >
                {mode}
              </Button>
            ))}
          </div>
        </Card>

        {/* Details */}
        <Card className="p-6 mb-4 shadow-card">
          <div className="space-y-4">
            <div>
              <Label htmlFor="description" className="text-base font-semibold mb-2 block">
                Description
              </Label>
              <Input 
                id="description" 
                placeholder="e.g., Lunch at Cafe" 
                defaultValue="Lunch at Starbucks"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-base font-semibold mb-2 block">
                Notes (Optional)
              </Label>
              <Textarea 
                id="notes" 
                placeholder="Add any additional notes..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tags" className="text-base font-semibold mb-2 block">
                Tags (Optional)
              </Label>
              <Input 
                id="tags" 
                placeholder="e.g., work, lunch, coffee"
              />
            </div>
          </div>
        </Card>

        {/* Upload Receipt */}
        <Card className="p-6 mb-4 shadow-card">
          <Label className="text-base font-semibold mb-3 block">Receipt (Optional)</Label>
          <button className="w-full border-2 border-dashed border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Upload Receipt</div>
          </button>
        </Card>

        {/* Recurring */}
        <Card className="p-6 mb-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold block">Recurring Expense</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Set this expense to repeat automatically
              </p>
            </div>
            <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>
        </Card>

        {/* Submit Button */}
        <Button className="w-full h-14 text-lg font-semibold bg-gradient-primary border-0">
          Add Expense
        </Button>
      </div>
    </div>
  );
};

export default AddExpense;
