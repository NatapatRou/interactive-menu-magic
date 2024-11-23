export const fetchPatientSymptoms = async () => {
  try {
    const response = await fetch('http://your-backend-url/api/patients/symptoms');
    if (!response.ok) {
      throw new Error('Failed to fetch patient symptoms');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching patient symptoms:', error);
    throw error;
  }
};