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

// Mock data for medicines
//const medicines = [
  // {
  //   id: "1",
  //   name: "Amoxicillin",
  //   description: "Antibiotic used to treat bacterial infections",
  // },
  // {
  //   id: "2",
  //   name: "Ibuprofen",
  //   description: "Pain reliever and fever reducer",
  // },
  // {
  //   id: "3",
  //   name: "Omeprazole",
  //   description: "Reduces stomach acid production",
 // },
  //{
   // id: "4",
   // name: "Loratadine",
   // description: "Antihistamine for allergy relief",
  //},
//];

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  medicineId: z.string().min(1, "Please select a medicine"),
  prescription: z.string().min(10, "Prescription details required"),
});

const DoctorDashboard = () => {
  const [medication, setMedication] = useState<Medication[]>([]);
  

  useEffect(() => {
    fetchMedication();
  }, []);

  const fetchMedication = async () => {
    try {
      const response = await axios.get("http://localhost:8081/select_medicine.php", {
        withCredentials: true
      });
      if (response.data) {
        setMedication(response.data);
      }
    } catch (error) {
      toast.error("Failed to select medication");
      console.error(error);
    }
  };
  //=============================
  const [patients, setPatients] = useState<Patients[]>([]);
  

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/select_patient.php`, {
        withCredentials: true
      });
      if (response.data) {
        setPatients(response.data);
      }
    } catch (error) {
      toast.error("Failed to select patient");
      console.error(error);
    }
  };
  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      medicineId: "",
      prescription: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof prescriptionSchema>) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/create_prescription.php?sym_id=${selectedPatient.sym_id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json", // Specify JSON format
          }, withCredentials: true,
        },
      );
      console.log(response);

      if (response.data.status === "success") {
        toast.success("Create prescription success");
        window.location.reload();
      } else {
        toast.error(response.data.message || "Create prescription failed");
      }
    } catch (error) {
      toast.error("An error occurred during Create prescription");
      console.error(error);
    }
  };

  // Mock patient data - replace with actual API call
  //const patients = [
    //{ id: "1", name: "John Doe", symptoms: "Fever and headache" },
    //{ id: "2", name: "Jane Smith", symptoms: "Cough and sore throat" },
  //];

  const selectedPatient = patients.find(
    (patient) => patient.patient_id === Number(form.watch("patientId"))
  );

  const selectedMedicine = medication.find(
    (medication) => medication.medication_id === Number(form.watch("medicineId"))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

          {/* Render details of selected patient */}
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <CardTitle>Patient: {selectedPatient.fname} {selectedPatient.lname}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{selectedPatient.sym_description}</p>
              </CardContent>
            </Card>
          ) : (
            <p className="text-gray-600 mb-6">Select a patient to view details.</p>
          )}

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
                              <SelectItem key={patient.patient_id} value={patient.patient_id.toString()}>
                                {patient.fname} {patient.lname}
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
                            {medication.map((medication) => (
                              <SelectItem key={medication.medication_id} value={medication.medication_id.toString()}>
                                {medication.name}
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
