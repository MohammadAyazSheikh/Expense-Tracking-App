import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Wallet, PieChart } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Icon */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('app.name')}</h1>
          <p className="text-white/90 text-lg">{t('app.tagline')}</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/20 border-0 p-4 backdrop-blur-sm text-center">
            <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Smart Analytics</p>
          </Card>
          <Card className="bg-white/20 border-0 p-4 backdrop-blur-sm text-center">
            <PieChart className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Budget Tracking</p>
          </Card>
          <Card className="bg-white/20 border-0 p-4 backdrop-blur-sm text-center">
            <Wallet className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Multi-Wallet</p>
          </Card>
          <Card className="bg-white/20 border-0 p-4 backdrop-blur-sm text-center">
            <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">AI Assistant</p>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            size="lg" 
            className="w-full bg-white text-primary hover:bg-white/90 font-semibold text-lg h-14"
            onClick={() => navigate("/onboarding")}
          >
            {t('common.getStarted')}
          </Button>
          <Button 
            size="lg" 
            variant="ghost" 
            className="w-full text-white hover:bg-white/20 font-medium"
            onClick={() => navigate("/auth")}
          >
            {t('common.signIn')}
          </Button>
        </div>

        <p className="text-center text-white/70 text-sm">
          Start tracking your expenses with AI-powered insights
        </p>
      </div>
    </div>
  );
};

export default Index;
