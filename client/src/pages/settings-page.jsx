import { useState } from "react";
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui";
import { Lock, Unlock, LogOut, Key } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const passwordForm = useForm();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const baseUrlTest = "api/auth"

  const handlePasswordChange = async (data) => {
    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        toast({
          title: "Error",
          description: "You are not authenticated. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const response = await customFetch(
        `${baseUrlTest}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        }
      );

      toast({
        title: "Success",
        description: response.message || "Password changed successfully!",
        variant: "success",
      });

      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while changing the password.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer title="Change Password">
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md p-6 rounded-3xl shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="text-center py-6">
            <div className="flex justify-center items-center mb-4">
              <Key className="h-10 w-10 text-indigo-600 animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-indigo-600">
              Change Password
            </CardTitle>
            <CardDescription className="text-gray-500">
              Secure your account by updating your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                className="space-y-6"
              >
                <FormField
                  name="currentPassword"
                  control={passwordForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-indigo-500" />
                        Current Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            {...field}
                            className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowCurrentPassword((v) => !v)}
                        >
                          {showCurrentPassword ? (
                            <Unlock className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
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
                      <FormLabel className="text-gray-700 flex items-center gap-2">
                        <Unlock className="h-5 w-5 text-indigo-500" />
                        New Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            {...field}
                            className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowNewPassword((v) => !v)}
                        >
                          {showNewPassword ? (
                            <Unlock className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <div className="text-center py-4">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-red-500 flex items-center justify-center gap-2"
              onClick={() => {
                Cookies.remove("accessToken");
                window.location.reload();
              }}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}