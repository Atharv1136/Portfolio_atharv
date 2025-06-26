import kisanDhanImage from "@assets/image_1750507862301_1750945011839.png";
import moneyMateImage from "@assets/linkdin_1750507830154_1750945011840.png";
import phishGuardImage from "@assets/phish_1750507830155_1750945011841.png";
import taxMateImage from "@assets/taxmate_1750507830156_1750945011842.png";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'KISANDHAN – AI Crop Advisor',
      description: 'Smart agriculture application using Gemini API for intelligent crop suggestions and farming guidance.',
      image: kisanDhanImage,
      alt: 'KisanDhan - Smart Agriculture Platform',
      technologies: [
        { name: 'AI', color: 'blue' },
        { name: 'Gemini API', color: 'green' },
        { name: 'Agriculture', color: 'yellow' }
      ],
      liveUrl: 'https://kisandhan.netlify.app',
      githubUrl: 'https://github.com/Atharv1136/KisanDhan',
      primaryColor: 'blue'
    },
    {
      id: 2,
      title: 'PhishGuard – Anti-Phishing',
      description: 'Real-time malicious link detection system built with React for enhanced web security.',
      image: phishGuardImage,
      alt: 'PhishGuard - Protecting from Digital Threats',
      technologies: [
        { name: 'React', color: 'cyan' },
        { name: 'Security', color: 'red' },
        { name: 'Real-time', color: 'orange' }
      ],
      liveUrl: 'https://phisshguard.netlify.app',
      githubUrl: 'https://github.com/Atharv1136/Phishgaurd',
      primaryColor: 'red'
    },
    {
      id: 3,
      title: 'Tax Mate – Income Tax Chatbot',
      description: 'Intelligent chatbot interface for recommending appropriate ITR forms and tax filing guidance.',
      image: taxMateImage,
      alt: 'Tax Mate - Your Smart Tax Filing Assistant',
      technologies: [
        { name: 'React', color: 'cyan' },
        { name: 'Chatbot', color: 'purple' },
        { name: 'Tax Filing', color: 'green' }
      ],
      liveUrl: 'https://taxmatee.netlify.app',
      githubUrl: 'https://github.com/Atharv1136/Taxmate',
      primaryColor: 'green'
    },
    {
      id: 4,
      title: 'MoneyMate – Expense Tracker',
      description: 'Comprehensive personal finance management tool built with Python and Tkinter for expense tracking.',
      image: moneyMateImage,
      alt: 'MoneyMate - Unlock Financial Freedom: Budgeting Made Simple',
      technologies: [
        { name: 'Python', color: 'yellow' },
        { name: 'Tkinter', color: 'blue' },
        { name: 'Finance', color: 'green' }
      ],
      githubUrl: 'https://github.com/Atharv1136/MONEYMATE',
      primaryColor: 'purple'
    }
  ];

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
    <section id="projects" className="py-20 lg:py-32 bg-gray-900 bg-opacity-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Featured Projects</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover my latest work in software development, AI integration, and web applications
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="project-card bg-gray-800 bg-opacity-50 glass-effect rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={project.image} 
                  alt={project.alt}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className={`text-2xl font-bold mb-3 ${getColorClasses(project.primaryColor, 'text')}`}>
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech.name}
                        className={`${getColorClasses(tech.color)} bg-opacity-20 ${getColorClasses(tech.color, 'text')} px-3 py-1 rounded-full text-sm`}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex-1 ${getColorClasses(project.primaryColor)} ${getColorClasses(project.primaryColor, 'hover')} text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 text-center`}
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>Live Demo
                      </a>
                    )}
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${project.liveUrl ? 'flex-1' : 'w-full'} border border-gray-600 hover:border-white text-gray-300 hover:text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 text-center`}
                    >
                      <i className="fab fa-github mr-2"></i>
                      {project.liveUrl ? 'GitHub' : 'View on GitHub'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
