import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CreateUserInfoForm() {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [startingWeight, setStartingWeight] = useState("");
  const [height, setHeight] = useState("");
  const navigate = useNavigate();
  const [shouldRenderForm, setShouldRenderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status
  const [errors, setErrors] = useState({}); // New state for managing input validation errors

  useEffect(() => {
    const checkUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          alert("User information already exists.");
          navigate("/user/");
        } else {
          setShouldRenderForm(true);
        }
      } else {
        navigate("/signin");
      }
    };

    checkUserInfo();
  }, [navigate]);

  const validateForm = () => {
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Name is required.";
    // Assuming dateOfBirth is in 'YYYY-MM-DD' format for simplicity. Adjust validation as needed.
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
    if (startingWeight <= 0)
      newErrors.startingWeight = "Starting weight must be greater than zero.";
    if (height <= 0) newErrors.height = "Height must be greater than zero.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Begin submission, disable the button

    if (!validateForm()) {
      setIsSubmitting(false); // Re-enable the button if validation fails
      return; // Prevent form submission
    }

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userInfo = { fullName, dateOfBirth, startingWeight, height };

      try {
        await setDoc(doc(db, "users", userId), userInfo);
        alert("User information saved successfully!");
        navigate("/dashboard/");
      } catch (error) {
        console.error("Error adding document: ", error);
        setIsSubmitting(false); // In case of error, re-enable the button
      }
    }
  };

  if (!shouldRenderForm) {
    return null;
  }

  return (
    <div class="justify-center flex mt-16">
      <div class="rounded-xl border bg-card text-card-foreground shadow w-[340px]">
        <div class="flex flex-col p-6 space-y-1">
          <h3 class="font-semibold tracking-tight text-2xl">
            Welcome to Afya One!
          </h3>
          <p class="text-sm text-muted-foreground">
            Let's get to know you. Feel free to share. This is a safe space.
          </p>
        </div>
        <form onSubmit={handleSubmit} class="p-6 pt-0 grid gap-4">
          <div class="grid gap-2">
            <label class="text-sm font-medium leading-none" for="fullName">
              What's your name?
            </label>
            <input
              class="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {errors.fullName && (
              <div className="text-red-500 text-sm">{errors.fullName}</div>
            )}
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium leading-none" for="dateOfBirth">
              When were you born?
            </label>
            <input
              class="w-[160px] flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              type="date"
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div class="grid gap-2">
            <label
              class="text-sm font-medium leading-none"
              for="startingWeight"
            >
              What's your starting weight? (kg)
            </label>
            <input
              class="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              id="startingWeight"
              type="number"
              value={startingWeight}
              onChange={(e) => setStartingWeight(e.target.value)}
              placeholder="Starting Weight"
              required
            />
            {errors.startingWeight && (
              <div className="text-red-500 text-sm">
                {errors.startingWeight}
              </div>
            )}
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium leading-none" for="height">
              What's your starting height? (cm)
            </label>
            <input
              class="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height"
              required
            />
            {errors.height && (
              <div className="text-red-500 text-sm">{errors.height}</div>
            )}
          </div>
          <div class="flex items-center pt-4">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserInfoForm;
