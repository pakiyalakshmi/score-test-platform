
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If already logged in, redirect to student page
        navigate("/student");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Record login
          trackLogin(session.user.id);
          
          // Redirect to student page
          navigate("/student");
          toast.success("Login successful");
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const trackLogin = async (studentId: string) => {
    try {
      // Get IP address and user agent
      const ipAddress = "Unknown"; // In a real app, you'd get this from a service
      const userAgent = navigator.userAgent;
      
      // Call edge function to track login
      await supabase.functions.invoke('track-student-login', {
        body: { 
          student_id: studentId,
          action: 'login',
          ip_address: ipAddress,
          user_agent: userAgent
        }
      });
    } catch (error) {
      console.error("Error tracking login:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      
      // Sign in with Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Auth state listener will handle redirect
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      
      // Sign up with Supabase Auth
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'student'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Signup successful! Please check your email for confirmation.");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8 animate-scale-in">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-4xl font-bold text-clinicus-blue mb-2">Clinicus</h1>
            <p className="text-gray-600">Welcome Back!</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-600">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="clinicus-button w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-clinicus-blue hover:underline"
                  onClick={handleSignUp}
                  disabled={loading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
