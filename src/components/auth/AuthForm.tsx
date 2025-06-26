import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
} from "lucide-react";

export function AuthForm() {
  const { signIn, signUp, loading, error, user } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "test@example.com", // Pre-filled for test user
    password: "test123", // Pre-filled for test user
  });
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect to dashboard after successful login
  useEffect(() => {
    if (user) {
      router.navigate({ to: "/dashboard" });
    }
  }, [user, router]);

  const handleSubmit = async (
    e: React.FormEvent,
    action: "signin" | "signup"
  ) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.email || !formData.password) {
      setLocalError("Bitte füllen Sie alle Felder aus");
      return;
    }

    try {
      let result;
      if (action === "signin") {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password);
      }

      if (result.error) {
        setLocalError(result.error.message);
      }
    } catch (err) {
      setLocalError("Ein unerwarteter Fehler ist aufgetreten");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setLocalError(null);
  };

  const displayError = localError || error?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
          >
            <span className="text-2xl font-bold text-white">€</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FinanzPlaner
          </h1>
          <p className="text-gray-600">
            Verwalten Sie Ihre Finanzen intelligent
          </p>
        </div>

        <Card className="w-full">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Anmelden</TabsTrigger>
              <TabsTrigger value="signup">Registrieren</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Anmelden
                </CardTitle>
                <CardDescription>
                  Melden Sie sich mit Ihren Zugangsdaten an
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => handleSubmit(e, "signin")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-Mail</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="test@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Passwort</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="test"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        disabled={loading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird angemeldet...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Anmelden
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Registrieren
                </CardTitle>
                <CardDescription>Erstellen Sie ein neues Konto</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => handleSubmit(e, "signup")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-Mail</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="ihre@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Passwort</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mindestens 6 Zeichen"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        disabled={loading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird registriert...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Registrieren
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>

          {displayError && (
            <div className="px-6 pb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            </div>
          )}
        </Card>

        <div className="text-center mt-4 text-sm text-gray-600">
          <p>Demo-Zugangsdaten:</p>
          <p>
            <strong>E-Mail:</strong> test@example.com
          </p>
          <p>
            <strong>Passwort:</strong> test123
          </p>
        </div>
      </motion.div>
    </div>
  );
}
