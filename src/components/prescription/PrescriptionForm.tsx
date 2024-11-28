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
import { toast } from "sonner";
import axios from "axios";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react";

interface PrescriptionFormProps {
  patients: Array<{
    patient_id: number;
    fname: string;
    lname: string;
    sym_description: string;
    sym_id: number;
  }>;
  medication: Array<{
    medication_id: number;
    name: string;
    description: string;
  }>;
}

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  medicineIds: z.array(z.string()).min(1, "Please select at least one medicine"),
  prescription: z.string().min(10, "Prescription details required"),
});

export const PrescriptionForm = ({ patients, medication }: PrescriptionFormProps) => {
  const [open, setOpen] = useState(false)
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([])

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      medicineIds: [],
      prescription: "",
    },
  });

  const selectedPatient = patients.find(
    (patient) => patient.patient_id === Number(form.watch("patientId"))
  );

  const onSubmit = async (values: z.infer<typeof prescriptionSchema>) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/create_prescription.php?sym_id=${selectedPatient?.sym_id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

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

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Create Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Patient</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="medicineIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Medicines</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {selectedMedicines.length > 0
                          ? `${selectedMedicines.length} medicines selected`
                          : "Select medicines..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search medicines..." />
                        <CommandEmpty>No medicine found.</CommandEmpty>
                        <CommandGroup>
                          {medication.map((medicine) => (
                            <CommandItem
                              key={medicine.medication_id}
                              value={medicine.medication_id.toString()}
                              onSelect={(currentValue) => {
                                const value = medicine.medication_id.toString()
                                const newSelectedMedicines = selectedMedicines.includes(value)
                                  ? selectedMedicines.filter((item) => item !== value)
                                  : [...selectedMedicines, value]
                                
                                setSelectedMedicines(newSelectedMedicines)
                                field.onChange(newSelectedMedicines)
                                setOpen(true)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedMedicines.includes(medicine.medication_id.toString()) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {medicine.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedMedicines.map((id) => {
                      const medicine = medication.find((m) => m.medication_id.toString() === id);
                      return medicine && (
                        <div key={id} className="mt-1">
                          {medicine.description}
                        </div>
                      );
                    })}
                  </div>
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
  );
};