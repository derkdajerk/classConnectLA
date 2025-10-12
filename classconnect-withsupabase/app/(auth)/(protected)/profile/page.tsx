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
import BottomNavBarMobile from "@/components/BottomNavBarMobile";

export default function ProfileSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldName, setOldName] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [oldPhone, setOldPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if screen is mobile size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          payload.email
            ? "\n\nPlease confirm the email change in your inbox"
            : ""
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

  const handleResetPassword = async () => {
    const supabase = createClient();

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(oldEmail, {
        redirectTo: `${window.location.origin}/callback?next=/update-password`,
      });
      if (error) throw error;
      toast.success("Check your email, password reset instructions sent");
      setSuccess(true);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    // Confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will remove all your saved classes and calendar data."
    );

    if (!confirmed) return;

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      toast.error("Failed to get user information");
      return;
    }

    const userId = data?.user.id;
    if (!userId) {
      toast.error("No user ID found");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/users/deleteAccount", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete account");
      }

      toast.success("Account deleted successfully");

      // Logout and redirect to home
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete account"
      );
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
            <Button
              onClick={() => {
                handleResetPassword();
              }}
              variant="outline"
              className="w-fit"
            >
              Change Password
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}

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
          <Button
            variant="destructive"
            className="w-full"
            onClick={deleteAccount}
            disabled={isLoading}
          >
            {isLoading ? "Deleting Account..." : "Delete Account"}
          </Button>
        </CardContent>
      </Card>

      {isMobile && <BottomNavBarMobile />}
    </div>
  );
}
