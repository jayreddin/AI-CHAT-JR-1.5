
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, X } from 'lucide-react';
import { AppSettings } from '@/hooks/useSettings';

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
  
  const clearAvatar = () => {
    setAvatarPreview(null);
    setSettings({
      ...settings,
      account: {
        ...settings.account,
        avatar: null
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border">
              <AvatarImage src={avatarPreview || undefined} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            {avatarPreview && (
              <button 
                onClick={clearAvatar}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <div>
            <Input 
              type="file" 
              id="avatar-upload"
              className="w-full max-w-xs"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: Square image, 500x500px or larger
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          value={settings.account.username} 
          onChange={(e) => setSettings({
            ...settings,
            account: {
              ...settings.account,
              username: e.target.value
            }
          })}
          placeholder="Your display name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          value={settings.account.location} 
          onChange={(e) => setSettings({
            ...settings,
            account: {
              ...settings.account,
              location: e.target.value
            }
          })}
          placeholder="Your location (optional)"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-format">Date Format</Label>
          <Select 
            value={settings.account.dateFormat || "MM/DD/YYYY"}
            onValueChange={(value) => setSettings({
              ...settings,
              account: {
                ...settings.account,
                dateFormat: value
              }
            })}
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
        
        <div className="space-y-2">
          <Label htmlFor="time-format">Time Format</Label>
          <Select 
            value={settings.account.timeFormat || "12h"}
            onValueChange={(value) => setSettings({
              ...settings,
              account: {
                ...settings.account,
                timeFormat: value
              }
            })}
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
      
      <div className="pt-4">
        <p className="text-sm text-muted-foreground">
          Account settings are stored locally. In a production app, these would 
          sync with a server.
        </p>
      </div>
    </div>
  );
};
