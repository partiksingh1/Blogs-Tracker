import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useStateContext } from "@/context/AuthContext";
import { ModeToggle } from "@/components/ToggleTheme";
import toast from "react-hot-toast";

interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
}

export default function LandingPage() {
    const navigate = useNavigate();
    const { user, login, loading } = useStateContext();

    const handleGoogleLogin = useCallback(
        async (response: GoogleCredentialResponse) => {
            try {
                if (!response?.credential) {
                    toast.error("Google authentication failed");
                    return;
                }

                const res = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/auth/google`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ credential: response.credential }),
                    }
                );

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                login(data.user, data.token);

                toast.success(`Welcome, ${data.user.username}`);
                navigate("/dashboard");
            } catch (err) {
                toast.error("Google login failed");
            }
        },
        [login, navigate]
    );

    useEffect(() => {
        if (window.google) return; // Prevent duplicate loading

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (!window.google) return;

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin,
            });

            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-btn"),
                {
                    theme: "outline",
                    size: "large",
                    width: 280,
                }
            );
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [handleGoogleLogin]);

    const features = [
        {
            title: "Quick Setup",
            description: "Create your account in seconds using Google Sign-In.",
            image: "/c1.png",
        },
        {
            title: "Organized Dashboard",
            description:
                "Manage all your content in a clean, intuitive dashboard.",
            image: "/hero.png",
        },
        {
            title: "Effortless Content Management",
            description:
                "Organize blogs with multiple tags and categories.",
            image: "/c3.png",
        },
        {
            title: "AI-Powered Summaries",
            description:
                "Generate smart AI summaries by scraping links instantly.",
            image: "/c2.png",
        },
    ];
    return (<div className="min-h-screen"> {/* Header */}
        <header className="top-0 border-b-2">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2 p-3 m-2 rounded-md">
                        <Sparkles className="h-7 w-7" />
                        <span className="text-3xl font-bold">
                            BlogZone
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-end space-x-4">
                            <ModeToggle />
                        </div>
                        {
                            !user ? (
                                <Button
                                    className="cursor-pointer"
                                >Sign In
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    className=""
                                >

                                    <Link to="/dashboard">
                                        Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            )
                        }
                    </div>

                </div>
            </div>
        </header>

        {/* Hero Section */}
        <section className="pt-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <Badge variant="secondary" className="mb-6">
                        <Sparkles className="mr-2 h-3 w-3" />
                        AI-Integrated Blog Management
                    </Badge>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Blog management,{" "}
                        <span className="text-gray-500">
                            simplified
                        </span>
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl max-w-2xl mx-auto">
                        Seamlessly manage, create, and organize your blogs with an intuitive interface powered by artificial
                        intelligence.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {!loading && !user && (
                            <div id="google-signin-btn" className="flex justify-center" />
                        )}
                        {!loading && user && (
                            <div className="bg-black text-white border-white border p-2 m-1 rounded-md">
                                👋 Hi, {user.username}
                            </div>
                        )}
                        <Button className="bg-white text-black border-black hover:bg-white outline-dotted">
                            <a href="#features">FAQs</a>
                        </Button>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="mt-16 relative">
                    <div className="relative mx-auto max-w-6xl">
                        <div className="absolute bg-linear-to-t from-white via-transparent to-transparent" />
                        <div className="relative overflow-hidden rounded-xl">
                            <img
                                src="/hero.png"
                                alt="BlogZone Dashboard Preview"
                                width={1000}
                                height={500}
                                className="w-full h-auto mask-image-gradient"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section >

        {/* Features */}
        < section id="features" className="sm:py-10" >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">How it works</h2>
                </div>
                <div className="mt-20 flex flex-col gap-16 px-4 md:px-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12"
                        >
                            {/* Left: Title + Description */}
                            <div className="md:w-1/2 flex flex-col justify-center items-center text-center md:text-left">
                                <h2 className="text-2xl md:text-4xl font-bold mb-4 ">{feature.title}</h2>
                                <p className="text-base md:text-xl text-center mt-5">{feature.description}</p>
                            </div>

                            {/* Right: Image */}
                            <div className="md:w-1/2 flex justify-center md:justify-center">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full max-w-md rounded-lg shadow-lg object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section >

        {/* Footer */}
        < footer className="bg-gray-900 text-white py-12 text-center" >
            <p>&copy; {new Date().getFullYear()} BlogZone. All rights reserved.</p>
        </footer >
    </div >
    );
}
