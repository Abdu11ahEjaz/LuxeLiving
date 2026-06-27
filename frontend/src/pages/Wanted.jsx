import { useState } from "react";

const Wanted = () => {
  const [activeTab, setActiveTab] = useState("buy");
  const [formData, setFormData] = useState({
    propertyType: "",
    city: "",
    area: "",
    name: "",
    countryCode: "+92",
    phone: "",
    details: "",
    agreed: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear message when user starts typing
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    const requiredFields = ["propertyType", "city", "area", "name", "phone"];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      });
      return;
    }

    if (!formData.agreed) {
      setMessage({
        type: "error",
        text: "Please agree to the terms of service",
      });
      return;
    }

    if (formData.phone.length < 7) {
      setMessage({
        type: "error",
        text: "Please enter a valid phone number",
      });
      return;
    }

    // Submit form
    submitForm();
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      const submitData = {
        ...formData,
        type: activeTab, // Add buy or rent type
        phone: formData.countryCode + formData.phone,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/properties/wanted`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Your inquiry has been submitted successfully! We'll contact you soon.",
        });
        // Reset form
        setFormData({
          propertyType: "",
          city: "",
          area: "",
          name: "",
          countryCode: "+92",
          phone: "",
          details: "",
          agreed: false,
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to submit your inquiry. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({
        type: "error",
        text: "An error occurred while submitting your inquiry. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
     <div className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-16">
        {/* Left - Form */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Tell us what you need
          </h2>

          {/* Buy / Rent Toggle */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab("buy")}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded border-2 transition-all ${
                activeTab === "buy"
                  ? "border-red-500 text-red-500"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
              </svg>
              <span className="text-xs font-medium">Buy</span>
            </button>
            <button
              onClick={() => setActiveTab("rent")}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded border-2 transition-all ${
                activeTab === "rent"
                  ? "border-red-500 text-red-500"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="text-xs font-medium">Rent</span>
            </button>
          </div>

          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Provide details by filling out the form
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              >
                <option value="">Property Type *</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="relative">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              >
                <option value="">City of Interest *</option>
                <option value="lahore">Lahore</option>
                <option value="karachi">Karachi</option>
                <option value="islamabad">Islamabad</option>
                <option value="rawalpindi">Rawalpindi</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="relative">
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              >
                <option value="">Area of Interest *</option>
                <option value="dha">DHA</option>
                <option value="bahria">Bahria Town</option>
                <option value="gulberg">Gulberg</option>
                <option value="model-town">Model Town</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Name *"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            />

            <div className="flex border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-red-400">
              <div className="flex items-center gap-2 px-3 bg-gray-100 border-r border-gray-300">
                <span className="text-lg">🇵🇰</span>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="bg-transparent text-gray-800 text-sm focus:outline-none"
                >
                  <option value="+92">+92</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                </select>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="--- ---------- *"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 px-4 py-3 bg-white text-gray-800 focus:outline-none text-sm"
              />
            </div>

            <div>
              <textarea
                name="details"
                placeholder="Additional Details"
                value={formData.details}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none text-sm"
              />
              <span className="text-xs text-gray-500">Optional</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-red-400"
              />
              <span className="text-xs text-gray-700">
                I have read and agree to the{" "}
                <a href="#" className="text-red-400 underline">
                  Graana's Term of Service
                </a>
              </span>
            </label>

            {message.text && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gray-400 text-white font-semibold uppercase tracking-wide rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </form>
        </div>

        {/* Right - Wanted Steps */}
        <div className="flex-1">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Wanted</h2>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">
              For the first time in Pakistan, activate a team of experts in just 3 clicks to find
              the properties you need with completely secure and transparent transactions
            </p>
          </div>

          <div className="space-y-6">
            {[
              { img: "https://res.cloudinary.com/dnrpwpdqv/image/upload/v1771233390/step_1_tkcylq.jpg", num: 1, title: "Tell us what you need.", text: "It won't take more than a minute" },
              { img: "https://res.cloudinary.com/dnrpwpdqv/image/upload/v1771233390/step_2_hf2hsq.jpg", num: 2, title: "Get a response within an hour, start viewing properties the same day", text: "" },
              { img: "https://res.cloudinary.com/dnrpwpdqv/image/upload/v1771233390/step_3_b6pnh9.jpg", num: 3, title: "Move in to your new home", text: "" },
            ].map((step, index) => (
              <div key={step.num} className="relative">
                {/* Connector line
                {index < 2 && (
                  <div className="absolute left-12 top-36 w-0.5 h-16 bg-red-400"></div>
                )} */}
                
                <div className="relative flex gap-6">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center text-sm font-bold">
                      {step.num}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white border-2 border-red-300 rounded-2xl p-3 pb-4">
                    <div className="flex gap-2">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                        <img 
                          src={step.img} 
                          alt={`Step ${step.num}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Text */}
                      <div className="flex flex-col justify-center flex-1">
                        <p className="text-xs text-gray-700 leading-tight">
                          {step.title}
                          {step.text && <> {step.text}</>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wanted