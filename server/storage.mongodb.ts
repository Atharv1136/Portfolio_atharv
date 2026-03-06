import mongoose from 'mongoose';
import {
  User,
  type IUser,
} from './models/user.model';
import {
  AboutData,
  type IAboutData,
} from './models/about.model';
import {
  Certification,
  type ICertification,
} from './models/certification.model';
import {
  Hackathon,
  type IHackathon,
} from './models/hackathon.model';
import {
  Project,
  type IProject,
} from './models/project.model';
import {
  Blog,
  type IBlog,
} from './models/blog.model';
import {
  Experience,
  type IExperience,
} from './models/experience.model';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: { username: string; password: string }): Promise<IUser>;

  // About methods
  getAboutData(): Promise<IAboutData | null>;
  upsertAboutData(data: {
    bio: string;
    education: string;
    languages: string;
    skills: string[];
    tools: string[];
    resumeUrl?: string;
  }): Promise<IAboutData>;

  // Certification methods
  getAllCertifications(): Promise<ICertification[]>;
  getCertification(id: string): Promise<ICertification | null>;
  createCertification(cert: Partial<ICertification>): Promise<ICertification>;
  updateCertification(id: string, cert: Partial<ICertification>): Promise<ICertification | null>;
  deleteCertification(id: string): Promise<boolean>;

  // Hackathon methods
  getAllHackathons(): Promise<IHackathon[]>;
  getHackathon(id: string): Promise<IHackathon | null>;
  createHackathon(hackathon: Partial<IHackathon>): Promise<IHackathon>;
  updateHackathon(id: string, hackathon: Partial<IHackathon>): Promise<IHackathon | null>;
  deleteHackathon(id: string): Promise<boolean>;

  // Project methods
  getAllProjects(): Promise<IProject[]>;
  getProject(id: string): Promise<IProject | null>;
  createProject(project: Partial<IProject>): Promise<IProject>;
  updateProject(id: string, project: Partial<IProject>): Promise<IProject | null>;
  deleteProject(id: string): Promise<boolean>;

  // Blog methods
  getAllBlogs(onlyPublished?: boolean): Promise<IBlog[]>;
  getBlogBySlug(slug: string): Promise<IBlog | null>;
  getBlogById(id: string): Promise<IBlog | null>;
  createBlog(blog: Partial<IBlog>): Promise<IBlog>;
  updateBlog(id: string, blog: Partial<IBlog>): Promise<IBlog | null>;
  deleteBlog(id: string): Promise<boolean>;

  // Experience methods
  getAllExperiences(): Promise<IExperience[]>;
  getExperience(id: string): Promise<IExperience | null>;
  createExperience(data: Partial<IExperience>): Promise<IExperience>;
  updateExperience(id: string, data: Partial<IExperience>): Promise<IExperience | null>;
  deleteExperience(id: string): Promise<boolean>;
}

