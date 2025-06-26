export default function Hackathons() {
  const hackathons = [
    {
      id: 1,
      name: 'InnoVyuh Hackathon 2025',
      role: 'Developer, Team Supreme',
      organizer: 'Organized by Google Developer Groups, MIT ACSC, Alandi',
      side: 'left',
      delay: 0
    },
    {
      id: 2,
      name: 'INNERVE 9.0',
      role: 'Finalist (Online Mode) – Team Bit Benders',
      organizer: 'Hosted by AIT Pune',
      side: 'right',
      delay: 200
    }
  ];

  return (
    <section id="hackathons" className="py-20 lg:py-32 bg-gray-900 bg-opacity-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="section-reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Hackathon Participation</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Collaborative problem-solving and innovation through competitive programming events
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-500 z-0"></div>
            
            {/* Timeline Dots */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-32 w-4 h-4 bg-blue-500 rounded-full z-10 border-4 border-black"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-32 w-4 h-4 bg-blue-500 rounded-full z-10 border-4 border-black"></div>
            
            <div className="space-y-24">
              {hackathons.map((hackathon, index) => (
                <div 
                  key={hackathon.id} 
                  className={`flex items-center ${hackathon.side === 'right' ? 'flex-row-reverse' : ''}`}
                  style={{
                    animation: `slideIn${hackathon.side === 'left' ? 'Left' : 'Right'} 0.8s ease-out ${hackathon.delay}ms both`
                  }}
                >
                  <div className={`w-1/2 ${hackathon.side === 'left' ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-gray-800 bg-opacity-70 glass-effect rounded-2xl p-6 shadow-xl border border-gray-700">
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {hackathon.name}
                      </h3>
                      <p className="text-gray-300 mb-2 font-medium">
                        {hackathon.role}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {hackathon.organizer}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
