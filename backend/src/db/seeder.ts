import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Project, Portfolio } from './models';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

/**
 * Seed the database with initial data
 */
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI;
    
    if (!dbUri) {
      logger.error('MongoDB URI is not defined in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(dbUri);
    logger.info('MongoDB Connected for seeding');
    
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Portfolio.deleteMany({});
    
    logger.info('Database cleared');
    
    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    
    logger.info(`Admin user created: ${admin.email}`);
    
    // Create portfolio data
    const portfolio = await Portfolio.create({
      owner: {
        name: 'Jade Sieb',
        title: 'Software Engineering Graduate',
        bio: 'Passionate developer with expertise in modern web technologies. I specialize in creating responsive, user-friendly web applications using React, Node.js, and other cutting-edge technologies. With a strong foundation in both frontend and backend development, I deliver complete solutions that meet business needs and provide exceptional user experiences.',
        email: 'trenton@sieb.net',
        location: 'Vancouver, BC',
        avatar: 'https://via.placeholder.com/150',
        social: {
          github: 'https://github.com/tsieb',
          linkedin: 'https://linkedin.com/in/trenton-sieb',
          twitter: 'https://twitter.com/not_a_real_account_just_placeholder_12345135',
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
          role: 'Senior Full Stack Developer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          startDate: '2020-01',
          endDate: null,
          current: true,
          description: 'Leading development of web applications using React and Node.js.',
        },
        {
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
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of California',
          location: 'Berkeley, CA',
          startDate: '2014-09',
          endDate: '2018-05',
          description: 'Focused on web development and algorithms.',
        },
      ],
    });
    
    logger.info('Portfolio data created');
    
    // Create sample projects
    const projects = await Project.insertMany([
      {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform built with MERN stack, featuring user authentication, shopping cart, product catalog, and payment processing.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Stripe'],
        image: 'https://via.placeholder.com/800x500',
        githubUrl: 'https://github.com/johndoe/ecommerce',
        liveUrl: 'https://ecommerce-demo.example.com',
        featured: true,
      },
      {
        title: 'Task Management App',
        description: 'A task management application with drag-and-drop interface, real-time updates, and team collaboration features.',
        technologies: ['React', 'Redux', 'Node.js', 'Socket.io', 'PostgreSQL'],
        image: 'https://via.placeholder.com/800x500',
        githubUrl: 'https://github.com/johndoe/taskapp',
        liveUrl: 'https://taskapp-demo.example.com',
        featured: true,
      },
      {
        title: 'Weather Dashboard',
        description: 'A weather dashboard that displays current weather conditions and forecasts for multiple locations, using weather API data.',
        technologies: ['JavaScript', 'HTML', 'CSS', 'API Integration'],
        image: 'https://via.placeholder.com/800x500',
        githubUrl: 'https://github.com/johndoe/weather',
        liveUrl: 'https://weather-demo.example.com',
        featured: false,
      },
      {
        title: 'Personal Blog',
        description: 'A blog platform with content management system, comment system, and markdown support.',
        technologies: ['Next.js', 'React', 'Node.js', 'MongoDB'],
        image: 'https://via.placeholder.com/800x500',
        githubUrl: 'https://github.com/johndoe/blog',
        liveUrl: 'https://blog-demo.example.com',
        featured: false,
      },
      {
        title: 'Recipe Finder',
        description: 'A recipe finder application that allows users to search for recipes by ingredients, dietary restrictions, and meal types.',
        technologies: ['React', 'TypeScript', 'Firebase'],
        image: 'https://via.placeholder.com/800x500',
        githubUrl: 'https://github.com/johndoe/recipes',
        liveUrl: 'https://recipes-demo.example.com',
        featured: false,
      },
    ]);
    
    logger.info(`${projects.length} sample projects created`);
    
    logger.info('Database seeding completed successfully');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected after seeding');
    
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error}`);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();