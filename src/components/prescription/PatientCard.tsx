import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PatientCardProps {
  patient: {
    fname: string;
    lname: string;
    sym_description: string;
  } | null;
}

export const PatientCard = ({ patient }: PatientCardProps) => {
  if (!patient) {
    return <p className="text-gray-600 mb-6">Select a patient to view details.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Patient: {patient.fname} {patient.lname}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{patient.sym_description}</p>
      </CardContent>
    </Card>
  );
};