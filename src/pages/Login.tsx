import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/AuthService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, signup, currentUser, refreshUserState } = useAuth();

  useEffect(() => {
    // Refresh user state on component mount
    refreshUserState();
    
    // If already logged in, redirect to home
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate, refreshUserState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isChangePassword) {
        // Handle password change
        const success = await AuthService.changePassword(username, oldPassword, newPassword);
        if (success) {
          toast({
            title: "Password Changed",
            description: "Your password has been changed successfully.",
          });
          setIsChangePassword(false);
          setIsLogin(true);
        }
      } else if (isLogin) {
        // Handle login using AuthContext
        const user = await login(username, password);
        if (user) {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate("/");
        }
      } else {
        // Handle signup using AuthContext
        const user = await signup(username, password);
        if (user) {
          toast({
            title: "Account created!",
            description: "Your account has been created successfully.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center border-b border-game-button/30 pb-2">
          <User className="text-game-gem h-4 w-4 mr-2" />
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="bg-transparent border-none focus-visible:ring-0 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center border-b border-game-button/30 pb-2">
          <Lock className="text-game-gem h-4 w-4 mr-2" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="bg-transparent border-none focus-visible:ring-0 text-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-game-button hover:bg-opacity-90 text-black"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );

  const renderChangePasswordForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center border-b border-game-button/30 pb-2">
          <User className="text-game-gem h-4 w-4 mr-2" />
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="bg-transparent border-none focus-visible:ring-0 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center border-b border-game-button/30 pb-2">
          <Lock className="text-game-gem h-4 w-4 mr-2" />
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Current Password"
            required
            className="bg-transparent border-none focus-visible:ring-0 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center border-b border-game-button/30 pb-2">
          <Lock className="text-game-gem h-4 w-4 mr-2" />
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            className="bg-transparent border-none focus-visible:ring-0 text-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-game-button hover:bg-opacity-90 text-black"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Change Password"}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-game-panel p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          {isChangePassword 
            ? "Change Password" 
            : isLogin 
            ? "Sign In to Play" 
            : "Create an Account"}
        </h1>
        
        {isChangePassword ? renderChangePasswordForm() : renderLoginForm()}

        <div className="text-center mt-4">
          {isChangePassword ? (
            <button
              type="button"
              onClick={() => {
                setIsChangePassword(false);
                setIsLogin(true);
              }}
              className="text-game-gem hover:underline text-sm"
            >
              Back to Login
            </button>
          ) : isLogin ? (
            <div className="space-y-2">
              <div>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-game-gem hover:underline text-sm"
                >
                  Need an account? Sign Up
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePassword(true);
                    setIsLogin(false);
                  }}
                  className="text-game-gem hover:underline text-sm"
                >
                  Forgot password? Change Password
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="text-game-gem hover:underline text-sm"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
