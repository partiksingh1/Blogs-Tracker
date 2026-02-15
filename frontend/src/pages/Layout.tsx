import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { ModeToggle } from "@/components/ToggleTheme";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { CreateBlogDialog } from "@/features/blogs/components/CreateBlogDialog";
import { useSearchContext } from "@/lib/SearchProvider";

export default function Layout({
    children,
    header
}: {
    children: React.ReactNode;
    header?: React.ReactNode;
}) {
    const { search, setSearch } = useSearchContext();
    return (
        <SidebarProvider>
            <AppSidebar />

            <main className="w-full">
                {/* HEADER BAR */}
                <div className="flex items-center gap-3 p-3 border-b bg-background">
                    <SidebarTrigger />
                    <div className="w-1/2">
                        <Input
                            placeholder="Search blogs"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="grow"
                            aria-label="Search blogs"
                        />
                    </div>
                    <div className="flex-1">{header}</div>
                    <ModeToggle />
                    <CreateBlogDialog />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}