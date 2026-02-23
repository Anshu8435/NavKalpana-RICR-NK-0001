import { useState } from "react";

function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    age: "",
    address: "",
  });

  const [patientId, setPatientId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const generatePatientID = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `PT-${year}-${randomNumber}`;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.contact.trim())
      newErrors.contact = "Contact number is required";

    if (!formData.age.trim())
      newErrors.age = "Age is required";
    else if (Number(formData.age) < 1)
      newErrors.age = "Age must be at least 1";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const newID = generatePatientID();
    setPatientId(newID);

    setSuccessMessage(
      `✅ Patient Registered Successfully!\nGenerated ID: ${newID}`
    );

    setFormData({
      firstName: "",
      lastName: "",
      contact: "",
      age: "",
      address: "",
    });

    setTimeout(() => setSuccessMessage(""), 8000);
  };

  return (
    <div className="flex-1 bg-gray-100 p-6 lg:p-10 ">
      
      {/* MAIN CONTAINER FULL WIDTH */}
      <div className="w-full">
        
        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-12">

          {/* HEADER */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#0a3d62]">
              Patient Registration
            </h2>
            <p className="text-gray-500 mt-2">
              Register new patient for screening
            </p>
          </div>

          {/* FORM GRID */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >

            {/* Patient ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient ID
              </label>
              <input
                type="text"
                value={patientId}
                readOnly
                placeholder="Will generate after registration"
                className="w-full px-4 py-3 rounded-xl border bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-[#0a3d62]/30`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-[#0a3d62]/30`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contact"
                value={formData.contact}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.contact ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-[#0a3d62]/30`}
              />
              {errors.contact && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contact}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                min="1"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.age ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-[#0a3d62]/30`}
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.age}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                rows={1}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0a3d62]/30"
              />
            </div>

            {/* Submit + Success */}
            <div className="md:col-span-2 flex flex-col items-end gap-4">
              <button
                type="submit"
                className="bg-[#ff6b4a] hover:bg-[#e55039] text-white px-10 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.03]"
              >
                Register Patient
              </button>

              {successMessage && (
                <div className="w-full p-4 bg-green-50 border border-green-300 rounded-xl text-green-700 font-semibold text-center whitespace-pre-line">
                  {successMessage}
                </div>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;