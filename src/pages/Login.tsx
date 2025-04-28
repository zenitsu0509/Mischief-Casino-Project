
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { createUserData } from "@/services/UserService";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        const userCredential = await signup(email, password);
        if (userCredential && userCredential.user) {
          await createUserData(userCredential.user.uid);
        }
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }
      navigate("/");
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

  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-game-panel p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          {isLogin ? "Sign In to Play" : "Create an Account"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center border-b border-game-button/30 pb-2">
              <User className="text-game-gem h-4 w-4 mr-2" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
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
            {isLoading
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-game-gem hover:underline text-sm"
          >
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
