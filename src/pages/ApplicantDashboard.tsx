import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, MessageSquare, Bell, User, Settings, Home, FileText, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApplicantDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("");
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState({
    name: "",
    position: "",
    experience: "",
    location: "",
    skills: [],
    phone: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = localStorage.getItem("userId");

  // Defensive: check for missing userId
  if (!userId) {
    toast({ title: "Error", description: "User not logged in. Please log in again." });
    navigate("/login");
  }

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const storedName = localStorage.getItem("userName") || localStorage.getItem("userEmail");
    
    if (userType !== "applicant") {
      navigate("/login");
      return;
    }
    
    setUserName(storedName || "User");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate("/");
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      setJobs([]);
    }
    setLoading(false);
  }, []);

  const fetchAppliedJobs = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/applications`);
      const data = await res.json();
      setAppliedJobs(data);
    } catch (err) {
      setAppliedJobs([]);
    }
  }, [userId]);

  const fetchCandidateProfile = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/candidates`);
      const data = await res.json();
      // Find the candidate by userName
      const candidate = data.find((c) => c.name === userName);
      if (candidate) setCandidateProfile(candidate);
    } catch (err) {}
  }, [userName]);

  const saveCandidateProfile = async () => {
    try {
      await fetch(`http://localhost:5000/api/candidates/${candidateProfile._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateProfile)
      });
      toast({ title: "Profile updated!" });
      fetchCandidateProfile();
    } catch (err) {
      toast({ title: "Error", description: "Failed to update profile." });
    }
  };

  // Fetch application status for a job
  const fetchApplicationStatus = useCallback(async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/applicants/${userId}/status`);
      const data = await res.json();
      return data.status;
    } catch (err) {
      return 'applied';
    }
  }, [userId]);

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
    fetchCandidateProfile();
  }, [fetchJobs, fetchAppliedJobs, fetchCandidateProfile]);

  const sidebarItems = [
    { title: "Dashboard", icon: Home, key: "dashboard" },
    { title: "Search Jobs", icon: Search, key: "search" },
    { title: "Applied Jobs", icon: FileText, key: "applied" },
    { title: "Messages", icon: MessageSquare, key: "messages" },
    { title: "Profile", icon: User, key: "profile" },
    { title: "Settings", icon: Settings, key: "settings" },
  ];

  const AppSidebar = () => (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            TalentBridge
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.key)}
                    className={activeTab === item.key ? "bg-blue-100 text-blue-700" : ""}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  // Search jobs by title, company, or location
  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.title?.toLowerCase().includes(term) ||
      job.company?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term)
    );
  });

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
              <Bell className="h-6 w-6 text-gray-600" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Applications Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{appliedJobs.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Interviews Scheduled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">-</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Profile Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">-</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <p className="text-gray-500 text-center py-4">Loading jobs...</p>
                  ) : jobs.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No jobs found. Please check back later.</p>
                  ) : (
                    jobs.map((job) => (
                      <div key={job._id || job.id} className="flex justify-between items-center p-4 border-b">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.company}</p>
                        </div>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          onClick={async () => {
                            try {
                              const res = await fetch("http://localhost:5000/api/apply", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ userId, jobId: job._id || job.id })
                              });
                              const data = await res.json();
                              if (res.ok) {
                                toast({ title: "Success", description: data.message });
                                fetchAppliedJobs();
                              } else {
                                toast({ title: "Error", description: data.error || "Failed to apply." });
                              }
                            } catch (err) {
                              toast({ title: "Error", description: "Server error." });
                            }
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "search":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Search Jobs</h1>
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Search for jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {}}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No jobs found for your search.</p>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job._id || job.id} className="flex justify-between items-center p-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      onClick={async () => {
                        try {
                          const res = await fetch("http://localhost:5000/api/apply", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId, jobId: job._id || job.id })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            toast({ title: "Success", description: data.message });
                            fetchAppliedJobs();
                          } else {
                            toast({ title: "Error", description: data.error || "Failed to apply." });
                          }
                        } catch (err) {
                          toast({ title: "Error", description: "Server error." });
                        }
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "applied":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
            <div className="space-y-4">
              {appliedJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">You haven't applied to any jobs yet.</p>
                  </CardContent>
                </Card>
              ) : (
                appliedJobs.map((job) => (
                  <AppliedJobCard key={job._id || job.id} job={job} fetchApplicationStatus={fetchApplicationStatus} />
                ))
              )}
            </div>
          </div>
        );

      case "messages":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No messages yet. Start applying to jobs to connect with recruiters!</p>
              </CardContent>
            </Card>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input value={candidateProfile.name} onChange={e => setCandidateProfile({ ...candidateProfile, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input value={candidateProfile.phone || ""} onChange={e => setCandidateProfile({ ...candidateProfile, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <Input value={candidateProfile.position || ""} onChange={e => setCandidateProfile({ ...candidateProfile, position: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <Input value={candidateProfile.experience || ""} onChange={e => setCandidateProfile({ ...candidateProfile, experience: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input value={candidateProfile.location || ""} onChange={e => setCandidateProfile({ ...candidateProfile, location: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                  <Input value={candidateProfile.skills ? candidateProfile.skills.join(", ") : ""} onChange={e => setCandidateProfile({ ...candidateProfile, skills: e.target.value.split(",").map(s => s.trim()) })} />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveCandidateProfile}>Save Changes</Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-50">
          <div className="p-6">
            <SidebarTrigger className="mb-4" />
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

// Helper component for applied jobs with status
function AppliedJobCard({ job, fetchApplicationStatus }) {
  const [status, setStatus] = useState('applied');
  useEffect(() => {
    fetchApplicationStatus(job._id || job.id).then(setStatus);
  }, [job, fetchApplicationStatus]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{job.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-700">
          <p className="mb-2">Company: {job.company}</p>
          <Badge variant="outline" className="text-sm">
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default ApplicantDashboard;
