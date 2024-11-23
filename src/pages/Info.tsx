import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

const Info = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="pl-64 pt-20">
        <div className="container mx-auto p-6 space-y-6 animate-fadeIn">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-hospital-dark">About Our Healthcare System</CardTitle>
              <CardDescription>Your trusted partner in healthcare management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Our healthcare management system is designed to provide seamless integration between patients, 
                doctors, and pharmacists. We strive to deliver efficient and secure healthcare services through 
                our modern digital platform.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="font-semibold text-lg mb-2">For Patients</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Easy appointment booking</li>
                    <li>• Digital prescriptions</li>
                    <li>• Medical history access</li>
                    <li>• Secure communication</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="font-semibold text-lg mb-2">For Doctors</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Patient management</li>
                    <li>• Digital prescription system</li>
                    <li>• Appointment scheduling</li>
                    <li>• Medical records access</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="font-semibold text-lg mb-2">For Pharmacists</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Digital prescription handling</li>
                    <li>• Inventory management</li>
                    <li>• Patient verification</li>
                    <li>• Secure documentation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-hospital-primary" />
                  <span>support@healthcare.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-hospital-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-hospital-primary" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-hospital-primary" />
                  <span>123 Healthcare St.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Info;