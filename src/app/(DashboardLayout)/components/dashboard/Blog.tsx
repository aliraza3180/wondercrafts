import Link from "next/link";
import { CardContent, Typography, Grid, Button, Box } from "@mui/material";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";

interface BlogProps {
  data: any[];
}

const Blog = ({ data }: BlogProps) => {
  return (
    <Grid container spacing={3}>
      {data.map((product, index) => {
        console.log(product, "product");

        // Create a URL for the uploaded file
        const imageUrl = product.uploadedFile
          ? URL.createObjectURL(product.uploadedFile)
          : "";

        return (
          <Grid item xs={12} md={4} lg={3} key={index}>
            <BlankCard>
              <Typography component={Link} href="/" sx={{ display: "block" }}>
                <img
                  src={imageUrl}
                  alt={product.title}
                  style={{
                    height: "160px",
                    width: "100%",
                    borderRadius: "18px",
                  }}
                />
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  position: "absolute",
                  top: "25px",
                  right: "25px",
                  borderRadius: "999px",
                  fontSize: "14px",
                }}
              >
                Checked In
              </Button>
              <CardContent
                sx={{
                  p: 3,
                  pt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <Typography variant="h4" sx={{ fontSize: "20px" }}>
                  {product.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "16px",
                    color: "#718096",
                    fontWeight: "regular",
                  }}
                >
                  {product.bookedDate}
                </Typography>
                <Box
                  sx={{
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/images/products/Avatar.png" // Updated the path
                    alt="Owner Avatar" // Added alt text for accessibility
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "100%",
                    }}
                  />
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    Owner: {product.name}
                  </Typography>
                </Box>
              </CardContent>
            </BlankCard>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Blog;
