/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import "react-phone-number-input/style.css";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldName, setOldName] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [oldPhone, setOldPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      const currentName = user.user_metadata.display_name || "";
      const currentEmail = user.email || "";
      const currentPhone = user.user_metadata.phone_number || "";
      const parsed = parsePhoneNumber(currentPhone);
      console.log(parsed);
      const currentPhoneCountry = parsed?.countryCallingCode;
      console.log(typeof currentPhoneCountry);
      const currentNationalNumber = parsed?.nationalNumber;

      setName(currentName);
      setEmail(currentEmail);
      setPhoneNumber(currentPhone ?? "");
      setPhoneCountry(currentPhoneCountry ?? "");

      setOldName(currentName);
      setOldEmail(currentEmail);
      setOldPhone(currentPhone);
    });
  }, []);

  const handleUpdateProfile = async () => {
    const supabase = createClient();
    const payload: any = {};

    // check email (special root field)
    if (email !== oldEmail) {
      payload.email = email;
    }

    // check metadata (name, phone, etc.)
    const metadata: any = {};
    if (name !== oldName) metadata.display_name = name;
    if (phoneNumber !== oldPhone) metadata.phone_number = phoneNumber;

    if (Object.keys(metadata).length > 0) {
      payload.data = metadata;
    }

    if (Object.keys(payload).length === 0) {
      toast.message("No changes to update");
      return;
    }

    console.log(payload);
    try {
      const { error } = await supabase.auth.updateUser(payload);
      if (error) throw error;
      toast.success(
        `Profile updated successfully!${
          payload.email ? "\n\nPlease confirm the email change" : ""
        }`
      );
      // update old values so they match the new state
      setOldName(name);
      setOldEmail(email);
      setOldPhone(phoneNumber);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleResetPassword = () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/callback?next=/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          {/* <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.png" alt="Profile picture" />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button variant="outline">Change Picture</Button>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </div>
          </div> */}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={name || "Your name"}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={email || "Your email"}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput
              className="p-1"
              placeholder={phoneNumber || "(123) 456-7890"}
              defaultCountry="US"
              value={phoneNumber || undefined}
              onChange={(value) => setPhoneNumber(value || "")}
              error={
                phoneNumber
                  ? isValidPhoneNumber(phoneNumber)
                    ? undefined
                    : "Invalid phone number"
                  : "Phone number required"
              }
            />
          </div>

          {/* Password - Redirect button */}
          <div className="space-y-2">
            <Label>Password</Label>
            <Button variant="outline" className="w-fit">
              Change Password
            </Button>
          </div>

          {/* Save Button */}
          <div>
            <Button
              onClick={() => {
                handleUpdateProfile();
              }}
              className="w-full"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deleting your account is permanent and cannot be undone.
          </p>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
