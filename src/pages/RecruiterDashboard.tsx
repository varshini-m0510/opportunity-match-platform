import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Plus, Briefcase, MessageSquare, Bell, User, Settings, Home, FileText, LogOut, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentJobId, setCurrentJobId] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Job posting form state
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full-time",
    description: "",
    requirements: "",
  });

  // Edit job state
  const [editingJob, setEditingJob] = useState(null);

  const recruiterId = localStorage.getItem("userId");

  // Fetch jobs posted by this recruiter
  const fetchJobs = useCallback(async () => {
    if (!recruiterId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/recruiter/${recruiterId}/jobs`);
      const data = await res.json();
      console.log('Recruiter jobs API response:', data); // Debug log
      // Defensive: ensure jobs is always an array
      if (Array.isArray(data)) {
        setJobs(data);
      } else if (Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
        toast({
          title: "Error",
          description: "Unexpected response from server.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setJobs([]);
      toast({
        title: "Error",
        description: "Failed to fetch jobs.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [recruiterId, toast]);

  // Redirect if recruiterId is missing
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const storedName = localStorage.getItem("userName") || localStorage.getItem("userEmail");
    if (userType !== "recruiter" || !recruiterId) {
      navigate("/login");
      return;
    }
    setUserName(storedName || "User");
    fetchJobs();
  }, [navigate, fetchJobs, recruiterId]);

  // Fetch candidates for selected job (if needed)
  const fetchCandidates = useCallback(async (jobId) => {
    setLoading(true);
    setCurrentJobId(jobId);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/applicants`);
      const data = await res.json();
      // Attach jobId to each candidate for reliable status update
      const candidatesWithJobId = Array.isArray(data)
        ? data.map((c) => ({ ...c, jobId }))
        : [];
      setCandidates(candidatesWithJobId);
    } catch (err) {
      setCandidates([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const storedName = localStorage.getItem("userName") || localStorage.getItem("userEmail");
    
    if (userType !== "recruiter") {
      navigate("/login");
      return;
    }
    
    setUserName(storedName || "User");
    fetchJobs();
  }, [navigate, fetchJobs]);

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

  // Post a new job to the backend
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...jobForm, recruiterId })
      });
      if (res.ok) {
        // Wait for the backend to finish saving before fetching jobs
        await fetchJobs();
        toast({
          title: "Job Posted Successfully!",
          description: "Your job posting is now live and visible to candidates.",
        });
        setJobForm({
          title: "",
          company: "",
          location: "",
          salary: "",
          type: "Full-time",
          description: "",
          requirements: "",
        });
        setActiveTab("manage");
      } else {
        toast({
          title: "Error",
          description: "Failed to post job.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Server error.",
        variant: "destructive",
      });
    }
  };

  // Edit a job
  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
    });
    setActiveTab("post");
  };

  // Save edited job to backend
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingJob) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${editingJob._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...jobForm, recruiterId })
      });
      if (res.ok) {
        toast({ title: "Job updated!", description: "Your job post has been updated." });
        setEditingJob(null);
        setJobForm({
          title: "",
          company: "",
          location: "",
          salary: "",
          type: "Full-time",
          description: "",
          requirements: "",
        });
        setActiveTab("manage");
        fetchJobs();
      } else {
        toast({ title: "Error", description: "Failed to update job.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Server error.", variant: "destructive" });
    }
  };

  const sidebarItems = [
    { title: "Dashboard", icon: Home, key: "dashboard" },
    { title: "Post a Job", icon: Plus, key: "post" },
    { title: "Manage Jobs", icon: FileText, key: "manage" },
    { title: "Candidates", icon: Users, key: "candidates" },
    { title: "Messages", icon: MessageSquare, key: "messages" },
    { title: "Company Profile", icon: User, key: "profile" },
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
                    className={activeTab === item.key ? "bg-purple-100 text-purple-700" : ""}
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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
              <Bell className="h-6 w-6 text-gray-600" />
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">-</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Interviews Scheduled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">-</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Hires This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">-</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-500 text-center py-8">No recent applications to display.</div>
              </CardContent>
            </Card>
          </div>
        );
      case "post":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{editingJob ? "Edit Job" : "Post a New Job"}</h1>
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingJob ? handleSaveEdit : handleJobSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                        placeholder="e.g. Senior Frontend Developer"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                        placeholder="Your company name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                        placeholder="e.g. San Francisco, CA or Remote"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                        placeholder="e.g. $100,000 - $120,000"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      value={jobForm.description}
                      onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                      placeholder="List the required skills, experience, and qualifications..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    {editingJob ? "Save Changes" : "Post Job"}
                  </Button>
                  {editingJob && (
                    <Button type="button" variant="outline" className="ml-2" onClick={() => { setEditingJob(null); setJobForm({ title: "", company: "", location: "", salary: "", type: "Full-time", description: "", requirements: "" }); setActiveTab("manage"); }}>
                      Cancel
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case "manage":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
            {loading ? (
              <Card>
                <CardContent className="text-gray-500 text-center py-8">
                  Loading jobs...
                </CardContent>
              </Card>
            ) : !Array.isArray(jobs) || jobs.length === 0 ? (
              <Card>
                <CardContent className="text-gray-500 text-center py-8">
                  No jobs posted yet.
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <Card key={job._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500 mb-4">
                      <div><span className="font-semibold text-gray-700">Company:</span> {job.company}</div>
                      <div><span className="font-semibold text-gray-700">Location:</span> {job.location}</div>
                      <div><span className="font-semibold text-gray-700">Salary:</span> {job.salary}</div>
                      <div><span className="font-semibold text-gray-700">Type:</span> {job.type}</div>
                      <div><span className="font-semibold text-gray-700">Description:</span> {job.description}</div>
                      <div><span className="font-semibold text-gray-700">Requirements:</span> {job.requirements}</div>
                    </div>
                    <div className="flex gap-2">
                      {String(job.recruiter) === recruiterId && (
                        <>
                          <Button onClick={() => handleEditJob(job)} className="bg-yellow-500 hover:bg-yellow-600">Edit</Button>
                          <Button
                            onClick={async () => {
                              await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ recruiterId })
                              });
                              fetchJobs();
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => {
                          setActiveTab("candidates");
                          fetchCandidates(job._id);
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        View Candidates
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );

      case "candidates":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Candidate Pool</h1>
            {loading ? (
              <Card>
                <CardContent className="text-gray-500 text-center py-8">
                  Loading candidates...
                </CardContent>
              </Card>
            ) : candidates.length === 0 ? (
              <Card>
                <CardContent className="text-gray-500 text-center py-8">
                  No candidates to display.
                </CardContent>
              </Card>
            ) : (
              candidates.map((candidate) => (
                <Card key={candidate._id || candidate.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{candidate.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500 mb-4">
                      <div><span className="font-semibold text-gray-700">Email:</span> {candidate.email}</div>
                      <div><span className="font-semibold text-gray-700">Phone:</span> {candidate.phone}</div>
                      <div><span className="font-semibold text-gray-700">Resume:</span> {candidate.resume}</div>
                      <div><span className="font-semibold text-gray-700">Position:</span> {candidate.position}</div>
                      <div><span className="font-semibold text-gray-700">Experience:</span> {candidate.experience}</div>
                      <div><span className="font-semibold text-gray-700">Location:</span> {candidate.location}</div>
                      <div><span className="font-semibold text-gray-700">Skills:</span> {candidate.skills && candidate.skills.length > 0 ? candidate.skills.join(", ") : "-"}</div>
                      <div><span className="font-semibold text-gray-700">Status:</span> {candidate.status || 'applied'}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700" onClick={async () => {
                        await fetch(`http://localhost:5000/api/jobs/${candidate.jobId}/applicants/${candidate._id || candidate.id}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "shortlist" })
                        });
                        fetchCandidates(candidate.jobId);
                      }}>Shortlist</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
                        await fetch(`http://localhost:5000/api/jobs/${candidate.jobId}/applicants/${candidate._id || candidate.id}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "accept" })
                        });
                        fetchCandidates(candidate.jobId);
                      }}>Accept</Button>
                      <Button className="bg-red-600 hover:bg-red-700" onClick={async () => {
                        await fetch(`http://localhost:5000/api/jobs/${candidate.jobId}/applicants/${candidate._id || candidate.id}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "cancel" })
                        });
                        fetchCandidates(candidate.jobId);
                      }}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );

      case "messages":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No messages yet. Start connecting with candidates!</p>
              </CardContent>
            </Card>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="" />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" placeholder="e.g. Technology, Healthcare" />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="https://yourcompany.com" />
                </div>
                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea id="description" placeholder="Tell candidates about your company..." rows={4} />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
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

export default RecruiterDashboard;
