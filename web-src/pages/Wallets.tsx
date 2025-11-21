import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, CreditCard, Wallet, Landmark, Smartphone, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const wallets = [
  { 
    id: 1,
    name: "Cash", 
    balance: 450.00, 
    type: "cash",
    icon: Wallet,
    color: "bg-success",
    textColor: "text-success"
  },
  { 
    id: 2,
    name: "Chase Checking", 
    balance: 2340.50, 
    type: "bank",
    icon: Landmark,
    color: "bg-primary",
    textColor: "text-primary",
    accountNumber: "****4532"
  },
  { 
    id: 3,
    name: "Visa Credit Card", 
    balance: 1250.00, 
    type: "card",
    icon: CreditCard,
    color: "bg-accent",
    textColor: "text-accent",
    accountNumber: "****8891"
  },
  { 
    id: 4,
    name: "PayPal", 
    balance: 680.25, 
    type: "digital",
    icon: Smartphone,
    color: "bg-warning",
    textColor: "text-warning"
  },
];

const recentTransfers = [
  { from: "Chase Checking", to: "Cash", amount: 200, date: "Today" },
  { from: "PayPal", to: "Chase Checking", amount: 150, date: "Yesterday" },
];

const Wallets = () => {
  const navigate = useNavigate();

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

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
            <h1 className="text-2xl font-bold">Wallets & Accounts</h1>
          </div>
          <Button 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 border-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Total Balance */}
        <Card className="bg-white/20 border-0 p-5 backdrop-blur-sm">
          <p className="text-white/80 text-sm mb-1">Total Balance</p>
          <p className="text-4xl font-bold mb-3">${totalBalance.toFixed(2)}</p>
          <div className="flex gap-2">
            <Badge className="bg-white/20 hover:bg-white/30 border-0">
              {wallets.length} Accounts
            </Badge>
          </div>
        </Card>
      </div>

      <div className="px-4 -mt-4">
        {/* Wallets List */}
        <div className="space-y-3 mb-6">
          {wallets.map((wallet) => {
            const Icon = wallet.icon;
            return (
              <Card key={wallet.id} className="p-5 shadow-card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${wallet.color}/10 flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${wallet.textColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{wallet.name}</h3>
                      {wallet.accountNumber && (
                        <p className="text-sm text-muted-foreground">{wallet.accountNumber}</p>
                      )}
                      <Badge variant="secondary" className="text-xs mt-1 capitalize">
                        {wallet.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${wallet.balance.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Transfer Money Button */}
        <Button 
          size="lg" 
          className="w-full mb-6 h-14"
          onClick={() => navigate("/add-expense")}
        >
          <ArrowUpDown className="h-5 w-5 mr-2" />
          Transfer Between Accounts
        </Button>

        {/* Recent Transfers */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Transfers</h2>
          <div className="space-y-3">
            {recentTransfers.map((transfer, index) => (
              <Card key={index} className="p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transfer.from}</p>
                      <p className="text-xs text-muted-foreground">to {transfer.to}</p>
                      <p className="text-xs text-muted-foreground">{transfer.date}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${transfer.amount}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Card className="p-4 shadow-card text-center">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-xl font-bold text-success">+$1,240</p>
            <p className="text-xs text-muted-foreground mt-1">Income</p>
          </Card>
          <Card className="p-4 shadow-card text-center">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-xl font-bold text-accent">-$890</p>
            <p className="text-xs text-muted-foreground mt-1">Expenses</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wallets;
