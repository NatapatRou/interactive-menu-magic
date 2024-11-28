import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
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

interface Patients {
  patient_id: number;
  fname: string;
  lname: string;
  sym_description: string;
  sym_id: number;
}
interface Medication {
  medication_id: number;
  name: string;
  description: string;
}

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  medicineIds: z.array(z.string()).min(1, "Please select at least one medicine"),
  prescription: z.string().min(10, "Prescription details required"),
});

const DoctorDashboard = () => {
  const [medication, setMedication] = useState<Medication[]>([]);
  const [patients, setPatients] = useState<Patients[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<Medication[]>([]);

  // Fetch medications
  useEffect(() => {
    const fetchMedication = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/select_medicine.php",
          { withCredentials: true }
        );
        if (response.data) {
          setMedication(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch medications");
        console.error(error);
      }
    };

    fetchMedication();
  }, []);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/select_patient.php",
          { withCredentials: true }
        );
        if (response.data) {
          setPatients(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch patients");
        console.error(error);
      }
    };

    fetchPatients();
  }, []);

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      medicineIds: [],
      prescription: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof prescriptionSchema>) => {
    const selectedPatient = patients.find(
      (patient) => patient.patient_id === Number(values.patientId)
    );


    if (!selectedPatient) {
      toast.error("Invalid patient selected");
      return;
    }

    console.log("Form Values:", values);
    try {
      const response = await axios.post(
        `http://localhost:8081/create_prescription.php?sym_id=${selectedPatient.sym_id}`,
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        toast.success("Prescription created successfully");
        form.reset();
        setSelectedMedicines([]);
      } else {
        console.log(response.data);
        toast.error(response.data.message || "Failed to create prescription");
      }
    } catch (error) {
      toast.error("An error occurred while creating prescription");
      console.error(error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

          {/* Patient Details */}
          {form.watch("patientId") && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Patient:{" "}
                  {
                    patients.find(
                      (patient) =>
                        patient.patient_id === Number(form.watch("patientId"))
                    )?.fname
                  }{" "}
                  {
                    patients.find(
                      (patient) =>
                        patient.patient_id === Number(form.watch("patientId"))
                    )?.lname
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {
                    patients.find(
                      (patient) =>
                        patient.patient_id === Number(form.watch("patientId"))
                    )?.sym_description
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Prescription Form */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Create Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Select Patient */}
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
                              <SelectItem
                                key={patient.patient_id}
                                value={patient.patient_id.toString()}
                              >
                                {patient.fname} {patient.lname}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Select Multiple Medicines */}
                  <FormField
                    control={form.control}
                    name="medicineIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Medicines</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (!field.value.includes(value)) {
                              field.onChange([...field.value, value]); // Add value
                              const selected = medication.find(
                                (med) =>
                                  med.medication_id === Number(value)
                              );
                              if (selected) {
                                setSelectedMedicines((prev) => [
                                  ...prev,
                                  selected,
                                ]);
                              }
                            }
                          }}
                          // defaultValue={field.value}
                          // multiple // Enable multiple selection
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select medicines" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {medication.map((med) => (
                              <SelectItem
                                key={med.medication_id}
                                value={med.medication_id.toString()}
                              >
                                {med.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedMedicines.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold">Selected Medicines:</p>
                            <ul>
                              {selectedMedicines.map((med) => (
                                <li
                                  key={med.medication_id}
                                  className="text-sm text-gray-500"
                                >
                                  {med.name} - {med.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Prescription Details */}
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
