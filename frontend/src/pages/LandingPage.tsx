import { ArrowRight, Sparkles, Zap, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"


const features = [
    {
        icon: Zap,
        title: "Lightning Fast Setup",
        description: "Create your account in under 30 seconds and start blogging immediately",
        image: "/c1.png?height=400&width=600",
    },
    {
        icon: BarChart3,
        title: "Beautiful Dashboard",
        description: "Your content organized in a clean, intuitive interface that makes management effortless",
        image: "/hero.png?height=400&width=600",
    },
    {
        icon: Sparkles,
        title: "Smart Content Creation",
        description: "Write and categorize posts with smart formatting",
        image: "/c3.png?height=400&width=600",
    },
    {
        icon: Users,
        title: "Intelligent Insights",
        description: "Get AI-generated summaries of your content ",
        image: "/c2.png?height=400&width=600",
    },
]


export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                BlogZone
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                Sign In
                            </Link>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                <Link to="/dashboard">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge variant="secondary" className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-100">
                            <Sparkles className="mr-2 h-3 w-3" />
                            AI-Powered Content Management
                        </Badge>

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                            Content management,{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                simplified
                            </span>
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl max-w-2xl mx-auto">
                            Seamlessly manage, create, and organize your blogs with an intuitive interface powered by artificial
                            intelligence. Join thousands of creators who've transformed their content workflow.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                asChild
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                <Link to="/register">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>

                            <Button
                                className="bg-white text-black border-black outlin hover:bg-white outline-dotted"
                            >
                                <a href="#features">How?</a>
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="mt-16 relative">
                        <div className="relative mx-auto max-w-6xl">
                            <div className="absolute bg-gradient-to-t from-white via-transparent to-transparent" />
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    src="/hero.png"
                                    alt="BlogZone Dashboard Preview"
                                    width={1200}
                                    height={600}
                                    className="w-full h-auto mask-image-gradient"

                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 sm:py-32 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How it works</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            From setup to publishing, every step is designed to be intuitive and powerful
                        </p>
                    </div>

                    <div className="space-y-24">
                        {features.map((feature, index) => {
                            const isEven = index % 2 === 0

                            return (
                                <div
                                    key={feature.title}
                                    className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${isEven ? "" : "lg:flex-row-reverse"
                                        }`}
                                >
                                    <div className="flex-1 space-y-6">
                                        <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">{feature.title}</h3>

                                        <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>

                                        <Button variant="outline" className="group bg-transparent">
                                            Learn More
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-900/10">
                                            <img
                                                src={feature.image || ""}
                                                alt={`${feature.title} preview`}
                                                width={600}
                                                height={400}
                                                className="w-full h-auto object-cover opacity-90"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <p>&copy; {new Date().getFullYear()} BlogZone. All rights reserved.</p>

            </footer>
        </div>
    )
}
