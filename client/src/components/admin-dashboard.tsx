import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Trash2, Save, Edit2, Eye, FileText } from 'lucide-react';
import { useLocation } from "wouter";

interface AdminDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ open, onOpenChange, onLogout }: AdminDashboardProps) {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('about');

  // Fetch data
  const { data: aboutData } = useQuery<any>({
    queryKey: ['/api/about'],
    enabled: open && activeTab === 'about',
  });

  const { data: certifications, refetch: refetchCerts } = useQuery<any[]>({
    queryKey: ['/api/certifications'],
    enabled: open && activeTab === 'certifications',
  });

  const { data: hackathons, refetch: refetchHackathons } = useQuery<any[]>({
    queryKey: ['/api/hackathons'],
    enabled: open && activeTab === 'hackathons',
  });

  const { data: projects, refetch: refetchProjects } = useQuery<any[]>({
    queryKey: ['/api/projects'],
    enabled: open && activeTab === 'projects',
  });

  const { data: blogs, refetch: refetchBlogs } = useQuery<any[]>({
    queryKey: ['/api/admin/blogs'], // Use admin endpoint to get all blogs
    enabled: open && activeTab === 'blog',
  });

  // Edit states
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [editingHackathon, setEditingHackathon] = useState<any | null>(null);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  // About form state
  const [aboutForm, setAboutForm] = useState({
    bio: '',
    education: '',
    languages: '',
    skills: [] as string[],
    tools: [] as string[],
    resumeUrl: '',
  });

  // Initialize form when data loads
  useEffect(() => {
    if (aboutData) {
      setAboutForm({
        bio: aboutData.bio || '',
        education: aboutData.education || '',
        languages: aboutData.languages || '',
        skills: aboutData.skills || [],
        tools: aboutData.tools || [],
        resumeUrl: aboutData.resumeUrl || '',
      });
    }
  }, [aboutData]);

