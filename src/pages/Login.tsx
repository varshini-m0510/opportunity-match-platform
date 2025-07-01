import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const user = await res.json();
          localStorage.setItem('userType', user.userType);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userId', user._id); // Store userId for dashboard access
          toast({
            title: 'Login Successful',
            description: 'Welcome back to TalentBridge!',
          });
          if (user.userType === 'recruiter') {
            navigate('/recruiter-dashboard');
          } else {
            navigate('/applicant-dashboard');
          }
        } else {
          const err = await res.json();
          toast({
            title: 'Login Failed',
            description: err.error || 'Please enter valid credentials.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Login Failed',
          description: 'Server error.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Login Failed',
        description: 'Please enter valid credentials.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-gray-600">Sign in to your TalentBridge account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Demo: Use any email (include "recruiter" for recruiter access)
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Link to="/" className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
