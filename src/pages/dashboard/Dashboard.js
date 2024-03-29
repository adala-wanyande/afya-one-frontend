import "chartjs-adapter-date-fns";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Calendar from "react-github-contribution-calendar";
import NavBar from "../../components/navigation/NavBar";

// Import Chart.js components
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";

// ChartJS registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [workoutData, setWorkoutData] = useState({});
  const [weightsData, setWeightsData] = useState({ labels: [], data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const panelColors = {
    0: "#eeeeee",
    1: "#FFD700",
    2: "#FFD700",
    3: "#FFD700",
    4: "#FFD700",
    ">4": "#FFD700",
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          const userDocRef = doc(db, "users", userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const fullName = userDocSnap.data().fullName;
            const firstName = fullName.split(" ")[0];
            setFirstName(firstName);
          } else {
            console.log("No such document!");
          }

          // Fetch workouts
          const qWorkouts = query(
            collection(db, "workouts"),
            where("userId", "==", userId)
          );
          const querySnapshotWorkouts = await getDocs(qWorkouts);
          const workoutCounts = {};
          querySnapshotWorkouts.forEach((doc) => {
            const { date } = doc.data();
            workoutCounts[date] = (workoutCounts[date] || 0) + 1;
          });
          setWorkoutData(workoutCounts);

          const qWeights = query(
            collection(db, "weights"),
            where("userId", "==", user.uid)
          );
          const querySnapshotWeights = await getDocs(qWeights);
          const dates = [];
          const weights = [];
          querySnapshotWeights.forEach((doc) => {
            const data = doc.data();
            // Convert Firestore Timestamp to JavaScript Date object
            const date = data.date.toDate();
            // Optionally convert to string for easier handling, e.g., date.toISOString().split('T')[0]
            dates.push(date);
            weights.push(data.weight);
          });
          setWeightsData({ labels: dates, data: weights });
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setIsLoading(false); // Ensure isLoading is set to false here to handle both success and failure
        }
      } else {
        console.log("User is not signed in.");
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const today = new Date().toISOString().split("T")[0];

  const weightChartData = {
    labels: weightsData.labels,
    datasets: [
      {
        fill: "origin", // Fill to the x-axis
        label: "Weight over Time",
        data: weightsData.labels.map((label, index) => ({
          x: label,
          y: weightsData.data[index],
        })),
        borderColor: "#FFD700",
        backgroundColor: "#FFD700 ", // Consider adjusting opacity if needed
        tension: 0.1,
      },
    ],
  };

  const weightChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "MMMM DD, YYYY",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Weight (kg)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Weight Tracking",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-32">
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar></NavBar>
      <div className="mx-8 lg:mx-36 lg:scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-8">
        <h1>Welcome, {firstName}!</h1>
      </div>
      <div className="mx-8 lg:mx-36 mt-4">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Your Workout Contribution Graph
        </h3>
      </div>
      <div className="mx-8 lg:mx-36 mt-4 flex justify-center max-w-[800px]">
        <Calendar
          values={workoutData}
          until={today}
          panelColors={panelColors}
        />
      </div>
      <div className="mx-8 lg:mx-36 mt-8">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Your Weight Progress
        </h3>
        <div className="max-w-[800px] mx-8">
          <Line options={weightChartOptions} data={weightChartData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
