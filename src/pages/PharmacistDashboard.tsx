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
import { useState, useEffect } from "react";
import axios from "axios";

const dispenseSchema = z.object({
  prescriptionId: z.string().min(1, "Please select a prescription"),
});

interface Prescription {
    prescription_id: number,    
    patient_id: number,
    doctor_id: number,    
    patient_name: string,
    med_name: string,
    description: string,
    pharmacist_id: number,    
    medication_id: number,    
    notes: string    
}
const PharmacistDashboard = () => {
  const [prescription, setPrescription] = useState<Prescription[]>([]);
  

  useEffect(() => {
    fetchPrescription();
  }, []); //call once when client rendered

  const fetchPrescription = async () => {
    try {
      const response = await axios.get("http://localhost:8081/get_prescription.php", {
        withCredentials: true
      });
      if (response.data) {
        setPrescription(response.data);
        console.log(response.data);
      }
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to get prescription");
      console.error(error);
    }
  };
  const form = useForm<z.infer<typeof dispenseSchema>>({
    resolver: zodResolver(dispenseSchema),
    defaultValues: {
      prescriptionId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof dispenseSchema>) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/disperse_med.php?med_id=${selectedPrescription.medication_id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json", // Specify JSON format
          }, 
          withCredentials: true,
        },
      );
      console.log(response);

      if (response.data.status === "success") {
        toast.success("Dispensing prescription success");
        window.location.reload();
      } else {
        toast.error(response.data.message || "Dispensing prescription failed");
      }
    } catch (error) {
      toast.error("An error occurred during dispnesing prescription");
      console.error(error);
    }
  };

  const selectedPrescription = prescription.find(
    (prescription) => prescription.prescription_id === Number(form.watch("prescriptionId"))
  );
  // Mock prescription data - replace with actual API call
  // const prescriptions = [
  //   { id: "1", patientName: "John Doe", medication: "Amoxicillin 500mg" },
  //   { id: "2", patientName: "Jane Smith", medication: "Ibuprofen 400mg" },
  //   { id: "3", patientName: "uwu Smith", medication: "Ibuprofen 400mg" },
  // ];

return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Pharmacist Dashboard</h1>

          {/* Show card only if a prescription is selected */}
          {selectedPrescription ? (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Patient: {selectedPrescription.patient_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Medication: {selectedPrescription.med_name}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Notes: {selectedPrescription.notes}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-gray-600 mb-6">Select a prescription to view details.</p>
          )}

          {/* Form to select and dispense medication */}
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
                            {prescription.map((prescription) => (
                              <SelectItem
                                key={prescription.prescription_id}
                                value={prescription.prescription_id.toString()}
                              >
                                {prescription.patient_name} -{" "}
                                {prescription.med_name}
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
