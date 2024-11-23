import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="pl-64 pt-20">
        <div className="container mx-auto p-6 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <span className="inline-block px-3 py-1 bg-hospital-primary/10 text-hospital-primary rounded-full text-sm font-medium mb-4">
              Welcome
            </span>
            <h2 className="text-3xl font-bold text-hospital-dark mb-4">
              Healthcare Management System
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to our modern healthcare management platform. We provide
              efficient and secure services for both patients and healthcare
              providers.
            </p>
          </div>

          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Picture Placeholder
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;