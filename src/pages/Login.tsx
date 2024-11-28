import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { toast } from "sonner"; // Optional for notifications
import { useEffect } from "react";

// Input schema
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    // If the input not in this form no trigger submit?
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

// In case that user not press logout button
const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8081/logout.php");
      console.log("Logout successful", response.data);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  useEffect(() => {
        handleLogout();
    }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const response = await axios.post(
        "http://localhost:8081/login.php",
        values,
        {
          headers: {
            "Content-Type": "application/json", // Specify JSON format
          },
          withCredentials: true,
        },
      );
      console.log(response.data);

      if (response.data.status === "success") {
        if (response.data.role == "Patient") {
          toast.success("Login successful");
          navigate("/patient-dashboard"); // Redirect to patient page
        } else if (response.data.role == "Doctor") {
          toast.success("Login successful");
          navigate("/doctor-dashboard"); // Redirect to doctor page
        } else if (response.data.role == "Pharmacist") {
          toast.success("Login successful");
          navigate("/pharmacist-dashboard"); // Redirect to pharmacist page
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Login
              </h2>
              <Form {...form}>
                {/* Pass value to onSubmit anonymous function*/}
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* add username value to form.username*/}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
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
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => navigate("/register")}>
                  Don't have an account? Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
