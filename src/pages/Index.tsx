
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Users, Briefcase, MessageSquare, User, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TalentBridge</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900">About Us</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Talent with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Opportunity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The modern recruitment platform that brings together exceptional talent and forward-thinking companies. 
            Find your dream job or discover your next star employee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/applicant-dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                <Search className="mr-2 h-5 w-5" />
                Find Jobs
              </Button>
            </Link>
            <Link to="/recruiter-dashboard">
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3">
                <Users className="mr-2 h-5 w-5" />
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to connect talent with opportunity</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Job Seekers</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Create Your Profile</h4>
                    <p className="text-gray-600">Build your professional profile and upload your resume</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Search & Apply</h4>
                    <p className="text-gray-600">Browse jobs and apply with one click</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Get Hired</h4>
                    <p className="text-gray-600">Connect with recruiters and land your dream job</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Recruiters */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Recruiters</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Post Your Job</h4>
                    <p className="text-gray-600">Create detailed job postings to attract the right talent</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Review Applications</h4>
                    <p className="text-gray-600">Browse candidate profiles and shortlist the best fits</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Hire Top Talent</h4>
                    <p className="text-gray-600">Connect with candidates and build your dream team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600">Everything you need for successful recruitment</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Search className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Smart Job Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced filtering and AI-powered job recommendations to find the perfect match.</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Direct Messaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Connect directly with recruiters and candidates through our built-in messaging system.</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <User className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Professional Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create comprehensive profiles that showcase skills, experience, and achievements.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">What our users say about TalentBridge</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-white p-6">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">"TalentBridge helped me find my dream job in just 2 weeks. The platform is intuitive and the direct messaging feature made connecting with recruiters so easy."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">S</div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Software Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white p-6">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">"As a startup founder, finding the right talent quickly was crucial. TalentBridge's quality candidate pool and easy-to-use interface saved us months of recruitment time."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Michael Chen</p>
                    <p className="text-sm text-gray-600">CEO, TechStart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">TalentBridge</span>
              </div>
              <p className="text-gray-400">Connecting talent with opportunity through innovative recruitment solutions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white">Career Advice</a></li>
                <li><a href="#" className="hover:text-white">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Recruiters</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white">Find Candidates</a></li>
                <li><a href="#" className="hover:text-white">Recruiting Tips</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TalentBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
