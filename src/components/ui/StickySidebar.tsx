import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface Section {
    id: string;
    label: string;
}

const sections: Section[] = [
    { id: "hero", label: "Hero" },
    { id: "voice-agent-test", label: "Live Demo" },
    { id: "ig-portfolio", label: "Portfolio" },
];

export function StickySidebar() {
    const [activeSection, setActiveSection] = useState<string>("hero");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                root: null,
                rootMargin: "-20% 0px -60% 0px", // adjust thresholds to trigger active state earlier/later
                threshold: 0,
            }
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleScrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
            {sections.map(({ id, label }) => {
                const isActive = activeSection === id;
                return (
                    <button
                        key={id}
                        onClick={() => handleScrollTo(id)}
                        className="group relative flex items-center justify-end w-12 h-8"
                        aria-label={`Scroll to ${label}`}
                    >
                        {/* Minimalist dot / indicator */}
                        <div
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300 ml-auto mr-2",
                                isActive
                                    ? "bg-amber-400 scale-150 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                    : "bg-white/30 group-hover:bg-white/60"
                            )}
                        />

                        {/* Glassmorphic label that appears on hover/active */}
                        <span
                            className={cn(
                                "absolute right-6 px-3 py-1 text-[10px] sm:text-xs font-medium tracking-widest text-amber-500 uppercase rounded-full backdrop-blur-md bg-white/[0.04] border border-white/10 transition-all duration-300 whitespace-nowrap",
                                isActive
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:-translate-x-1"
                            )}
                        >
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
