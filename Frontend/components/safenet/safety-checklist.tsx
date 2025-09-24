"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Home,
  Car,
  Briefcase,
  Heart,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: "home" | "car" | "work" | "health" | "general";
  priority: "high" | "medium" | "low";
  notes?: string;
}

interface SafetyChecklistProps {
  className?: string;
}

const defaultChecklistItems: ChecklistItem[] = [
  {
    id: "1",
    text: "Create emergency kit with water, food, and medications",
    completed: false,
    category: "home",
    priority: "high",
    notes: "Include 3-day supply for each family member",
  },
  {
    id: "2",
    text: "Identify evacuation routes and meeting points",
    completed: false,
    category: "home",
    priority: "high",
    notes: "Have multiple routes planned",
  },
  {
    id: "3",
    text: "Keep important documents in waterproof container",
    completed: false,
    category: "home",
    priority: "medium",
    notes: "ID, insurance, medical records, etc.",
  },
  {
    id: "4",
    text: "Install smoke detectors and carbon monoxide alarms",
    completed: false,
    category: "home",
    priority: "high",
  },
  {
    id: "5",
    text: "Keep car emergency kit updated",
    completed: false,
    category: "car",
    priority: "medium",
    notes: "First aid, tools, blankets, water",
  },
  {
    id: "6",
    text: "Maintain emergency contacts list",
    completed: false,
    category: "general",
    priority: "high",
  },
  {
    id: "7",
    text: "Learn basic first aid and CPR",
    completed: false,
    category: "health",
    priority: "medium",
  },
  {
    id: "8",
    text: "Create workplace emergency plan",
    completed: false,
    category: "work",
    priority: "medium",
  },
];

const categoryIcons = {
  home: Home,
  car: Car,
  work: Briefcase,
  health: Heart,
  general: Shield,
};

const categoryColors = {
  home: "text-blue-600 bg-blue-50",
  car: "text-green-600 bg-green-50",
  work: "text-purple-600 bg-purple-50",
  health: "text-red-600 bg-red-50",
  general: "text-gray-600 bg-gray-50",
};

const priorityColors = {
  high: "border-red-200 bg-red-50",
  medium: "border-yellow-200 bg-yellow-50",
  low: "border-green-200 bg-green-50",
};

export function SafetyChecklist({ className }: SafetyChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(defaultChecklistItems);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    text: "",
    category: "general" as ChecklistItem["category"],
    priority: "medium" as ChecklistItem["priority"],
    notes: "",
  });

  const toggleItem = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = () => {
    if (!newItem.text.trim()) return;

    const item: ChecklistItem = {
      id: Date.now().toString(),
      text: newItem.text,
      completed: false,
      category: newItem.category,
      priority: newItem.priority,
      notes: newItem.notes || undefined,
    };

    setItems([...items, item]);
    setNewItem({
      text: "",
      category: "general",
      priority: "medium",
      notes: "",
    });
    setIsAddingItem(false);
  };

  const updateItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const completedCount = items.filter(item => item.completed).length;
  const completionPercentage = (completedCount / items.length) * 100;

  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const categories = Object.entries(itemsByCategory);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Overview */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety Preparedness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {completedCount} of {items.length} items completed
              </span>
              <Badge variant="outline">
                {Math.round(completionPercentage)}%
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Keep your safety checklist up to date for better emergency preparedness.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      <div className="space-y-4">
        {categories.map(([category, categoryItems]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const categoryCompleted = categoryItems.filter(item => item.completed).length;
          const categoryTotal = categoryItems.length;

          return (
            <Card key={category} className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4" />
                  {category.charAt(0).toUpperCase() + category.slice(1)} Safety
                  <Badge variant="outline" className="ml-auto">
                    {categoryCompleted}/{categoryTotal}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-all",
                        priorityColors[item.priority],
                        item.completed && "opacity-60"
                      )}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="mt-0.5"
                      >
                        {item.completed ? (
                          <CheckSquare className="h-5 w-5 text-green-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium",
                          item.completed && "line-through text-muted-foreground"
                        )}>
                          {item.text}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            item.priority === "high" && "border-red-200 text-red-700",
                            item.priority === "medium" && "border-yellow-200 text-yellow-700",
                            item.priority === "low" && "border-green-200 text-green-700"
                          )}
                        >
                          {item.priority}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Item */}
      {isAddingItem && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base">Add Safety Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-text">Safety Item</Label>
                <Input
                  id="item-text"
                  value={newItem.text}
                  onChange={(e) => setNewItem(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter safety item description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-category">Category</Label>
                  <select
                    id="item-category"
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({
                      ...prev,
                      category: e.target.value as ChecklistItem["category"]
                    }))}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="home">Home</option>
                    <option value="car">Car</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="item-priority">Priority</Label>
                  <select
                    id="item-priority"
                    value={newItem.priority}
                    onChange={(e) => setNewItem(prev => ({
                      ...prev,
                      priority: e.target.value as ChecklistItem["priority"]
                    }))}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="item-notes">Notes (Optional)</Label>
                <Textarea
                  id="item-notes"
                  value={newItem.notes}
                  onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or details"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addItem} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingItem(false)}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Item Button */}
      {!isAddingItem && (
        <Button
          onClick={() => setIsAddingItem(true)}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Safety Item
        </Button>
      )}
    </div>
  );
}
