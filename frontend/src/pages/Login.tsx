import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { setAuth } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter a password"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (data: LoginFormValues): Promise<void> => {
    setIsSubmitting(true); // Start loading
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, data).then((res) => {
        console.log("login res is ", res);
        setAuth(res.data.token, res.data.user.id)
        toast.success("Login successful!");
        navigate("/dashboard");
      });
    } catch (error) {
      console.error(error)
      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };


  return (
    <AuthForm
      title="Login"
      fields={[
        { name: "email", label: "Email", placeholder: "email@example.com" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      ]}
      form={form}
      onSubmit={handleLogin}
      isLoading={isSubmitting}
      alternateAction={{
        text: "Don't have an account?",
        linkText: "Signup",
        linkTo: "/signup",
      }}
    />
  );
};
