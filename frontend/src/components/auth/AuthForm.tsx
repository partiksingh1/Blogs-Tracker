import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type AuthField = {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
};

interface AuthFormProps {
    title: string;
    fields: AuthField[];
    form: any; // react-hook-form's `form` object
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    alternateAction?: {
        text: string;
        linkText: string;
        linkTo: string;
    };
}

export const AuthForm = ({
    title,
    fields,
    form,
    onSubmit,
    isLoading = false,
    alternateAction,
}: AuthFormProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto justify-center items-center">
                {/* Left side */}
                <div className="w-full flex items-center justify-center space-y-4 px-4 md:w-1/2">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Welcome</h2>
                        <p className="text-lg">
                            Your intelligent content hub — curate, tag, and summarize the web
                            in one click.
                        </p>
                    </div>
                </div>

                {/* Form side */}
                <div className="w-full mt-24 md:mt-0 md:w-1/2">
                    <Card className="mx-auto max-w-md">
                        <CardHeader className="space-y-4">
                            <CardTitle className="text-2xl font-bold mb-6">{title}</CardTitle>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    {fields.map((field) => (
                                        <FormField
                                            key={field.name}
                                            control={form.control}
                                            name={field.name as any}
                                            render={({ field: rhfField }) => (
                                                <FormItem>
                                                    <FormLabel>{field.label}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type={field.type || "text"}
                                                            placeholder={field.placeholder}
                                                            {...rhfField}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}

                                    {alternateAction && (
                                        <div className="flex justify-center">
                                            <span className="flex items-center">
                                                {alternateAction.text}
                                                <button
                                                    type="button"
                                                    className="ml-2 text-blue-500 underline"
                                                    onClick={() => navigate(alternateAction.linkTo)}
                                                >
                                                    {alternateAction.linkText}
                                                </button>
                                            </span>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-3/4 bg-black text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        ) : (
                                            title
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
};
