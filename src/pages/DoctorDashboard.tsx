import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { PrescriptionForm } from "@/components/prescription/PrescriptionForm";
import { toast } from "sonner";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

const DoctorDashboard = () => {
  const [medication, setMedication] = useState<Medication[]>([]);
  const [patients, setPatients] = useState<Patients[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);

  useEffect(() => {
    fetchMedication();
    fetchPatients();
  }, []);

  const fetchMedication = async () => {
    try {
      const response = await axios.get("http://localhost:8081/select_medicine.php", {
        withCredentials: true,
      });
      if (response.data) {
        setMedication(response.data);
      }
    } catch (error) {
      toast.error("Failed to select medication");
      console.error(error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/select_patient.php`, {
        withCredentials: true,
      });
      if (response.data) {
        setPatients(response.data);
      }
    } catch (error) {
      toast.error("Failed to select patient");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
          <div className="w-full">
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
                          const value = medicine.medication_id.toString();
                          const newSelectedMedicines = selectedMedicines.includes(value)
                            ? selectedMedicines.filter((item) => item !== value)
                            : [...selectedMedicines, value];
                          
                          setSelectedMedicines(newSelectedMedicines);
                          setOpen(true);
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
          </div>
          <PrescriptionForm patients={patients} medication={medication} />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;