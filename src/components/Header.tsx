import { useState, useEffect } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-64 right-0 z-50 transition-all duration-300 animate-fadeIn
        ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-md"
            : "bg-white/50 backdrop-blur-sm"
        }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-hospital-primary">
          CSS326 Hospital
        </h1>
        <div className="flex items-center space-x-4">
          {/* Add additional header content here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
