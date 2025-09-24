"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Phone,
  MapPin,
  Users,
  Heart,
  Zap,
  CheckCircle,
  Clock,
  Navigation,
  Radio,
  Battery,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SOSButton } from "./sos-button";
import { EmergencyContacts } from "./emergency-contacts";
import { DisasterAlerts } from "./disaster-alerts";
import { SafetyChecklist } from "./safety-checklist";
import { cn } from "@/lib/utils";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  address?: string;
  isAvailable?: boolean;
  priority: "high" | "medium" | "low";
}

interface SafetyAlert {
  id: string;
  type: "weather" | "emergency" | "fire" | "flood" | "earthquake" | "storm";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  timestamp: Date;
  instructions?: string[];
  resources?: {
    name: string;
    url: string;
  }[];
  isActive: boolean;
}

export function SafeNetDashboard() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Emergency Services",
      phone: "911",
      relationship: "Emergency",
      isAvailable: true,
      priority: "high",
    },
    {
      id: "2",
      name: "Dr. Sarah Johnson",
      phone: "+1-555-0123",
      relationship: "Primary Care",
      isAvailable: true,
      priority: "high",
    },
    {
      id: "3",
      name: "Mike Chen",
      phone: "+1-555-0456",
      relationship: "Family",
      isAvailable: false,
      priority: "medium",
    },
  ]);

  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);

  const [connectionStatus, setConnectionStatus] = useState({
    online: navigator.onLine,
    battery: 85,
    signal: "strong",
  });

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus(prev => ({ ...prev, online: true }));
    const handleOffline = () => setConnectionStatus(prev => ({ ...prev, online: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);



  const quickActions = [
    {
      title: "Emergency SOS",
      description: "Send immediate help",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      action: () => {
        // SOS button handles this
      },
    },
    {
      title: "Call Emergency",
      description: "Dial 911 directly",
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => window.location.href = "tel:911",
    },
    {
      title: "Share Location",
      description: "Send current location",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationUrl = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
              window.open(locationUrl, '_blank');
            }
          );
        }
      },
    },
    {
      title: "Safety Check",
      description: "Mark yourself safe",
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: () => {
        // Would integrate with safety check-in system
        console.log("Safety check-in completed");
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="border-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {connectionStatus.online ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">
                  {connectionStatus.online ? "Online" : "Offline"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {connectionStatus.online
                    ? "All systems operational"
                    : "Limited functionality available"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Battery className="h-4 w-4" />
                <span>{connectionStatus.battery}%</span>
              </div>
              <Badge variant={connectionStatus.online ? "default" : "destructive"}>
                {connectionStatus.signal}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 hover:scale-105",
                "border-primary/10 hover:border-primary/20",
                action.bgColor
              )}
              onClick={action.action}
            >
              <CardContent className="p-4 text-center">
                <action.icon className={cn("h-8 w-8 mx-auto mb-2", action.color)} />
                <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Emergency Contacts */}
      <EmergencyContacts
        contacts={emergencyContacts}
        onContactsChange={setEmergencyContacts}
      />

      {/* Disaster Alerts */}
      <DisasterAlerts
        alerts={safetyAlerts}
        onAlertsChange={setSafetyAlerts}
      />

      {/* Safety Checklist */}
      <SafetyChecklist />

      {/* Floating SOS Button for Mobile */}
      <div className="lg:hidden">
        <SOSButton variant="floating" />
      </div>
    </div>
  );
}
