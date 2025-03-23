
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Upload, X } from "lucide-react";
import { AppSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';

interface AccountTabProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const AccountTab: React.FC<AccountTabProps> = ({ settings, setSettings }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(settings.account.avatar);
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setSettings(prev => ({
          ...prev,
          account: {
            ...prev.account,
            avatar: result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    setAvatarPreview(null);
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        avatar: null
      }
    }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        username: e.target.value
      }
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        location: e.target.value
      }
    }));
  };

  const handleDateFormatChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        dateFormat: value
      }
    }));
  };

  const handleTimeFormatChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        timeFormat: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Account Settings</h3>
      
      {/* Avatar upload */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <Avatar className="h-24 w-24">
            {avatarPreview ? (
              <AvatarImage src={avatarPreview} alt="User avatar" />
            ) : (
              <AvatarFallback className="bg-primary/10">
                <User size={40} className="text-primary" />
              </AvatarFallback>
            )}
          </Avatar>
          
          {avatarPreview && (
            <button 
              onClick={clearAvatar}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <div>
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="flex items-center gap-1 text-sm text-primary hover:underline">
              <Upload size={14} />
              <span>Upload avatar</span>
            </div>
          </Label>
          <Input 
            id="avatar-upload" 
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          placeholder="Your username"
          value={settings.account.username}
          onChange={handleUsernameChange}
        />
      </div>
      
      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          placeholder="Your location"
          value={settings.account.location}
          onChange={handleLocationChange}
        />
      </div>
      
      {/* Date Format */}
      <div className="space-y-2">
        <Label htmlFor="date-format">Date Format</Label>
        <Select 
          value={settings.account.dateFormat} 
          onValueChange={handleDateFormatChange}
        >
          <SelectTrigger id="date-format">
            <SelectValue placeholder="Select date format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Time Format */}
      <div className="space-y-2">
        <Label htmlFor="time-format">Time Format</Label>
        <Select 
          value={settings.account.timeFormat} 
          onValueChange={handleTimeFormatChange}
        >
          <SelectTrigger id="time-format">
            <SelectValue placeholder="Select time format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
            <SelectItem value="24h">24-hour</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
