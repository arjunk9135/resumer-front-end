import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { customFetch } from "@/utils/api";
import PageContainer from "@/components/layout/page-container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui";
import { Eye, EyeOff, LogOut, Upload } from "lucide-react";

// Example SVG background for the card container
const cardBg =
  "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%), url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  // Password form
  const passwordForm = useForm();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Avatar upload
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);

  const handleProfileUpdate = async (data) => {
    try {
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        avatarUrl = URL.createObjectURL(avatarFile);
      }
      await customFetch("/api/user/profile", {
        method: "PATCH",
        body: { ...data, avatar: avatarUrl },
      });
      toast({ title: "Profile updated!" });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      await customFetch("/api/user/password", {
        method: "POST",
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });
      toast({ title: "Password changed!" });
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    logout();
  };

  return (
    <PageContainer title="Settings">
      <div
        className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-0 md:p-0"
        style={{
          background: cardBg,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        <div className="px-6 py-8 md:px-10 md:py-12">
          {/* Profile Card */}
          <div className="mb-8">
            <div className="flex flex-col items-center gap-2 mb-6">
              <Avatar className="h-20 w-20 ring-4 ring-indigo-300 shadow-lg">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Change Photo
                </Button>
              </label>
            </div>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                className="space-y-4"
              >
                <FormField
                  name="fullName"
                  control={profileForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="rounded-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={profileForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} className="rounded-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Password Card */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Change Password</h2>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                className="space-y-4"
              >
                <FormField
                  name="currentPassword"
                  control={passwordForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword((v) => !v)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="newPassword"
                  control={passwordForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            {...field}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword((v) => !v)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
                    Change Password
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Logout */}
          <div className="flex justify-end">
            <Button variant="ghost" className="text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}