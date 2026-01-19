import { BlogList } from "@/components/BlogList";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";
import { ManageCategories } from "@/components/ManageCategories";

export const Dashboard = () => {
    const navigate = useNavigate();
    const [isManageOpen, setIsManageOpen] = useState(false);
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    useEffect(() => {
        if (!user || !token) {
            toast.error("You need to login!")
            navigate("/");
        }
    }, [user, token, navigate]);
    return (
        <Layout>
            <div className="w-full">
                {/* Blog List */}
                <BlogList />
                {/* Manage  Dialog */}
                {isManageOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded-lg shadow-lg p-2">
                            <ManageCategories onClose={() => setIsManageOpen(false)} />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
