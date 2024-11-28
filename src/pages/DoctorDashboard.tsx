import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { PrescriptionForm } from "@/components/prescription/PrescriptionForm";
import { PatientCard } from "@/components/prescription/PatientCard";
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

const DoctorDashboard = () => {
  const [medication, setMedication] = useState<Medication[]>([]);
  const [patients, setPatients] = useState<Patients[]>([]);

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
          <PrescriptionForm patients={patients} medication={medication} />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;