import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TrendingUp, PieChart, Sparkles, Wallet } from "lucide-react";

const slides = [
  {
    icon: TrendingUp,
    title: "Track Every Expense",
    description: "Effortlessly monitor your daily spending across all categories with intuitive tracking",
    color: "text-success"
  },
  {
    icon: PieChart,
    title: "Smart Budgeting",
    description: "Set intelligent budgets and get real-time alerts when you're close to limits",
    color: "text-accent"
  },
  {
    icon: Wallet,
    title: "Manage Multiple Wallets",
    description: "Handle cash, cards, and digital wallets all in one place with easy transfers",
    color: "text-warning"
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Meet SmartSense™ - your personal AI financial assistant that helps you save smarter",
    color: "text-primary"
  }
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/auth");
    }
  };

  const handleSkip = () => {
    navigate("/auth");
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" onClick={handleSkip}>
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <Card className="bg-gradient-subtle border-0 p-8 rounded-3xl w-64 h-64 flex items-center justify-center mb-12 shadow-elegant">
          <Icon className={`w-32 h-32 ${slide.color}`} strokeWidth={1.5} />
        </Card>

        <h1 className="text-3xl font-bold text-center mb-4 px-4">
          {slide.title}
        </h1>
        <p className="text-muted-foreground text-center text-lg px-6 max-w-md">
          {slide.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="p-6 space-y-6">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-semibold"
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