  // Save About mutation
  const saveAboutMutation = useMutation({
    mutationFn: async (data: typeof aboutForm) => {
      const res = await apiRequest('PUT', '/api/admin/about', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/about'] });
      alert('About section updated successfully!');
    },
  });

  // Add Certification mutation
  const addCertMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/admin/certifications', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certifications'] });
      refetchCerts();
      alert('Certification added successfully!');
    },
  });

  // Update Certification mutation
  const updateCertMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest('PUT', `/api/admin/certifications/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certifications'] });
      refetchCerts();
      setEditingCert(null);
      alert('Certification updated successfully!');
    },
  });

  // Delete Certification mutation
  const deleteCertMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/certifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certifications'] });
      refetchCerts();
      alert('Certification deleted successfully!');
    },
  });

  // Add Hackathon mutation
  const addHackathonMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/admin/hackathons', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hackathons'] });
      refetchHackathons();
      alert('Hackathon added successfully!');
    },
  });

  // Update Hackathon mutation
  const updateHackathonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest('PUT', `/api/admin/hackathons/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hackathons'] });
      refetchHackathons();
      setEditingHackathon(null);
      alert('Hackathon updated successfully!');
    },
  });

  // Delete Hackathon mutation
  const deleteHackathonMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/hackathons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hackathons'] });
      refetchHackathons();
      alert('Hackathon deleted successfully!');
    },
  });

  // Add Project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Adding project with data:', data);
      try {
        const res = await apiRequest('POST', '/api/admin/projects', data);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `HTTP ${res.status}`);
        }
        const result = await res.json();
        console.log('Project added response:', result);
        return result;
      } catch (error: any) {
        console.error('Error in mutationFn:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Project added successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      refetchProjects();
      alert('Project added successfully!');
    },
    onError: (error: any) => {
      console.error('Error adding project:', error);
      alert(`Failed to add project: ${error.message || 'Unknown error'}`);
    },
  });

  // Update Project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest('PUT', `/api/admin/projects/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      refetchProjects();
      setEditingProject(null);
      alert('Project updated successfully!');
    },
  });

  // Delete Project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      refetchProjects();
      alert('Project deleted successfully!');
    },
  });

  // Delete Blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blogs'] });
      refetchBlogs();
      alert('Blog post deleted successfully!');
    },
  });

  const handleAboutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAboutMutation.mutate(aboutForm);
  };

  const handleAddSkill = () => {
    const skill = prompt('Enter skill name:');
    if (skill) {
      setAboutForm({ ...aboutForm, skills: [...aboutForm.skills, skill] });
    }
  };

  const handleRemoveSkill = (index: number) => {
    setAboutForm({
      ...aboutForm,
      skills: aboutForm.skills.filter((_, i) => i !== index),
    });
  };

  const handleAddTool = () => {
    const tool = prompt('Enter tool name:');
    if (tool) {
      setAboutForm({ ...aboutForm, tools: [...aboutForm.tools, tool] });
    }
  };

  const handleRemoveTool = (index: number) => {
    setAboutForm({
      ...aboutForm,
      tools: aboutForm.tools.filter((_, i) => i !== index),
    });
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      company: formData.get('company') as string,
      title: formData.get('title') as string,
      issued: formData.get('issued') as string,
      platform: formData.get('platform') as string,
      icon: formData.get('icon') as string || 'fas fa-certificate',
      cardColor: formData.get('cardColor') as string || 'bg-blue-500',
      buttonColor: formData.get('buttonColor') as string || 'bg-blue-600',
      titleColor: formData.get('titleColor') as string || 'text-white',
      textColor: formData.get('textColor') as string || 'text-white',
      certImageUrl: formData.get('certImageUrl') as string,
      credentialUrl: formData.get('credentialUrl') as string || '',
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    };
    addCertMutation.mutate(data);
    form.reset();
  };

  const handleHackathonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      organizer: formData.get('organizer') as string,
      side: formData.get('side') as string,
      delay: parseInt(formData.get('delay') as string) || 0,
      certificateUrl: formData.get('certificateUrl') as string,
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    };
    addHackathonMutation.mutate(data);
    form.reset();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Admin Dashboard</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onLogout}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                Logout
              </Button>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="about" className="data-[state=active]:bg-blue-500">About</TabsTrigger>
            <TabsTrigger value="certifications" className="data-[state=active]:bg-blue-500">Certifications</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-500">Projects</TabsTrigger>
            <TabsTrigger value="hackathons" className="data-[state=active]:bg-blue-500">Hackathons</TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-blue-500">Blog</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4 mt-4">
            {/* Current About Data Summary */}
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mb-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Current About Data {aboutData ? `(${aboutData.bio ? 'Set' : 'Not Set'})` : '(Not Set)'}
              </h3>
              {aboutData ? (
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">Bio:</span> <span className="text-white">{aboutData.bio || 'Not set'}</span></div>
                  <div><span className="text-gray-400">Education:</span> <span className="text-white">{aboutData.education || 'Not set'}</span></div>
                  <div><span className="text-gray-400">Languages:</span> <span className="text-white">{aboutData.languages || 'Not set'}</span></div>
                  <div><span className="text-gray-400">Skills:</span> <span className="text-white">{aboutData.skills?.length > 0 ? aboutData.skills.join(', ') : 'None'}</span></div>
                  <div><span className="text-gray-400">Skills:</span> <span className="text-white">{aboutData.skills?.length > 0 ? aboutData.skills.join(', ') : 'None'}</span></div>
                  <div><span className="text-gray-400">Tools:</span> <span className="text-white">{aboutData.tools?.length > 0 ? aboutData.tools.join(', ') : 'None'}</span></div>
                  <div><span className="text-gray-400">Resume:</span> <span className="text-white">{aboutData.resumeUrl || 'Not set'}</span></div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No about data set yet. Use the form below to add your information.</p>
              )}
            </div>
            <form onSubmit={handleAboutSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={aboutForm.bio}
                  onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  placeholder="Enter your bio..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={aboutForm.education}
                  onChange={(e) => setAboutForm({ ...aboutForm, education: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., BE CSE, SPPU (Expected 2027)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages (comma-separated)</Label>
                <Input
                  id="languages"
                  value={aboutForm.languages}
                  onChange={(e) => setAboutForm({ ...aboutForm, languages: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., English, Hindi, Marathi"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Skills</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSkill}
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aboutForm.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tools</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTool}
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aboutForm.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full"
                    >
                      <span>{tool}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTool(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resumeUrl">Resume URL</Label>
                <Input
                  id="resumeUrl"
                  value={aboutForm.resumeUrl}
                  onChange={(e) => setAboutForm({ ...aboutForm, resumeUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>


              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={saveAboutMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveAboutMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-4 mt-4">
            <form onSubmit={handleCertSubmit} className="space-y-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Certification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cert-company">Company</Label>
                  <Input
                    id="cert-company"
                    name="company"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-title">Title</Label>
                  <Input
                    id="cert-title"
                    name="title"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-issued">Issued</Label>
                  <Input
                    id="cert-issued"
                    name="issued"
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="e.g., January 2025"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-platform">Platform</Label>
                  <Input
                    id="cert-platform"
                    name="platform"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-image-url">Cloudinary Image URL</Label>
                  <Input
                    id="cert-image-url"
                    name="certImageUrl"
                    type="url"
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                    required
                  />
                  <p className="text-xs text-gray-400">Paste your Cloudinary image URL here</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-credential">Credential URL</Label>
                  <Input
                    id="cert-credential"
                    name="credentialUrl"
                    type="url"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="cert-colors">Card Color (Tailwind class)</Label>
                  <Input
                    id="cert-colors"
                    name="cardColor"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="bg-blue-500"
                    placeholder="e.g., bg-blue-500"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={addCertMutation.isPending}
              >
                {addCertMutation.isPending ? 'Adding...' : 'Add Certification'}
              </Button>
            </form>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Current Certifications ({certifications?.length || 0})</h3>
              {certifications && certifications.length > 0 ? (
                <div className="space-y-3">
                  {certifications.map((cert: any) => (
                    <div
                      key={cert.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{cert.company} - {cert.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{cert.issued} • {cert.platform}</p>
                          {cert.credentialUrl && (
                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm mt-1 hover:underline">
                              View Credential
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCert(cert)}
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this certification?')) {
                                deleteCertMutation.mutate(cert.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No certifications added yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Hackathons Tab */}
          <TabsContent value="hackathons" className="space-y-4 mt-4">
            <form onSubmit={handleHackathonSubmit} className="space-y-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Hackathon</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hack-name">Name</Label>
                  <Input
                    id="hack-name"
                    name="name"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hack-role">Role</Label>
                  <Input
                    id="hack-role"
                    name="role"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="hack-organizer">Organizer</Label>
                  <Input
                    id="hack-organizer"
                    name="organizer"
                    className="bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hack-side">Side</Label>
                  <select
                    id="hack-side"
                    name="side"
                    className="w-full h-10 rounded-md border border-gray-700 bg-gray-900 text-white px-3"
                    defaultValue="left"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hack-delay">Delay (ms)</Label>
                  <Input
                    id="hack-delay"
                    name="delay"
                    type="number"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="0"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="hack-certificate">Certificate URL</Label>
                  <Input
                    id="hack-certificate"
                    name="certificateUrl"
                    type="url"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={addHackathonMutation.isPending}
              >
                {addHackathonMutation.isPending ? 'Adding...' : 'Add Hackathon'}
              </Button>
            </form>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Current Hackathons ({hackathons?.length || 0})</h3>
              {hackathons && hackathons.length > 0 ? (
                <div className="space-y-3">
                  {hackathons.map((hack: any) => (
                    <div
                      key={hack.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{hack.name}</h4>
                          <p className="text-sm text-gray-400 mt-1">{hack.role} • {hack.organizer}</p>
                          <p className="text-xs text-gray-500 mt-1">Side: {hack.side} • Delay: {hack.delay}ms</p>
                          {hack.certificateUrl && (
                            <a href={hack.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm mt-1 hover:underline block">
                              View Certificate
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingHackathon(hack)}
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this hackathon?')) {
                                deleteHackathonMutation.mutate(hack.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No hackathons added yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 mt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);

              // Validate required fields
              const title = formData.get('title') as string;
              const description = formData.get('description') as string;
              const imageUrl = formData.get('imageUrl') as string;
              const alt = formData.get('alt') as string;
              const githubUrl = formData.get('githubUrl') as string;

              if (!title || !description || !imageUrl || !alt || !githubUrl) {
                alert('Please fill in all required fields (Title, Description, Image URL, Alt Text, GitHub URL)');
                return;
              }

              // Parse technologies from comma-separated string
              const techString = formData.get('technologies') as string;
              const technologies = techString ? techString.split(',').map(t => {
                const parts = t.trim().split(':').map(s => s.trim());
                return { name: parts[0] || t.trim(), color: parts[1] || 'blue' };
              }) : [];

              const data = {
                title: title.trim(),
                description: description.trim(),
                imageUrl: imageUrl.trim(),
                alt: alt.trim(),
                technologies,
                liveUrl: (formData.get('liveUrl') as string)?.trim() || null,
                githubUrl: githubUrl.trim(),
                primaryColor: (formData.get('primaryColor') as string) || 'blue',
                displayOrder: parseInt((formData.get('displayOrder') as string) || '0') || 0,
              };

              console.log('Form submitted with data:', data);

              if (editingProject) {
                updateProjectMutation.mutate({ id: editingProject.id, data }, {
                  onSuccess: () => {
                    form.reset();
                    setEditingProject(null);
                  }
                });
              } else {
                addProjectMutation.mutate(data, {
                  onSuccess: () => {
                    form.reset();
                    setEditingProject(null);
                  }
                });
              }
            }} className="space-y-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="proj-title">Title</Label>
                  <Input
                    id="proj-title"
                    name="title"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue={editingProject?.title}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="proj-description">Description</Label>
                  <Textarea
                    id="proj-description"
                    name="description"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue={editingProject?.description}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="proj-image-url">Cloudinary Image URL</Label>
                  <Input
                    id="proj-image-url"
                    name="imageUrl"
                    type="url"
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                    defaultValue={editingProject?.imageUrl}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-alt">Image Alt Text</Label>
                  <Input
                    id="proj-alt"
                    name="alt"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue={editingProject?.alt}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-color">Primary Color</Label>
                  <select
                    id="proj-color"
                    name="primaryColor"
                    className="w-full h-10 rounded-md border border-gray-700 bg-gray-900 text-white px-3"
                    defaultValue={editingProject?.primaryColor || 'blue'}
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="cyan">Cyan</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-tech">Technologies (format: "Name:color, Name:color")</Label>
                  <Input
                    id="proj-tech"
                    name="technologies"
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="React:cyan, Node.js:green, MongoDB:green"
                    defaultValue={editingProject?.technologies?.map((t: any) => `${t.name}:${t.color}`).join(', ')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-live">Live URL (optional)</Label>
                  <Input
                    id="proj-live"
                    name="liveUrl"
                    type="url"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue={editingProject?.liveUrl}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-github">GitHub URL</Label>
                  <Input
                    id="proj-github"
                    name="githubUrl"
                    type="url"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue={editingProject?.githubUrl}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  disabled={editingProject ? updateProjectMutation.isPending : addProjectMutation.isPending}
                >
                  {editingProject ? (updateProjectMutation.isPending ? 'Updating...' : 'Update Project') : (addProjectMutation.isPending ? 'Adding...' : 'Add Project')}
                </Button>
                {editingProject && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingProject(null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Current Projects ({projects?.length || 0})</h3>
              {projects && projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project: any) => (
                    <div
                      key={project.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{project.title}</h4>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies?.map((tech: any, idx: number) => (
                              <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded">{tech.name}</span>
                            ))}
                          </div>
                          <div className="flex gap-4 mt-2 text-sm">
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Live Demo
                              </a>
                            )}
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              GitHub
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProject(project)}
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this project?')) {
                                deleteProjectMutation.mutate(project.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No projects added yet.</p>
              )}
            </div>
          </TabsContent>
          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-4 mt-4">
            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold">Manage Blog Posts</h3>
                <p className="text-sm text-gray-400">Create, edit, and delete your blog articles.</p>
              </div>
              <Button onClick={() => {
                onOpenChange(false); // Close dashboard
                setLocation("/admin/blog/new");
              }} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" /> New Post
              </Button>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">All Posts ({blogs?.length || 0})</h3>
              {blogs && blogs.length > 0 ? (
                <div className="space-y-3">
                  {blogs.map((blog: any) => (
                    <div
                      key={blog.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{blog.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {blog.isPublished ? <span className="text-green-400">Published</span> : <span className="text-yellow-400">Draft</span>}
                            {' • '}
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-md">{blog.excerpt}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onOpenChange(false);
                              setLocation(`/admin/blog/edit/${blog.id}`);
                            }}
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              onOpenChange(false);
                              setLocation(`/blog/${blog.slug}`);
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this blog post?')) {
                                deleteBlogMutation.mutate(blog.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No blog posts found.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Certification Dialog */}
        {editingCert && (
          <Dialog open={!!editingCert} onOpenChange={() => setEditingCert(null)}>
            <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Certification</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const data = {
                  company: formData.get('company') as string,
                  title: formData.get('title') as string,
                  issued: formData.get('issued') as string,
                  platform: formData.get('platform') as string,
                  icon: formData.get('icon') as string || 'fas fa-certificate',
                  cardColor: formData.get('cardColor') as string || 'bg-blue-500',
                  buttonColor: formData.get('buttonColor') as string || 'bg-blue-600',
                  titleColor: formData.get('titleColor') as string || 'text-white',
                  textColor: formData.get('textColor') as string || 'text-white',
                  certImageUrl: formData.get('certImageUrl') as string,
                  credentialUrl: formData.get('credentialUrl') as string || '',
                  displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
                };
                updateCertMutation.mutate({ id: editingCert.id, data });
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input name="company" defaultValue={editingCert.company} className="bg-gray-800 border-gray-700 text-white" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input name="title" defaultValue={editingCert.title} className="bg-gray-800 border-gray-700 text-white" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Issued</Label>
                    <Input name="issued" defaultValue={editingCert.issued} className="bg-gray-800 border-gray-700 text-white" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input name="platform" defaultValue={editingCert.platform} className="bg-gray-800 border-gray-700 text-white" required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Cloudinary Image URL</Label>
                    <Input name="certImageUrl" type="url" defaultValue={editingCert.certImageUrl} className="bg-gray-800 border-gray-700 text-white" required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Credential URL</Label>
                    <Input name="credentialUrl" type="url" defaultValue={editingCert.credentialUrl} className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Card Color</Label>
                    <Input name="cardColor" defaultValue={editingCert.cardColor} className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600" disabled={updateCertMutation.isPending}>
                    {updateCertMutation.isPending ? 'Updating...' : 'Update'}
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => {
                    if (confirm('Are you sure you want to delete this certification?')) {
                      deleteCertMutation.mutate(editingCert.id);
                      setEditingCert(null);
                    }
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingCert(null)} className="bg-gray-700 border-gray-600 text-white">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Hackathon Dialog */}
        {editingHackathon && (
          <Dialog open={!!editingHackathon} onOpenChange={() => setEditingHackathon(null)}>
            <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Hackathon</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const data = {
                  name: formData.get('name') as string,
                  role: formData.get('role') as string,
                  organizer: formData.get('organizer') as string,
                  side: formData.get('side') as string,
                  delay: parseInt(formData.get('delay') as string) || 0,
                  certificateUrl: formData.get('certificateUrl') as string,
                  displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
                };
                updateHackathonMutation.mutate({ id: editingHackathon.id, data });
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" defaultValue={editingHackathon.name} className="bg-gray-800 border-gray-700 text-white" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input name="role" defaultValue={editingHackathon.role} className="bg-gray-800 border-gray-700 text-white" required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Organizer</Label>
                    <Input name="organizer" defaultValue={editingHackathon.organizer} className="bg-gray-800 border-gray-700 text-white" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Side</Label>
                    <select name="side" className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3" defaultValue={editingHackathon.side}>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Delay (ms)</Label>
                    <Input name="delay" type="number" defaultValue={editingHackathon.delay} className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Certificate URL</Label>
                    <Input name="certificateUrl" type="url" defaultValue={editingHackathon.certificateUrl} className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600" disabled={updateHackathonMutation.isPending}>
                    {updateHackathonMutation.isPending ? 'Updating...' : 'Update'}
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => {
                    if (confirm('Are you sure you want to delete this hackathon?')) {
                      deleteHackathonMutation.mutate(editingHackathon.id);
                      setEditingHackathon(null);
                    }
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingHackathon(null)} className="bg-gray-700 border-gray-600 text-white">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}

