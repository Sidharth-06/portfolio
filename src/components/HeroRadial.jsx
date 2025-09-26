import React, { useState, useEffect } from "react";
import ParticleTransition from "./transitions/ParticleTransition";
import PhoenixTransition from "./transitions/PhoenixTransition";
import LiquidTransition from "./transitions/LiquidTransition";
import GravityTransition from "./transitions/GravityTransition";
import "./HeroRadial.css";

const sections = [
    { name: "Projects", icon: "🚀", color: "#6366f1", transition: "particle" },
    { name: "Skills", icon: "⚡", color: "#8b5cf6", transition: "phoenix" },
    { name: "Fun", icon: "🎨", color: "#06b6d4", transition: "liquid" },
    { name: "Contact", icon: "💬", color: "#10b981", transition: "gravity" }
];

export default function HeroRadial() {
    const [spin, setSpin] = useState(0);
    const [activeItem, setActiveItem] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [currentTransition, setCurrentTransition] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        let frameId;
        const tick = () => {
            setSpin(prev => (prev + 0.2) % 360);
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePos({ x, y });
            document.documentElement.style.setProperty("--mouse-x", `${x}%`);
            document.documentElement.style.setProperty("--mouse-y", `${y}%`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Scroll detection for physics transition
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100 && !isTransitioning) {
                // Default to particle transition on scroll
                setCurrentTransition('particle');
                setIsTransitioning(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isTransitioning]);

    const handleTransitionComplete = () => {
        setIsTransitioning(false);
        setCurrentTransition(null);
        console.log('Physics transition complete!');
        // Navigate to next section here
    };

    const handleMenuClick = (section) => {
        if (!isTransitioning) {
            setCurrentTransition(section.transition);
            setIsTransitioning(true);
        }
    };

    return (
        <>
            {/* Render active transition */}
            <ParticleTransition 
                isActive={currentTransition === 'particle' && isTransitioning}
                onComplete={handleTransitionComplete}
            />
            <PhoenixTransition 
                isActive={currentTransition === 'phoenix' && isTransitioning}
                onComplete={handleTransitionComplete}
            />
            <LiquidTransition 
                isActive={currentTransition === 'liquid' && isTransitioning}
                onComplete={handleTransitionComplete}
            />
            <GravityTransition 
                isActive={currentTransition === 'gravity' && isTransitioning}
                onComplete={handleTransitionComplete}
            />
            
            <section className="hero-radial">
                {/* Animated background */}
                <div className="bg-container">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                    <div className="mouse-gradient"></div>
                </div>

                {/* Main content */}
                <div className="content-wrapper">
                    <div className="radial-container">
                        {/* Center avatar */}
                        <div className="avatar-wrapper">
                            <div className="avatar-ring"></div>
                            <div className="avatar-centre">
                                <video
                                    src="/assets/anim.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            </div>
                        </div>

                        {/* Orbiting menu items */}
                        {sections.map((section, i) => {
                            const base = (360 / sections.length) * i;
                            const angle = base + spin;
                            const isActive = activeItem === i;
                            
                            return (
                                <div
                                    key={section.name}
                                    className={`orbit-item ${isActive ? 'active' : ''}`}
                                    style={{
                                        transform: `
                                            rotate(${angle}deg)
                                            translate(${isActive ? 240 : 200}px)
                                            rotate(${-angle}deg)
                                        `,
                                        '--item-color': section.color
                                    }}
                                    onMouseEnter={() => setActiveItem(i)}
                                    onMouseLeave={() => setActiveItem(null)}
                                    onClick={() => handleMenuClick(section)}
                                >
                                    <a href="#" className="orbit-link" onClick={(e) => e.preventDefault()}>
                                        <span className="orbit-icon">{section.icon}</span>
                                        <span className="orbit-text">{section.name}</span>
                                    </a>
                                </div>
                            );
                        })}
                    </div>

                    {/* Title */}
                    <div className="hero-title-wrapper">
                        <h1 className="hero-title">
                            Hey, I'm{" "}
                            <span className="name-highlight">Sidharth</span>
                            <span className="wave">👋</span>
                        </h1>
                        <p className="hero-subtitle">AI Developer & Creative Technologist</p>
                    </div>
                </div>
            </section>
        </>
    );
}