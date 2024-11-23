import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
const Information = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="pl-64 pt-20">
        <div className="container mx-auto p-6 space-y-8 animate-fadeIn">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <span className="inline-block px-3 py-1 bg-hospital-primary/10 text-hospital-primary rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h2 className="text-3xl font-bold text-hospital-dark mb-4">
              Healthcare Management System
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our platform connects patients, doctors, and pharmacists in a seamless digital healthcare ecosystem. We strive to provide efficient and accessible healthcare services to everyone.
            </p>
          </div>
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-hospital-dark">For Patients</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Easy appointment scheduling</li>
                <li>• Access to medical history</li>
                <li>• Digital prescriptions</li>
                <li>• Secure communication with doctors</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-hospital-dark">For Doctors</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Patient management system</li>
                <li>• Digital prescription writing</li>
                <li>• Appointment calendar</li>
                <li>• Medical records access</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-hospital-dark">For Pharmacists</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Digital prescription processing</li>
                <li>• Inventory management</li>
                <li>• Patient medication history</li>
                <li>• Automated refill system</li>
              </ul>
            </div>
          </div>
          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-hospital-dark">Contact Support</h3>
            <div className="space-y-2 text-gray-600">
              <p>Email: support@healthcare-system.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Information;
