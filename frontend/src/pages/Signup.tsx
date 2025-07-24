import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from 'react-hot-toast';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
const formSchema = z.object({
  username: z.string({
    required_error: 'You must fill in this field.',
  }).min(2, { message: "You must enter a username" }).max(50),
  email: z.string({
    required_error: 'You must fill in your email address to complete registration.',
  }).email({
    message: 'Please provide a valid email address.',
  }),
  password: z.string({
    invalid_type_error: 'Your password must contain at least 8 characters.',
    required_error: 'You must fill in this field.',
  }).min(5, { message: 'Password should be of alteast 5 characters', }),
  confirmPassword: z.string({
    required_error: 'You must fill in this field.'
  }),
}).refine(
  (values) => {
    return values.password === values.confirmPassword
  }, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}
)
type FormValues = z.infer<typeof formSchema>;
export const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blogs");
    }
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })
  const handleSignup = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/signup`, {
        username: data.username,
        email: data.email,
        password: data.password
      })
      console.log(response);
      if (response.status == 201) {
        toast.success("account created successfully")
        navigate('/login')
      }

    } catch (error) {
      console.error(error);
      const errorMessage = 'An error occurred. Please try again.';
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  return (

    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto justify-center items-center">
        {/* left section */}
        <div className="w-full flex items-center justify-center space-y-4  px-4 md:w-1/2">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome</h2>
            <p className="text-lg">Your intelligent content hub — curate, tag, and summarize the web in one click.</p>
          </div>
        </div>

        <div className="w-full mt-24 md:mt-0 md:w-1/2">
          <Card className="mx-auto max-w-md">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl font-bold mb-6">Create new account</CardTitle>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm Password" {...field} />
                        </FormControl>
                        <FormMessage />
                        <div className="flex justify-center">
                          <span className="flex items-center">
                            Already have an account?
                            <button className="ml-2 text-blue-500" onClick={() => { navigate('/login') }}>Login</button>
                          </span>
                        </div>

                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-3/4 bg-black text-white" disabled={loading}>
                    {loading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-x-white animate-spin mr-2" />
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </form>
              </Form>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}