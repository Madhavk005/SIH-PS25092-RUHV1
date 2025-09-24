"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onContactsChange: (contacts: EmergencyContact[]) => void;
}

const relationshipOptions = [
  "Family",
  "Friend",
  "Neighbor",
  "Colleague",
  "Doctor",
  "Emergency Service",
  "Other",
];

const priorityOptions = [
  { value: "high", label: "High Priority", color: "bg-red-100 text-red-800" },
  { value: "medium", label: "Medium Priority", color: "bg-yellow-100 text-yellow-800" },
  { value: "low", label: "Low Priority", color: "bg-green-100 text-green-800" },
];

export function EmergencyContacts({ contacts, onContactsChange }: EmergencyContactsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
    address: "",
    priority: "medium" as "high" | "medium" | "low",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      relationship: "",
      address: "",
      priority: "medium",
    });
  };

  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      ...formData,
      isAvailable: true,
    };

    onContactsChange([...contacts, newContact]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "",
      relationship: contact.relationship,
      address: contact.address || "",
      priority: contact.priority,
    });
  };

  const handleUpdateContact = () => {
    if (!editingContact) return;

    const updatedContacts = contacts.map(contact =>
      contact.id === editingContact.id
        ? { ...contact, ...formData }
        : contact
    );

    onContactsChange(updatedContacts);
    setEditingContact(null);
    resetForm();
  };

  const handleDeleteContact = (contactId: string) => {
    onContactsChange(contacts.filter(contact => contact.id !== contactId));
  };

  const handleCallContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleSendMessage = (phone: string) => {
    window.location.href = `sms:${phone}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Emergency Contacts</h3>
        </div>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="grid gap-3">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      contact.isAvailable ? "bg-green-500" : "bg-gray-400"
                    )} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{contact.name}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            priorityOptions.find(p => p.value === contact.priority)?.color
                          )}
                        >
                          {priorityOptions.find(p => p.value === contact.priority)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {contact.relationship}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCallContact(contact.phone)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(contact.phone)}
                    >
                      Message
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditContact(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Contact Dialog */}
      <Dialog
        open={showAddDialog || !!editingContact}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingContact(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Edit Contact" : "Add Emergency Contact"}
            </DialogTitle>
            <DialogDescription>
              {editingContact
                ? "Update the contact information below."
                : "Add a new emergency contact to your SafeNet."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "high" | "medium" | "low") =>
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setEditingContact(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingContact ? handleUpdateContact : handleAddContact}>
              {editingContact ? "Update Contact" : "Add Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
