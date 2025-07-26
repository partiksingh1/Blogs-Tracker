import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
    const navigate = useNavigate();
    const links = [
        {
            title: "Dashboard",
            href: "/blogs"
        },
        {
            title: "Register",
            href: "/login"
        },
    ];

    return (
        <div className="m-0 p-0 box-border font-normal bg-gradient-to-b from-white via-blue-100 to-white min-h-screen w-full">
            <div className="max-w-full p-8 mx-auto relative">
                {/* Header Section */}
                <div className="flex items-center justify-between flex-col sm:flex-row">
                    <div className="text-4xl font-bold">
                        <h1>Content360</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row mt-4 sm:mt-0">
                        {links.map((link, index) => (
                            <a
                                key={index}
                                className="text-2xl m-4 text-gray-800 hover:text-blue-600"
                                href={link.href}
                            >
                                {link.title}
                            </a>
                        ))}
                        <button onClick={() => navigate("login")} className="mt-4 sm:mt-0 p-4 bg-blue-600 text-white shadow-md rounded-xl text-2xl">Get Started</button>
                    </div>
                </div>

                {/* Main Section */}
                <div className="mt-28 text-center">
                    <h1 className="text-3xl sm:text-5xl font-bold">
                        AI-powered content management, <br /> simplified.
                    </h1>
                    <p className="mt-8 text-xl sm:text-3xl text-gray-600">
                        Seamlessly manage, create, and organize your blogs with an intuitive interface.
                    </p>
                    <button onClick={() => navigate("login")} className="mt-12 p-4 bg-blue-600 text-white shadow-md rounded-xl text-2xl">
                        Get Started
                    </button>
                </div>

                {/* Hero Image */}
                <div className="mt-12 relative w-full max-w-7xl mx-auto rounded-xl overflow-hidden">
                    <img
                        src="/hero.png"
                        alt="Hero Image"
                        className="w-full h-auto object-cover object-center mask-image-gradient"
                    />
                </div>

                {/* Features Section */}
                <div className="-mt-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-center">See How Easy It Is</h1>

                    {/* Feature 1 */}
                    <div className="flex flex-col sm:flex-row mt-16 gap-8 items-center justify-center">
                        <h2 className="text-2xl sm:text-3xl text-center w-full sm:w-1/2">
                            Create your account in 30 seconds
                        </h2>
                        <img className="w-full sm:w-1/2 opacity-45 rounded-xl" src="/c1.png" alt="Feature Image" />
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
                        <img className="w-full sm:w-1/2 opacity-45 rounded-xl" src="/hero.png" alt="Feature Image" />
                        <h2 className="text-2xl sm:text-3xl text-center w-full sm:w-1/2">
                            Your Dashboard Awaits <br /> See all your blogs organized beautifully
                        </h2>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
                        <h2 className="text-2xl sm:text-3xl text-center w-full sm:w-1/2">
                            Create & Organize <br />Write and categorize posts effortlessly
                        </h2>
                        <img className="w-full sm:w-1/2 opacity-45 h-auto rounded-xl" src="/c3.png" alt="Feature Image" />
                    </div>

                    {/* Feature 4 */}
                    <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
                        <img className="w-full sm:w-1/2 opacity-45 h-auto rounded-xl" src="/c2.png" alt="Feature Image" />
                        <h2 className="text-2xl sm:text-3xl text-center w-full sm:w-1/2">
                            Smart Features at Work <br />Get instant insights with AI-powered summaries
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};
