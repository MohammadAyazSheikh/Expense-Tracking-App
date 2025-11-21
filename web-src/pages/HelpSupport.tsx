import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone,
  Book,
  Video,
  HelpCircle,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const faqCategories = [
  {
    title: "Getting Started",
    icon: Book,
    questions: [
      "How do I add my first expense?",
      "Setting up multiple wallets",
      "Understanding budget categories"
    ]
  },
  {
    title: "SmartSense™ AI",
    icon: HelpCircle,
    questions: [
      "How does AI predict spending?",
      "Understanding savings suggestions",
      "Enabling AI insights"
    ]
  },
  {
    title: "Account & Security",
    icon: HelpCircle,
    questions: [
      "Changing my password",
      "Setting up 2FA",
      "Managing devices"
    ]
  }
];

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    badge: "Average response: 5 min",
    color: "text-primary"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@expensetrack.com",
    badge: "Response within 24h",
    color: "text-accent"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "+1 (800) 123-4567",
    badge: "Mon-Fri, 9AM-6PM EST",
    color: "text-success"
  }
];

const HelpSupport = () => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for help..." 
            className="pl-10 bg-white/20 border-0 text-white placeholder:text-white/70"
          />
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Quick Actions */}
        <Card className="p-4 mb-6 shadow-card">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Button variant="outline" size="sm" className="flex-shrink-0">
              <Video className="h-4 w-4 mr-2" />
              Video Tutorials
            </Button>
            <Button variant="outline" size="sm" className="flex-shrink-0">
              <Book className="h-4 w-4 mr-2" />
              User Guide
            </Button>
            <Button variant="outline" size="sm" className="flex-shrink-0">
              <ExternalLink className="h-4 w-4 mr-2" />
              Community
            </Button>
          </div>
        </Card>

        {/* Contact Support */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 px-1">Contact Support</h2>
          <div className="space-y-3">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.title} className="p-4 shadow-card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className={`h-6 w-6 ${option.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{option.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{option.description}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{option.badge}</Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3 px-1">Frequently Asked</h2>
          <div className="space-y-4">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="p-5 shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{category.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.questions.map((question, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <span className="text-sm">{question}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* App Info */}
        <Card className="p-5 mt-6 shadow-card text-center">
          <p className="text-sm text-muted-foreground mb-2">ExpenseTrack v2.1.0</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <button className="text-primary hover:underline">Privacy Policy</button>
            <span className="text-muted-foreground">•</span>
            <button className="text-primary hover:underline">Terms of Service</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupport;
