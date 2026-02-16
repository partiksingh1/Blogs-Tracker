import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SummaryModalProps {
    summary: string;
    setShowSummaryModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SummaryModal({ summary, setShowSummaryModal }: SummaryModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
                <CardAction
                    className="absolute top-4 right-4 cursor-pointer"
                    onClick={() => setShowSummaryModal(false)}
                >
                    <X className="bg-red-400 rounded-2xl p-1" />
                </CardAction>

                <CardHeader>
                    <CardDescription className="prose prose-sm md:prose-base max-w-none m-2">
                        <ReactMarkdown>{summary}</ReactMarkdown>
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
