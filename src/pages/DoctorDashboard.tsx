import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
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

// Mock data for medicines
const medicines = [
  {
    id: "1",
    name: "Amoxicillin",
    description: "Antibiotic used to treat bacterial infections",
  },
  {
    id: "2",
    name: "Ibuprofen",
    description: "Pain reliever and fever reducer",
  },
  {
    id: "3",
    name: "Omeprazole",
    description: "Reduces stomach acid production",
  },
  {
    id: "4",
    name: "Loratadine",
    description: "Antihistamine for allergy relief",
  },
];

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  medicineId: z.string().min(1, "Please select a medicine"),
  prescription: z.string().min(10, "Prescription details required"),
});

const DoctorDashboard = () => {
  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      medicineId: "",
      prescription: "",
    },
  });

  const onSubmit = (values: z.infer<typeof prescriptionSchema>) => {
    console.log(values);
    toast.success("Prescription created successfully");
  };

  // Mock patient data - replace with actual API call
  const patients = [
    { id: "1", name: "John Doe", symptoms: "Fever and headache" },
    { id: "2", name: "Jane Smith", symptoms: "Cough and sore throat" },
  ];

  const selectedMedicine = medicines.find(
    (med) => med.id === form.watch("medicineId"),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {patients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle>Patient: {patient.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{patient.symptoms}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Patient</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a patient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicineId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Medicine</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a medicine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {medicines.map((medicine) => (
                              <SelectItem key={medicine.id} value={medicine.id}>
                                {medicine.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedMedicine && (
                          <p className="text-sm text-gray-500 mt-1">
                            {selectedMedicine.description}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prescription Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter prescription details..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Create Prescription</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
