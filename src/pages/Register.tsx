import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("applicant");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      try {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, userType })
        });
        if (res.ok) {
          const user = await res.json();
          localStorage.setItem('userType', user.userType);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userName', user.name);
          toast({
            title: 'Registration Successful',
            description: 'Welcome to TalentBridge!',
          });
          if (user.userType === 'recruiter') {
            navigate('/recruiter-dashboard');
          } else {
            navigate('/applicant-dashboard');
          }
        } else {
          const err = await res.json();
          toast({
            title: 'Registration Failed',
            description: err.error || 'Please fill in all fields.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Registration Failed',
          description: 'Server error.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Registration Failed',
        description: 'Please fill in all fields.',
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
          <CardTitle className="text-2xl font-bold">Join TalentBridge</CardTitle>
          <p className="text-gray-600">Create your account to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label className="text-base font-medium">I am a:</Label>
              <RadioGroup value={userType} onValueChange={setUserType} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="applicant" id="applicant" />
                  <Label htmlFor="applicant">Job Seeker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recruiter" id="recruiter" />
                  <Label htmlFor="recruiter">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
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

export default Register;
