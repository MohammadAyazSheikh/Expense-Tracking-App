import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Smartphone, Shield, Key, Fingerprint, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Security = () => {
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
          <h1 className="text-2xl font-bold">Security</h1>
        </div>

        {/* Security Status */}
        <Card className="bg-white/20 border-0 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">Protected</p>
              <p className="text-sm opacity-90">Your account is secure</p>
            </div>
            <Badge className="ml-auto bg-success/20 border-0">Active</Badge>
          </div>
        </Card>
      </div>

      <div className="px-4 -mt-4">
        {/* Authentication */}
        <Card className="p-5 mb-4 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Authentication</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Biometric Login</p>
                  <p className="text-sm text-muted-foreground">Use fingerprint/Face ID</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">SMS or authenticator app</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Recommended</Badge>
                <Switch />
              </div>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-5 mb-4 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" placeholder="Enter current password" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" placeholder="Enter new password" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input id="confirm" type="password" placeholder="Re-enter new password" className="mt-1.5" />
            </div>
            <Button className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </div>
        </Card>

        {/* Session Management */}
        <Card className="p-5 mb-4 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">iPhone 14 Pro</p>
                <p className="text-sm text-muted-foreground">Current device • New York, US</p>
              </div>
              <Badge className="bg-success">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">MacBook Pro</p>
                <p className="text-sm text-muted-foreground">2 days ago • New York, US</p>
              </div>
              <Button variant="ghost" size="sm">End</Button>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            Sign Out All Devices
          </Button>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-5 mb-4 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Privacy</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Data & Privacy</p>
                  <p className="text-sm text-muted-foreground">Manage your data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Connected Apps</p>
                  <p className="text-sm text-muted-foreground">Review app permissions</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Security;
