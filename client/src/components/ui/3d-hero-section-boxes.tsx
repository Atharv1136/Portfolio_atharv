"use client";

import React, { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

function HeroSplineBackground() {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            pointerEvents: 'auto',
            overflow: 'hidden',
        }}>
            <Spline
                style={{
                    width: '100%',
                    height: '100vh',
                    pointerEvents: 'auto',
                }}
                scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
            />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8)),
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9))
          `,
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}



interface HeroContentProps {
    resumeUrl?: string;
    onContactClick?: () => void;
}

function HeroContent({ resumeUrl, onContactClick }: HeroContentProps) {
    return (
        <div className="text-white px-4 max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center py-16">

            <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-wide">
                    Atharv<br />Bhosale
                </h1>
                <div className="text-sm text-gray-300 opacity-90 mt-4 tracking-widest uppercase">
                    Software Developer \ Problem Solver \ Tech Enthusiast
                </div>
            </div>

            <div className="w-full lg:w-1/2 pl-0 lg:pl-8 flex flex-col items-start">
                <p className="text-base sm:text-lg opacity-80 mb-6 max-w-md">
                    Building awesome software experiences and crafting killer designs to make ideas stand out.
                </p>
                <div className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                        onClick={onContactClick}
                        className="border border-white text-white font-semibold py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-2xl transition duration-300 w-full sm:w-auto hover:bg-white hover:text-black"
                    >
                        Contact Me
                    </button>
                    {resumeUrl && (
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View resume"
                            className="pointer-events-auto bg-white text-black font-semibold py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-2xl transition duration-300 hover:scale-105 flex items-center justify-center w-full sm:w-auto"
                        >
                            {/* Download / document icon */}
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M12 16l-4-4h2.5V4h3v8H16l-4 4zM5 20h14v-2H5v2z" />
                            </svg>
                            View Resume
                        </a>
                    )}
                </div>
            </div>

        </div>
    );
}

export interface HeroSectionProps {
    resumeUrl?: string;
    onContactClick?: () => void;
}

const HeroSection = ({ resumeUrl, onContactClick }: HeroSectionProps) => {
    const heroContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (heroContentRef.current) {
                requestAnimationFrame(() => {
                    const scrollPosition = window.pageYOffset;
                    const maxScroll = 400;
                    const opacity = 1 - Math.min(scrollPosition / maxScroll, 1);
                    if (heroContentRef.current) {
                        heroContentRef.current.style.opacity = opacity.toString();
                    }
                });
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 z-0 pointer-events-auto">
                <HeroSplineBackground />
            </div>

            <div ref={heroContentRef} style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, pointerEvents: 'none'
            }}>
                <HeroContent resumeUrl={resumeUrl} onContactClick={onContactClick} />
            </div>
        </div>
    );
};

export { HeroSection };
