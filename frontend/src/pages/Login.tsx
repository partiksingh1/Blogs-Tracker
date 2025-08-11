import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { loginUser } from "@/store/slices/authSlice";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter a password"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (data: LoginFormValues) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : error?.message || "Login failed");
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
      isLoading={isLoading}
      alternateAction={{
        text: "Don't have an account?",
        linkText: "Signup",
        linkTo: "/signup",
      }}
    />
  );
};
