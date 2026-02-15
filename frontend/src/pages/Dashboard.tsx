import { BlogList } from "@/features/blogs/components/BlogList";
import Layout from "./DashboardLayout";
export const Dashboard = () => {
    return (
        <Layout>
            <div className="w-full">
                {/* Blog List */}
                <BlogList />
            </div>
        </Layout>
    );
};
