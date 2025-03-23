
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";

interface AccountTabProps {
  settings: any;
  setSettings: (settings: any) => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({ settings, setSettings }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    settings.account?.avatar || null
  );
  const [username, setUsername] = useState(settings.account?.username || '');
  const [location, setLocation] = useState(settings.account?.location || '');
  const [dateFormat, setDateFormat] = useState(settings.account?.dateFormat || 'MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState(settings.account?.timeFormat || '12h');
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        
        setSettings({
          ...settings,
          account: {
            ...settings.account,
            avatar: result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setSettings({
      ...settings,
      account: {
        ...settings.account,
        username: e.target.value
      }
    });
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setSettings({
      ...settings,
      account: {
        ...settings.account,
        location: e.target.value
      }
    });
  };
  
  const handleDateFormatChange = (value: string) => {
    setDateFormat(value);
    setSettings({
      ...settings,
      account: {
        ...settings.account,
        dateFormat: value
      }
    });
  };
  
  const handleTimeFormatChange = (value: string) => {
    setTimeFormat(value);
    setSettings({
      ...settings,
      account: {
        ...settings.account,
        timeFormat: value
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback className="bg-primary/10">
                <User className="w-8 h-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="avatar-upload" 
              className="absolute -bottom-1 -right-1 p-1 bg-primary text-white rounded-full cursor-pointer"
            >
              <Upload size={14} />
              <span className="sr-only">Upload avatar</span>
            </label>
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarChange} 
            />
          </div>
          
          <div className="space-y-2 flex-1">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Your username" 
                value={username} 
                onChange={handleUsernameChange} 
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Your location" 
                value={location} 
                onChange={handleLocationChange} 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Date & Time Format</h3>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="date-format">Date Format</Label>
            <Select value={dateFormat} onValueChange={handleDateFormatChange}>
              <SelectTrigger id="date-format">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                <SelectItem value="MMMM D, YYYY">MMMM D, YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="time-format">Time Format</Label>
            <Select value={timeFormat} onValueChange={handleTimeFormatChange}>
              <SelectTrigger id="time-format">
                <SelectValue placeholder="Select time format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                <SelectItem value="24h">24-hour (13:30)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
