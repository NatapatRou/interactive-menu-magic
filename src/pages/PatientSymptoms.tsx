import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";

interface Symptom {
  sym_id: number;
  date_issued: string;
  sym_description: string;
}

const PatientSymptoms = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await axios.get("http://localhost:8081/get_patient_symptoms.php", {
        withCredentials: true
      });
      if (response.data) {
        setSymptoms(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch symptoms");
      console.error(error);
    }
  };

  const handleDelete = async (symptomId: number) => {
    try {
      const response = await axios.delete(`http://localhost:8081/delete_symptom.php?id=${symptomId}`, {
        withCredentials: true
      });
      
      if (response.data.status === "success") {
        toast.success(response.data.message);
        fetchSymptoms(); // Refresh the list
      } else {
        toast.error("Failed to delete symptom");
      }
    } catch (error) {
      toast.error("Failed to delete symptom");
      console.error(error);
    }
  };

  if (symptoms.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-64">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Symptoms Request</h1>
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No symptoms recorded yet.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Symptoms Request</h1>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Symptom Description</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {symptoms.map((symptom) => (
                  <TableRow key={symptom.sym_id}>
                    <TableCell>{new Date(symptom.date_issued).toLocaleDateString()}</TableCell>
                    <TableCell>{symptom.sym_description}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(symptom.sym_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSymptoms;
