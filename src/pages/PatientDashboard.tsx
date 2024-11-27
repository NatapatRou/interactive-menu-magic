import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const formSchema = z.object({
    symptoms: z
      .string()
      .min(10, "Please describe your symptoms (minimum 10 characters)"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const handleBack = () => {
    navigate('/patient-symptoms');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const response = await axios.post(
        "http://localhost:8081/create_symptom.php",
        values,
        {
          headers: {
            "Content-Type": "application/json", // Specify JSON format
          },
          withCredentials: true, // allow to send session cross domain
        },
      );
      console.log(response.data);

      if (response.data.status === "success") {
        toast.success("Sended Symptoms");
        navigate("/patient-symptoms"); // Redirect to patient page
      } else {
        toast.error(response.data.message || "Sended Symptoms failed");
      }
    } catch (error) {
      toast.error("An error occurred during send symptoms");
      console.error(error);
    }
    toast.success("Symptoms submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mb-4"
          >
            All Symptom
          </Button>
          <h1 className="text-2xl font-bold mb-6">Submit Symptoms</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your symptoms in detail..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.symptoms && (
                      <p className="text-red-500">
                        {form.formState.errors.symptoms.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit">Submit Symptoms</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
