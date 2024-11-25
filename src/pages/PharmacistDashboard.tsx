import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

const dispenseSchema = z.object({
  prescriptionId: z.string().min(1, "Please select a prescription"),
});

const PharmacistDashboard = () => {
  const form = useForm<z.infer<typeof dispenseSchema>>({
    resolver: zodResolver(dispenseSchema),
    defaultValues: {
      prescriptionId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof dispenseSchema>) => {
    console.log(values);
    toast.success("Medication dispensed successfully");
  };

  // Mock prescription data - replace with actual API call
  const prescriptions = [
    { id: "1", patientName: "John Doe", medication: "Amoxicillin 500mg" },
    { id: "2", patientName: "Jane Smith", medication: "Ibuprofen 400mg" },
    { id: "3", patientName: "uwu Smith", medication: "Ibuprofen 400mg" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Pharmacist Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <CardTitle>Patient: {prescription.patientName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Medication: {prescription.medication}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dispense Medication</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="prescriptionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Prescription</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a prescription" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {prescriptions.map((prescription) => (
                              <SelectItem
                                key={prescription.id}
                                value={prescription.id}
                              >
                                {prescription.patientName} -{" "}
                                {prescription.medication}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Confirm Dispensing</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
