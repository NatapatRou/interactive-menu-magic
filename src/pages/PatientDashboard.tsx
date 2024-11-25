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

const PatientDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/patient_info.php")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Symptoms submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
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
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Patient Data</h2>
            <ul>
              {data.map((patient, index) => (
                <li key={index} className="mb-2">
                  {JSON.stringify(patient)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
