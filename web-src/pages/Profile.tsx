import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
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
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold">
              AJ
            </div>
            <Button 
              size="icon" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white text-primary hover:bg-white/90"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Personal Information */}
        <Card className="p-5 mb-4 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Alex Johnson" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="alex.johnson@email.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+1 234 567 8900" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" defaultValue="1990-01-15" className="mt-1.5" />
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-5 mb-4 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Input id="currency" defaultValue="USD ($)" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Input id="language" defaultValue="English" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="America/New_York (EST)" className="mt-1.5" />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3 mb-6">
          <Button className="w-full h-12" size="lg">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" className="w-full h-12" size="lg">
            Export Profile Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
