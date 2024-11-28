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

interface RawPrescriptionData {
  prescription_id: number;
  patient_id: number;
  doctor_id: number;
  patient_name: string;
  pharmacist_id: number;
  notes: string;
  medication_id: number;
  med_name: string;
  description: string;
}
interface Prescription {
  prescription_id: number;
  patient_id: number;
  doctor_id: number;
  patient_name: string;
  pharmacist_id: number;
  notes: string;
  medications: MedDetail[];
}

interface MedDetail {
  med_id: number;
  med_name: string;
  description: string;
}

const PharmacistDashboard = () => {
  const [combinedData, setCombinedData] = useState<Prescription[]>([]);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/get_prescription.php", {
          withCredentials: true,
        });

        if (response.data) {
          const transformedData = transformPrescriptionData(response.data);
          setCombinedData(transformedData); // Correctly typed data
        }
      } catch (error) {
        toast.error("Failed to fetch prescription data");
        console.error(error);
      }
    };

    fetchPrescriptionData();
  }, []);

  const transformPrescriptionData = (
    rawData: RawPrescriptionData[]
  ): Prescription[] => {
    const groupedData = rawData.reduce((acc, item) => {
      const { prescription_id, med_name, medication_id, description, ...rest } = item;

      if (!acc[prescription_id]) {
        acc[prescription_id] = {
          ...rest,
          prescription_id,
          medications: [],
        };
      }

      acc[prescription_id].medications.push({
        med_id: medication_id,
        med_name,
        description,
      });

      return acc;
    }, {} as Record<number, Prescription>);

    return Object.values(groupedData);
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
        `http://localhost:8081/disperse_med.php`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
        console.log("Current Form Values:", values); 
      if (response.data.status === "success") {
        toast.success("Dispensing prescription successful");
        // window.location.reload();
      } else {
        console.log(response.data);
        toast.error(response.data.message || "Dispensing prescription failed");
      }
    } catch (error) {
      toast.error("An error occurred during dispensing prescription");
      console.error(error);
    }
  };

  const selectedPrescription = combinedData.find(
    (prescription) => prescription.prescription_id === Number(form.watch("prescriptionId"))
  );

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
                  <p className="text-gray-600 mt-2">Notes: {selectedPrescription.notes}</p>
                  <p className="text-gray-600 mt-4 font-semibold">Medications:</p>
                  <ul className="list-disc pl-5">
                    {selectedPrescription.medications.map((med) => (
                      <li key={med.med_id} className="text-gray-600">
                        {med.med_name} - {med.description}
                      </li>
                    ))}
                  </ul>
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
                            {combinedData.map((prescription) => (
                              <SelectItem
                                key={prescription.prescription_id}
                                value={prescription.prescription_id.toString()}
                              >
                                {prescription.patient_name} - Notes: {prescription.notes}
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