export class MongoDBStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      const searchUsername = username.trim();
      console.log('🔍 MongoDB getUserByUsername:', {
        searched: searchUsername,
        mongooseReady: mongoose.connection.readyState,
        dbName: mongoose.connection.db?.databaseName
      });

      // Check if MongoDB is connected
      if (mongoose.connection.readyState !== 1) {
        console.error('❌ MongoDB not connected! ReadyState:', mongoose.connection.readyState);
        throw new Error('MongoDB not connected');
      }

      const user = await User.findOne({ username: searchUsername });
      console.log('🔍 getUserByUsername result:', {
        searched: searchUsername,
        found: user ? 'yes' : 'no',
        userId: user?._id,
        username: user?.username
      });
      return user;
    } catch (error: any) {
      console.error('❌ Error in getUserByUsername:', error.message);
      throw error;
    }
  }

  async createUser(user: { username: string; password: string }): Promise<IUser> {
    const newUser = new User(user);
    return await newUser.save();
  }

  // About methods
  async getAboutData(): Promise<IAboutData | null> {
    return await AboutData.findOne();
  }

  async upsertAboutData(data: {
    bio: string;
    education: string;
    languages: string;
    skills: string[];
    tools: string[];
    resumeUrl?: string;
  }): Promise<IAboutData> {
    const existing = await this.getAboutData();
    if (existing) {
      Object.assign(existing, data, { updatedAt: new Date() });
      return await existing.save();
    } else {
      const aboutData = new AboutData(data);
      return await aboutData.save();
    }
  }

  // Certification methods
  async getAllCertifications(): Promise<ICertification[]> {
    return await Certification.find().sort({ displayOrder: 1 });
  }

  async getCertification(id: string): Promise<ICertification | null> {
    return await Certification.findById(id);
  }

  async createCertification(cert: Partial<ICertification>): Promise<ICertification> {
    const newCert = new Certification(cert);
    return await newCert.save();
  }

  async updateCertification(id: string, cert: Partial<ICertification>): Promise<ICertification | null> {
    const updated = await Certification.findByIdAndUpdate(
      id,
      { ...cert, updatedAt: new Date() },
      { new: true }
    );
    return updated;
  }

  async deleteCertification(id: string): Promise<boolean> {
    const result = await Certification.findByIdAndDelete(id);
    return result !== null;
  }

  // Hackathon methods
  async getAllHackathons(): Promise<IHackathon[]> {
    return await Hackathon.find().sort({ displayOrder: 1 });
  }

  async getHackathon(id: string): Promise<IHackathon | null> {
    return await Hackathon.findById(id);
  }

  async createHackathon(hackathon: Partial<IHackathon>): Promise<IHackathon> {
    const newHackathon = new Hackathon(hackathon);
    return await newHackathon.save();
  }

  async updateHackathon(id: string, hackathon: Partial<IHackathon>): Promise<IHackathon | null> {
    const updated = await Hackathon.findByIdAndUpdate(
      id,
      { ...hackathon, updatedAt: new Date() },
      { new: true }
    );
    return updated;
  }

  async deleteHackathon(id: string): Promise<boolean> {
    const result = await Hackathon.findByIdAndDelete(id);
    return result !== null;
  }

  // Project methods
  async getAllProjects(): Promise<IProject[]> {
    return await Project.find().sort({ displayOrder: 1 });
  }

  async getProject(id: string): Promise<IProject | null> {
    return await Project.findById(id);
  }

  async createProject(project: Partial<IProject>): Promise<IProject> {
    const newProject = new Project(project);
    return await newProject.save();
  }

  async updateProject(id: string, project: Partial<IProject>): Promise<IProject | null> {
    const updated = await Project.findByIdAndUpdate(
      id,
      { ...project, updatedAt: new Date() },
      { new: true }
    );
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await Project.findByIdAndDelete(id);
    return result !== null;
  }

  // Blog methods
  async getAllBlogs(onlyPublished = false): Promise<IBlog[]> {
    const query = onlyPublished ? { isPublished: true } : {};
    return await Blog.find(query).sort({ createdAt: -1 });
  }

  async getBlogBySlug(slug: string): Promise<IBlog | null> {
    return await Blog.findOne({ slug });
  }

  async getBlogById(id: string): Promise<IBlog | null> {
    return await Blog.findById(id);
  }

  async createBlog(blog: Partial<IBlog>): Promise<IBlog> {
    const newBlog = new Blog(blog);
    return await newBlog.save();
  }

  async updateBlog(id: string, blog: Partial<IBlog>): Promise<IBlog | null> {
    const updated = await Blog.findByIdAndUpdate(
      id,
      { ...blog, updatedAt: new Date() },
      { new: true }
    );
    return updated;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await Blog.findByIdAndDelete(id);
    return result !== null;
  }

  // Experience methods
  async getAllExperiences(): Promise<IExperience[]> {
    return await Experience.find().sort({ displayOrder: 1 });
  }

  async getExperience(id: string): Promise<IExperience | null> {
    return await Experience.findById(id);
  }

  async createExperience(data: Partial<IExperience>): Promise<IExperience> {
    const exp = new Experience(data);
    return await exp.save();
  }

  async updateExperience(id: string, data: Partial<IExperience>): Promise<IExperience | null> {
    return await Experience.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteExperience(id: string): Promise<boolean> {
    const result = await Experience.findByIdAndDelete(id);
    return result !== null;
  }
}

export const storage = new MongoDBStorage();



