import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"; // Import ShadCN modal components
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { z } from "zod"
import toast from 'react-hot-toast';
import { Loader2 } from "lucide-react";
const formSchema = z.object({
  email: z.string({ required_error: "Please enter an email" }).email({ message: "Please provide a valid email address" }),
  password: z.string({ required_error: "Please enter a password" })
})


type formValues = z.infer<typeof formSchema>

export const Login = () => {
  const [openEmailDialog, setOpenEmailDialog] = useState(false); // Track if delete dialog is open
  const [forgetEmail, setForgetEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blogs");
    }
  }, [navigate]);
  const handleForgetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgetEmail(e.target.value)
  }
  const handleForgetEmail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/forgot-password`,
        {
          email: forgetEmail
        },
      );
      if (response.status === 200) {
        toast.success("Please check your email.");
      }
      else if (response.status === 404) {
        toast.error("No user exists with this email");
      } else {
        toast.error("Failed to Send Email.");
      }
    } catch (error) {
      console.error("Error Adding tag:", error);
      toast.error("No user exists with this email");
    } finally {
      setIsLoading(false);
      setOpenEmailDialog(false);
      setForgetEmail("")
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ''
    }
  })

  const handleLogin = async (data: formValues) => {
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, {
        email: data.email,
        password: data.password
      })
      console.log(response);
      if (response.status == 200) {
        toast.success("Login Successfull")
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("username", response.data.user.username)
        localStorage.setItem("userId", response.data.user.id)
        navigate("/blogs")
      }
    } catch (error: any) {
      console.error(error);
      if (error.status == 401) {
        toast.error("Incorrect Password!")
      }
      if (error.status == 404) {
        toast.error("No user exists with this mail")
      }

    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex items-center justify-center md:min-h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto justify-center items-center">
        <div className="w-full flex items-center justify-center space-y-4  px-4 md:w-1/2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Welcome back to BlogHub</h2>
            <p className="text-lg">Login to continue your Blogs Journey</p>
          </div>
        </div>

        <div className="w-full mt-24 md:mt-0 md:w-1/2">
          <Card className="mx-auto max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold mb-6">Login</CardTitle>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
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
                          <Input type="password" placeholder="password" {...field}
                            onKeyDown={(e) => {
                              // Prevent default action when Enter is pressed
                              if (e.key === "Enter") {
                                e.preventDefault();
                              }
                            }} />
                        </FormControl>
                        <FormMessage />
                        <div className="flex justify-end">
                          <button className="ml-2 text-blue-700" onClick={(e) => {
                            e.preventDefault(); // Prevent form submission
                            setOpenEmailDialog(true)
                          }}>
                            Forgot password?
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <span className="flex items-center">
                            Don't have an account?
                            <button className="ml-2 text-blue-500 underline" onClick={() => { navigate('/signup') }}>
                              Signup
                            </button>
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-3/4 bg-black text-white" disabled={loading}>
                    {loading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-x-white animate-spin mr-2" />
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              </Form>
            </CardHeader>
          </Card>
          <Dialog open={openEmailDialog} onOpenChange={setOpenEmailDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset password</DialogTitle>
              </DialogHeader>
              <Input id="forgetEmail" value={forgetEmail} className="col-span-2" onChange={handleForgetEmailChange} />
              <DialogFooter>
                <Button
                  onClick={() => setOpenEmailDialog(false)} // Close modal without deleting
                  variant="secondary"
                  className="mr-2"
                >
                  Cancel
                </Button>
                {isLoading ? (
                  // Show the loading spinner when isLoading is true
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Button
                    onClick={handleForgetEmail} // Proceed with delete
                    disabled={isLoading}
                  >
                    Send Email
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>

  )
}