"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Cloud,
  CloudRain,
  Zap,
  Wind,
  Thermometer,
  MapPin,
  Clock,
  ExternalLink,
  Bell,
  BellOff,
  CheckCircle,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DisasterAlert {
  id: string;
  type: "weather" | "fire" | "flood" | "earthquake" | "storm" | "emergency";
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

interface DisasterAlertsProps {
  alerts: DisasterAlert[];
  onAlertsChange: (alerts: DisasterAlert[]) => void;
}

const alertTypes = [
  { value: "weather", label: "Weather", icon: Cloud, color: "text-blue-600" },
  { value: "fire", label: "Fire", icon: Zap, color: "text-red-600" },
  { value: "flood", label: "Flood", icon: CloudRain, color: "text-cyan-600" },
  { value: "earthquake", label: "Earthquake", icon: AlertTriangle, color: "text-orange-600" },
  { value: "storm", label: "Storm", icon: Wind, color: "text-gray-600" },
  { value: "emergency", label: "Emergency", icon: Bell, color: "text-purple-600" },
];

const mockAlerts: DisasterAlert[] = [
  {
    id: "1",
    type: "weather",
    title: "Severe Thunderstorm Warning",
    description: "Damaging winds, large hail, and heavy rain expected. Take shelter immediately.",
    severity: "high",
    location: "Downtown Area",
    timestamp: new Date(),
    instructions: [
      "Move to interior room on lowest floor",
      "Stay away from windows",
      "Avoid using electrical appliances",
      "Have emergency kit ready",
    ],
    resources: [
      { name: "Weather Service", url: "https://weather.gov" },
      { name: "Emergency Management", url: "https://fema.gov" },
    ],
    isActive: true,
  },
  {
    id: "2",
    type: "fire",
    title: "Wildfire Evacuation Order",
    description: "Immediate evacuation ordered for zones A-1 through A-3 due to approaching wildfire.",
    severity: "critical",
    location: "Northern District",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    instructions: [
      "Evacuate immediately",
      "Follow designated evacuation routes",
      "Take emergency kit and important documents",
      "Check on neighbors",
      "Do not return until authorized",
    ],
    resources: [
      { name: "Evacuation Map", url: "https://evacuation-map.local" },
      { name: "Fire Department", url: "https://firedept.gov" },
    ],
    isActive: true,
  },
  {
    id: "3",
    type: "flood",
    title: "Flood Watch",
    description: "Minor flooding possible in low-lying areas. Monitor conditions closely.",
    severity: "medium",
    location: "Riverside Area",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    instructions: [
      "Monitor local weather updates",
      "Prepare emergency kit",
      "Know evacuation routes",
      "Move valuables to higher ground",
    ],
    resources: [
      { name: "Flood Information", url: "https://floodsmart.gov" },
    ],
    isActive: true,
  },
];

export function DisasterAlerts({ alerts, onAlertsChange }: DisasterAlertsProps) {
  const [localAlerts, setLocalAlerts] = useState<DisasterAlert[]>(mockAlerts);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-orange-500 bg-orange-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-green-500 bg-green-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "medium":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleDismissAlert = (alertId: string) => {
    const updatedAlerts = localAlerts.map(alert =>
      alert.id === alertId ? { ...alert, isActive: false } : alert
    );
    setLocalAlerts(updatedAlerts);
    onAlertsChange(updatedAlerts);
  };

  const handleMarkAsRead = (alertId: string) => {
    // In a real app, this would update the read status
    console.log("Marking alert as read:", alertId);
  };

  const activeAlerts = localAlerts.filter(alert => alert.isActive);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === "critical");
  const highAlerts = activeAlerts.filter(alert => alert.severity === "high");

  return (
    <div className="space-y-6">
      {/* Alert Settings */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="text-sm font-medium">
                Push Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive alerts for critical safety updates
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationEnabled}
              onCheckedChange={setNotificationEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts Summary */}
      {(criticalAlerts.length > 0 || highAlerts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criticalAlerts.length > 0 && (
            <Card className="border-red-500 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800">
                    Critical Alerts
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} active
                </p>
              </CardContent>
            </Card>
          )}

          {highAlerts.length > 0 && (
            <Card className="border-orange-500 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    High Priority
                  </span>
                </div>
                <p className="text-sm text-orange-700">
                  {highAlerts.length} high priority alert{highAlerts.length > 1 ? 's' : ''} active
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Active Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
          <Badge variant="outline">
            {activeAlerts.length} active
          </Badge>
        </div>

        {activeAlerts.length === 0 ? (
          <Card className="border-primary/10">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Clear</h3>
              <p className="text-muted-foreground">
                No active safety alerts in your area.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn("border-2", getSeverityColor(alert.severity))}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(alert.severity)}
                        <div>
                          <h4 className="font-semibold">{alert.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {alert.location}
                            <Clock className="h-3 w-3 ml-2" />
                            {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAlert(alert)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismissAlert(alert.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{alert.description}</p>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {alertTypes.find(type => type.value === alert.type)?.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          alert.severity === "critical" && "border-red-500 text-red-700",
                          alert.severity === "high" && "border-orange-500 text-orange-700",
                          alert.severity === "medium" && "border-yellow-500 text-yellow-700",
                          alert.severity === "low" && "border-green-500 text-green-700"
                        )}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Details Dialog */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getSeverityIcon(selectedAlert.severity)}
                {selectedAlert.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedAlert.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedAlert.timestamp.toLocaleString()}
                </div>
              </div>

              <p className="text-sm">{selectedAlert.description}</p>

              {selectedAlert.instructions && selectedAlert.instructions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Safety Instructions:</h4>
                  <ul className="space-y-1">
                    {selectedAlert.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAlert.resources && selectedAlert.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Resources:</h4>
                  <div className="space-y-2">
                    {selectedAlert.resources.map((resource, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {resource.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
