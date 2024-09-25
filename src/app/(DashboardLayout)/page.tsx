"use client";
import ListIcon from "@mui/icons-material/List";
import { Grid, Box, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
import { useEffect, useState } from "react";
import CustomContainer from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import { db } from "@/utils/firebase";
import { collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";

const Dashboard = () => {
  const [checkInData, setCheckInData] = useState<any[]>([]);
  const [data, setData] = useState<any>(null); // Updated to type any[]
  const [error, setError] = useState<string | null>(null);

  async function fetchAllData() {
    const querySnapshot = await getDocs(collection(db, "checkin"));
    const dataFetched = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCheckInData(dataFetched);
  }

  async function addSingleValue(data: FormData) {
    try {
      const docRef = await addDoc(collection(db, "checkin"), {});
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const deleteEntry = async (id: any) => {
    try {
      await deleteDoc(collection(db, "checkin", id)); // Get document reference by ID and delete
      console.log("Document successfully deleted!");
      // fetchUsers();  // Refresh the users list after deletion
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleAddCheckIn = (data: any) => {
    console.log(data, "data");
    setCheckInData((prev) => [...prev, data]);
  };

  useEffect(() => {
    // const dbRef = ref(database, "path/to/data");

    // // Listen for data updates
    // const unsubscribe = onValue(
    //   dbRef,
    //   (snapshot) => {
    //     if (snapshot.exists()) {
    //       setData(snapshot.val());
    //     } else {
    //       setData("No data available");
    //     }
    //   },
    //   (errorObject) => {
    //     setError("The read failed: " + errorObject.name);
    //     console.error("Firebase read failed:", errorObject);
    //   }
    // );

    // return () => unsubscribe();

    fetchAllData();
  }, []);

  return (
    <PageContainer title="HomePage" description="This is the HomePage">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            {error && <Typography color="error">Error: {error}</Typography>}
            {data ? (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
              <Typography>No data available</Typography>
            )}
            <CustomContainer onAddCheckIn={handleAddCheckIn} />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "20px 0",
                fontSize: "30px",
              }}
            >
              <Typography
                variant="h2"
                sx={{ fontSize: "30px", fontWeight: "medium" }}
              >
                Added CheckIns
              </Typography>
              <ListIcon sx={{ fontSize: 25 }} /> {/* Simplified styling */}
            </Box>
            {checkInData.length > 0 ? (
              <Blog data={checkInData} />
            ) : (
              <Typography
                variant="h5"
                sx={{ textAlign: "center", marginTop: "100px" }}
              >
                There is no data here ...!
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
