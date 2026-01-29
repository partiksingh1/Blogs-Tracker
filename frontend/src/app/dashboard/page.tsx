import { BlogList } from "@/components/BlogList";
import Layout from "../layout";
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
