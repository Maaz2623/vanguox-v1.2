"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  Palette,
  Link,
  Shield,
  KeyRound,
  User,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";

const menuItems = [
  { id: "general", label: "General", icon: LayoutDashboard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "personalization", label: "Personalization", icon: Palette },
  { id: "connected", label: "Connected apps", icon: Link },
  { id: "data", label: "Data controls", icon: Shield },
  { id: "security", label: "Security", icon: KeyRound },
  { id: "account", label: "Account", icon: User },
];
export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState("general");
  return (
    <div className="p-5">
      <div className="mb-5">
        <SidebarTrigger />
      </div>

      <div className="flex h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-60 border-r border-border p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition 
                ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">General</h2>

              {/* Theme */}
              <div className="flex items-center justify-between">
                <Label>Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Accent color */}
              <div className="flex items-center justify-between">
                <Label>Accent color</Label>
                <Select defaultValue="default">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <Label>Language</Label>
                <Select defaultValue="auto">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Spoken language */}
              <div className="flex items-center justify-between">
                <Label>Spoken language</Label>
                <Select defaultValue="auto">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Follow-up suggestions */}
              <div className="flex items-center justify-between">
                <Label>Show follow up suggestions in chats</Label>
                <Switch defaultChecked />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
