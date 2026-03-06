import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

export default function Projects() {
  const { data: projects = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/projects'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fallback projects if API fails or returns empty
  const fallbackProjects: any[] = [];

  // Use API data if available, otherwise use fallback
  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'hover' = 'bg') => {
    const colorMap = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-300', hover: 'hover:bg-blue-600' },
      green: { bg: 'bg-green-500', text: 'text-green-300', hover: 'hover:bg-green-600' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-300', hover: 'hover:bg-yellow-600' },
      cyan: { bg: 'bg-cyan-500', text: 'text-cyan-300', hover: 'hover:bg-cyan-600' },
      red: { bg: 'bg-red-500', text: 'text-red-300', hover: 'hover:bg-red-600' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-300', hover: 'hover:bg-orange-600' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-300', hover: 'hover:bg-purple-600' }
    };
    return colorMap[color as keyof typeof colorMap]?.[type] || colorMap.blue[type];
  };

  return (
    <section id="projects" className="section-dark-secondary py-20 lg:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Featured Projects</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover my latest work in software development, AI integration, and web applications
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center text-gray-400">Loading projects...</div>
            ) : error ? (
              <div className="col-span-full text-center text-red-400">Error loading projects. Please try again later.</div>
            ) : displayProjects.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">No projects available yet. Add projects from the admin panel.</div>
            ) : (
              displayProjects.map((project) => (
                <div key={project.id} className="project-card bg-gray-800 bg-opacity-50 glass-effect rounded-xl overflow-hidden shadow-xl flex flex-col">
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.alt || project.title}
                      className="w-full h-36 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${getColorClasses(project.primaryColor || 'blue', 'text')}`}>
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.map((tech: any, idx: number) => (
                          <span
                            key={tech.name || idx}
                            className={`${getColorClasses(tech.color || 'blue')} bg-opacity-20 ${getColorClasses(tech.color || 'blue', 'text')} px-2 py-0.5 rounded-full text-xs`}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 mt-auto">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 ${getColorClasses(project.primaryColor || 'blue')} ${getColorClasses(project.primaryColor || 'blue', 'hover')} text-white py-1.5 px-3 rounded-lg text-sm font-medium transition-colors duration-300 text-center`}
                        >
                          <i className="fas fa-external-link-alt mr-2"></i>Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${project.liveUrl ? 'flex-1' : 'w-full'} border border-gray-600 hover:border-white text-gray-300 hover:text-white py-1.5 px-3 rounded-lg text-sm font-medium transition-colors duration-300 text-center`}
                        >
                          <i className="fab fa-github mr-2"></i>
                          {project.liveUrl ? 'GitHub' : 'View on GitHub'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
