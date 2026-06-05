import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Calendar, BookOpen, AlertCircle, ExternalLink, Users } from 'lucide-react';

interface PublicationEntry {
    id: string;
    title: string;
    publisher: string;
    publicationDate: string;
    url?: string;
    description: string;
    authors: string;
    logoUrl?: string;
    displayOrder: number;
}

// Returns a deterministic gradient index from publisher name
function gradientIndex(publisher: string): number {
    let sum = 0;
    for (let i = 0; i < publisher.length; i++) {
        sum += publisher.charCodeAt(i);
    }
    return sum % 6;
}

function PublisherLogo({ publisher, logoUrl }: { publisher: string; logoUrl?: string }) {
    const [imageError, setImageError] = useState(false);
    const gradClass = `logo-gradient-${gradientIndex(publisher)}`;
    const initial = publisher.charAt(0).toUpperCase();

    if (logoUrl && !imageError) {
        return (
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
                <img
                    src={logoUrl}
                    alt={`${publisher} logo`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                />
            </div>
        );
    }

    return (
        <div
            className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg border border-white/10 ${gradClass}`}
        >
            <span className="text-white font-bold text-2xl">{initial}</span>
        </div>
    );
}

export default function Publications() {
    const { data: publicationsData, isLoading, isError, error } = useQuery<PublicationEntry[]>({
        queryKey: ['/api/publications'],
        queryFn: getQueryFn({ on401: 'returnNull' }),
    });

    if (isError) {
        return (
            <section id="publications" className="section-dark-primary py-20 lg:py-32 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 text-lg font-semibold">Failed to load publications</p>
                    <p className="text-gray-500 text-sm mt-1">{(error as Error)?.message ?? 'Unknown error'}</p>
                </div>
            </section>
        );
    }

    const publications = publicationsData && publicationsData.length > 0 ? publicationsData : [];

    return (
        <section id="publications" className="section-dark-primary py-20 lg:py-32 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="section-reveal">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">Publications</h2>
                        <div className="w-24 h-1 bg-blue-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Research papers and academic contributions
                        </p>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : publications.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                No publications yet. Add them from the admin panel.
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Vertical timeline line */}
                            <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-purple-500/40 to-transparent hidden sm:block" />

                            <div className="space-y-8">
                                {publications.map((pub, index) => (
                                    <div
                                        key={pub.id}
                                        className="experience-card relative bg-white/[0.03] backdrop-blur-sm rounded-2xl p-8 sm:pl-28 shadow-xl"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        {/* Timeline dot */}
                                        <div className="absolute left-4 top-8 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-blue-400/50 hidden sm:flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>

                                        <div className="flex items-start gap-5">
                                            <PublisherLogo publisher={pub.publisher} logoUrl={pub.logoUrl} />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white leading-tight">{pub.title}</h3>
                                                        <p className="text-blue-400 font-semibold text-base mt-0.5">{pub.publisher}</p>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap self-start sm:self-auto">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {pub.publicationDate}
                                                    </span>
                                                </div>

                                                {/* Authors */}
                                                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-400">
                                                    <Users className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span>{pub.authors}</span>
                                                </div>

                                                <p className="text-gray-300 text-base leading-relaxed mt-3">{pub.description}</p>

                                                {/* URL Link */}
                                                {pub.url && (
                                                    <a
                                                        href={pub.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        View Publication
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
