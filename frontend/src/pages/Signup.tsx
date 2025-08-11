import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { signupUser } from "@/store/slices/authSlice";
import { useEffect } from "react";

const signupSchema = z
  .object({
    username: z.string().min(2, "You must enter a username").max(50),
    email: z.string().email("Please provide a valid email"),
    password: z.string().min(8, "Password should be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const handleSignup = async (data: SignupFormValues) => {
    try {
      await dispatch(signupUser(data)).unwrap();
      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : error?.message || "Signup failed");
    }
  };

  return (
    <AuthForm
      title="Create new account"
      fields={[
        { name: "username", label: "Username", placeholder: "yourusername" },
        { name: "email", label: "Email", placeholder: "email@example.com" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
        { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
      ]}
      form={form}
      onSubmit={handleSignup}
      isLoading={isLoading}
      alternateAction={{
        text: "Already have an account?",
        linkText: "Login",
        linkTo: "/login",
      }}
    />
  );
};
