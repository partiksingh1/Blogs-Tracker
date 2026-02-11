import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useStateContext } from "@/lib/ContextProvider"
import { ModeToggle } from "@/components/ToggleTheme"
import toast from "react-hot-toast"

export default function LandingPage() {
    const navigate = useNavigate();
    const { user, setUser, loading, setToken } = useStateContext();
    console.log("user is ", user);


    // ---------- HANDLE GOOGLE RESPONSE ----------
    const handleGoogleLogin = async (response: any) => {
        try {
            if (!response.credential) {
                console.error("No credential received");
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
            toast.success(`Welcome, ${data?.user?.username}`)
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setToken(data.token)
            setUser(data.user);
            navigate("/dashboard");
        } catch (err) {
            console.error("Google login failed:", err);
            alert("Google login failed");
        }
    };

    // ---------- LOAD GOOGLE SCRIPT ----------
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (!window.google) {
                console.error("Google GSI not available");
                return;
            }

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin,
            });

            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-btn"),
                {
                    theme: "outline",
                    size: "large",
                    text: "signin_with",
                    shape: "rectangular",
                    width: 280,
                }
            );
        };

        document.body.appendChild(script);
    }, []);


    const features = [
        {
            title: "1. Quick Setup",
            description: "Create your account in seconds using Google Sign-In.",
            image: "/c1.png?height=400&width=600",
        },
        {
            title: "2. Organized Dashboard",
            description: "Manage all your content in a clean, intuitive dashboard designed for efficiency.",
            image: "/hero.png?height=400&width=600",
        },
        {
            title: "3. Effortless Content Management",
            description: "Organize blogs and articles with multiple tags and categories for better structure and discovery.",
            image: "/c3.png?height=400&width=600",
        },
        {
            title: "4. AI-Powered Summaries",
            description: "Generate smart AI summaries by scraping links and delivering the most relevant insights instantly.",
            image: "/c2.png?height=400&width=600",
        },

    ]

    return (
        <div className="min-h-screen">

            {/* Header */}
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
                            {loading ? null : !user ? (
                                <div id="google-signin-btn" className="flex justify-center" />
                            ) : (
                                <div className="bg-black text-white border-white border p-2 m-1 rounded-md">
                                    <span>
                                        👋🏼 Hi, {user.username}
                                    </span>
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
                                    <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black">{feature.title}</h2>
                                    <p className="text-gray-700 text-base md:text-xl text-center mt-5">{feature.description}</p>
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
