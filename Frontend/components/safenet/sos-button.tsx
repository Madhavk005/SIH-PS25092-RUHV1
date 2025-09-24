"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MapPin, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SOSButtonProps {
  className?: string;
  variant?: "default" | "floating" | "header";
}

export function SOSButton({ className, variant = "default" }: SOSButtonProps) {
  const [showSOS, setShowSOS] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Emergency Services",
      phone: "911",
      relationship: "Emergency",
    },
  ]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleSOS = async () => {
    setShowSOS(true);
    setCountdown(3);

    // Countdown before sending SOS
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sendSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendSOS = async () => {
    try {
      // Send SOS alert to emergency contacts
      const sosData = {
        type: "SOS",
        location,
        timestamp: new Date().toISOString(),
        message: "Emergency SOS activated from SafeNet app",
      };

      // Call emergency services
      if (emergencyContacts[0]?.phone === "911") {
        window.location.href = "tel:911";
      }

      // Send alerts to other emergency contacts
      for (const contact of emergencyContacts.slice(1)) {
        // In a real app, this would send SMS or push notifications
        console.log(`Sending SOS to ${contact.name}: ${contact.phone}`);
      }

      // Log the SOS event (would integrate with backend)
      console.log("SOS Alert sent:", sosData);

    } catch (error) {
      console.error("Error sending SOS:", error);
    }
  };

  const cancelSOS = () => {
    setShowSOS(false);
    setCountdown(0);
  };

  const getEmergencyNumbers = () => {
    return [
      { service: "Police", number: "911", color: "text-blue-600" },
      { service: "Fire", number: "911", color: "text-red-600" },
      { service: "Medical", number: "911", color: "text-green-600" },
      { service: "Poison Control", number: "1-800-222-1222", color: "text-purple-600" },
    ];
  };

  if (variant === "floating") {
    return (
      <>
        <Button
          onClick={handleSOS}
          size="lg"
          className={cn(
            "fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl",
            "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
            "animate-pulse hover:animate-none transition-all duration-200",
            "border-4 border-white shadow-red-500/50",
            className
          )}
        >
          <AlertTriangle className="h-8 w-8 text-white" />
        </Button>

        <Dialog open={showSOS} onOpenChange={setShowSOS}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Emergency SOS
              </DialogTitle>
              <DialogDescription>
                {countdown > 0
                  ? `Sending SOS in ${countdown} seconds...`
                  : "SOS alert has been sent to emergency services and your contacts."}
              </DialogDescription>
            </DialogHeader>

            {countdown === 0 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Your Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {location
                        ? `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`
                        : "Location not available"}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-2">
                  {getEmergencyNumbers().map((emergency) => (
                    <Button
                      key={emergency.service}
                      variant="outline"
                      className="flex flex-col h-auto p-3"
                      onClick={() => window.location.href = `tel:${emergency.number}`}
                    >
                      <span className={cn("font-bold", emergency.color)}>
                        {emergency.service}
                      </span>
                      <span className="text-sm">{emergency.number}</span>
                    </Button>
                  ))}
                </div>

                <Button onClick={cancelSOS} variant="outline" className="w-full">
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (variant === "header") {
    return (
      <Button
        onClick={handleSOS}
        variant="ghost"
        size="sm"
        className={cn(
          "text-red-600 hover:text-red-700 hover:bg-red-50",
          "transition-colors duration-200",
          className
        )}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        SOS
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSOS}
      className={cn(
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
        "shadow-lg hover:shadow-xl transition-all duration-200",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 mr-2" />
      Emergency SOS
    </Button>
  );
}
