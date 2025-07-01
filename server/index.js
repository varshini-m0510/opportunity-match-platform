import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/opportunity-match', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Update User schema to include password, userType, applications, and resume
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userType: String, // 'applicant' or 'recruiter'
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  resume: String, // URL or file path
  skills: [String]
});
const User = mongoose.model('User', UserSchema);

// Update Job schema to include recruiter reference and applicants
const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: String,
  type: String,
  posted: String,
  description: String,
  requirements: String, // Added requirements field
  status: String,
  applications: Number,
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  applicantStatuses: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['applied', 'shortlisted', 'accepted', 'cancelled'], default: 'applied' }
  }]
});
const Job = mongoose.model('Job', JobSchema);

// Candidate model
const CandidateSchema = new mongoose.Schema({
  name: String,
  position: String,
  experience: String,
  location: String,
  skills: [String],
  phone: String // Added phone number
});
const Candidate = mongoose.model('Candidate', CandidateSchema);

// Recruiter model
const RecruiterSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
});
const Recruiter = mongoose.model('Recruiter', RecruiterSchema);

// Sample route
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all jobs
app.get('/api/jobs', async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

// Get all candidates
app.get('/api/candidates', async (req, res) => {
  const candidates = await Candidate.find();
  res.json(candidates);
});

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, userType, resume } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = new User({ name, email, password, userType, resume, applications: [] });
    await user.save();
    let recruiter = null;
    let candidate = null;
    if (userType === 'recruiter') {
      recruiter = new Recruiter({ name, email, password, jobs: [] });
      await recruiter.save();
    } else if (userType === 'applicant') {
      candidate = new Candidate({ name, position: '', experience: '', location: '', skills: [] });
      await candidate.save();
    }
    // Return recruiterId if recruiter, candidateId if applicant, else null
    res.status(201).json({ ...user.toObject(), recruiterId: recruiter ? recruiter._id : null, candidateId: candidate ? candidate._id : null });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Apply to a job (for applicants)
app.post('/api/apply', async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const user = await User.findById(userId);
    const job = await Job.findById(jobId);
    if (!user || !job) return res.status(404).json({ error: 'User or Job not found' });
    // Add job to user's application history
    if (!user.applications.includes(jobId)) {
      user.applications.push(jobId);
      await user.save();
    }
    // Add user to job's applicants
    if (!job.applicants.includes(userId)) {
      job.applicants.push(userId);
      await job.save();
    }
    // Add job to Candidate's application history
    const candidate = await Candidate.findOne({ name: user.name });
    if (candidate && (!candidate.applications || !candidate.applications.includes(jobId))) {
      if (!candidate.applications) candidate.applications = [];
      candidate.applications.push(jobId);
      await candidate.save();
    }
    // Simulate sending applicant info to recruiter (could be email/notification in real app)
    // For now, log to server and include in response
    const recruiter = await Recruiter.findById(job.recruiter);
    if (recruiter) {
      console.log(`Applicant ${user.name} (${user.email}) applied to job '${job.title}' (Recruiter: ${recruiter.email})`);
    }
    res.json({
      message: 'Applied successfully! Your application has been sent to the recruiter.',
      applications: user.applications,
      applicant: {
        name: user.name,
        email: user.email,
        resume: user.resume
      },
      recruiter: recruiter ? recruiter.email : null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a route to create a job and associate it with a recruiter
app.post('/api/jobs', async (req, res) => {
  try {
    const { recruiterId, ...jobData } = req.body;
    // Set recruiter field on job creation
    const job = new Job({ ...jobData, recruiter: recruiterId });
    await job.save();
    if (recruiterId) {
      const recruiter = await Recruiter.findById(recruiterId);
      if (recruiter) {
        recruiter.jobs.push(job._id);
        await recruiter.save();
      }
    }
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    let recruiterId = null;
    let candidateId = null;
    if (user.userType === 'recruiter') {
      const recruiter = await Recruiter.findOne({ email });
      recruiterId = recruiter ? recruiter._id : null;
    } else if (user.userType === 'applicant') {
      const candidate = await Candidate.findOne({ name: user.name });
      candidateId = candidate ? candidate._id : null;
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      resume: user.resume,
      applications: user.applications,
      recruiterId,
      candidateId
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get jobs posted by a recruiter
app.get('/api/recruiter/:recruiterId/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.params.recruiterId });
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit a job post (recruiter only)
app.put('/api/jobs/:jobId', async (req, res) => {
  try {
    const { recruiterId, ...updateFields } = req.body;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (!recruiterId || String(job.recruiter) !== recruiterId) {
      return res.status(403).json({ error: 'Unauthorized: Only the recruiter who posted this job can edit it.' });
    }
    Object.assign(job, updateFields);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel (delete) a job post (recruiter only)
app.delete('/api/jobs/:jobId', async (req, res) => {
  try {
    const { recruiterId } = req.body;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (!recruiterId || String(job.recruiter) !== recruiterId) {
      return res.status(403).json({ error: 'Unauthorized: Only the recruiter who posted this job can delete it.' });
    }
    await Job.findByIdAndDelete(req.params.jobId);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get applicants for a job (with full profile and status)
app.get('/api/jobs/:jobId/applicants', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate({ path: 'applicants', model: 'User' })
      .populate({ path: 'applicantStatuses.user', model: 'User' });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    // Merge applicant profile and status
    const applicants = job.applicants.map(applicant => {
      const statusObj = job.applicantStatuses.find(s => s.user && s.user._id.toString() === applicant._id.toString());
      return {
        ...applicant.toObject(),
        status: statusObj ? statusObj.status : 'applied'
      };
    });
    res.json(applicants);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Shortlist, accept, or cancel an application
app.post('/api/jobs/:jobId/applicants/:userId', async (req, res) => {
  try {
    const { action } = req.body; // 'shortlist', 'accept', or 'cancel'
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    // Find or create status entry
    let statusObj = job.applicantStatuses.find(s => s.user.toString() === req.params.userId);
    if (!statusObj) {
      statusObj = { user: req.params.userId, status: 'applied' };
      job.applicantStatuses.push(statusObj);
    }
    if (action === 'shortlist') {
      statusObj.status = 'shortlisted';
    } else if (action === 'accept') {
      statusObj.status = 'accepted';
    } else if (action === 'cancel') {
      statusObj.status = 'cancelled';
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
    await job.save();
    res.json({ message: `Applicant ${action}ed`, status: statusObj.status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Candidate: update skills
app.put('/api/users/:userId/skills', async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { $set: { skills } }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Candidate: get jobs, apply, and see application history
app.get('/api/user/:userId/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users/:userId/applications', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('applications');
    res.json(user ? user.applications : []);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update candidate profile
app.put('/api/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove Alice from users on server start (if present)
(async () => {
  try {
    await User.deleteOne({ email: 'alice@example.com' });
    console.log('Test user Alice removed (if existed)');
  } catch (err) {
    console.error('Error removing test user Alice:', err);
  }
})();

// Get application status for a user and job
app.get('/api/jobs/:jobId/applicants/:userId/status', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const statusObj = job.applicantStatuses.find(s => s.user.toString() === req.params.userId);
    return res.json({ status: statusObj ? statusObj.status : 'applied' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
