import { Router } from 'express';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Mock portfolio data
const portfolioData = {
  owner: {
    name: 'John Doe',
    title: 'Full Stack Developer',
    bio: 'Passionate developer with expertise in modern web technologies',
    email: 'john@example.com',
    location: 'San Francisco, CA',
    avatar: 'https://via.placeholder.com/150',
    social: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
    },
  },
  skills: [
    { name: 'JavaScript', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'React', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'Express', level: 80 },
    { name: 'MongoDB', level: 75 },
    { name: 'SQL', level: 70 },
    { name: 'AWS', level: 65 },
  ],
  experience: [
    {
      id: '1',
      role: 'Senior Full Stack Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2020-01',
      endDate: null,
      current: true,
      description: 'Leading development of web applications using React and Node.js.',
    },
    {
      id: '2',
      role: 'Full Stack Developer',
      company: 'Startup Inc',
      location: 'San Francisco, CA',
      startDate: '2018-03',
      endDate: '2019-12',
      current: false,
      description: 'Developed and maintained web applications using MERN stack.',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California',
      location: 'Berkeley, CA',
      startDate: '2014-09',
      endDate: '2018-05',
      description: 'Focused on web development and algorithms.',
    },
  ],
};

/**
 * @route   GET /api/portfolio
 * @desc    Get portfolio data
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: portfolioData,
  });
});

/**
 * @route   PUT /api/portfolio
 * @desc    Update portfolio data
 * @access  Private
 */
router.put('/', authenticate, (req, res) => {
  res.json({
    status: 'success',
    message: 'Portfolio updated successfully',
    data: {
      ...portfolioData,
      ...req.body,
    },
  });
});

export default router;