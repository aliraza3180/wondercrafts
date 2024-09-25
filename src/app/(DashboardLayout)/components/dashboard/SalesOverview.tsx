import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { db } from "@/utils/firebase"; // Import the Firestore database
import { collection, addDoc } from "firebase/firestore";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  pb: 2,
  borderRadius: "20px",
  width: "572px",
};

interface CustomContainerProps {
  onAddCheckIn: (data: any) => void;
}

const CustomContainer: React.FC<CustomContainerProps> = ({ onAddCheckIn }) => {
  const [openMainModal, setOpenMainModal] = useState<boolean>(false);
  const [openNestedModal, setOpenNestedModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    title: string;
    name: string;
    uploadedFile: File | null;
    bookingID: string;
    rooms: number;
    guests: number;
    bookedDate: string;
  }>({
    title: "",
    name: "",
    uploadedFile: null,
    bookingID: "12345678",
    rooms: 4,
    guests: 4,
    bookedDate: "12th Nov, 2022",
  });

  const handleOpenMainModal = (): void => {
    setOpenMainModal(true);
  };

  const handleCloseMainModal = (): void => {
    setOpenMainModal(false);
  };

  const handleOpenNestedModal = (): void => {
    setOpenNestedModal(true);
    setOpenMainModal(false);
  };

  const handleCloseNestedModal = (): void => {
    setOpenNestedModal(false);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        uploadedFile: files[0],
      }));
      console.log("Uploaded file:", files[0]);
    }
  };

  const handleOk = async () => {
    try {
      // Send data to Firestore
      const docRef = await addDoc(collection(db, "checkin"), {
        title: formData.title,
        name: formData.name,
        bookingID: formData.bookingID,
        rooms: formData.rooms,
        guests: formData.guests,
        bookedDate: formData.bookedDate,
      });
      console.log("Document written with ID: ", docRef.id);
      onAddCheckIn(formData); 
      handleCloseNestedModal(); 
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "rooms" || name === "guests" ? Number(value) : value, 
    }));
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("/images/products/header-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "279px",
        position: "relative",
        borderRadius: "20px",
      }}
    >
      <Box
        sx={{
          backgroundImage: 'url("/images/products/gradient-bg.png")',
          padding: "40px",
          borderRadius: "20px",
          width: "40%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h1" sx={{ mb: 2, color: "#fff" }}>
          Hi! 👋 James Doe
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "#fff", maxWidth: "100%" }}
        >
          Lorem ipsum dolor sit amet, something important to say here.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: "999px" }}
          onClick={handleOpenMainModal}
        >
          Add Check In
        </Button>
      </Box>

      {/* Main Modal */}
      <Modal
        open={openMainModal}
        onClose={handleCloseMainModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-title"
            variant="h6"
            sx={{
              width: "100%",
              py: 2,
              borderRadius: "20px 20px 0px 0px",
              px: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#F8F8F8",
            }}
          >
            Add Check In
            <ClearIcon
              onClick={handleCloseMainModal}
              style={{ cursor: "pointer" }}
            />
          </Typography>

          <Typography
            sx={{
              pt: 2,
              px: 3,
              fontSize: "16px",
              fontWeight: "medium",
              color: "black",
            }}
          >
            Title
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            sx={{
              margin: "16px 24px 0px 24px",
              maxWidth: "525px",
              width: "100%",
              alignSelf: "center",
            }}
          />

          <Typography
            sx={{
              pt: 2,
              px: 3,
              paddingBottom: 2,
              fontSize: "16px",
              fontWeight: "medium",
              color: "black",
            }}
          >
            Upload Image
          </Typography>
          <Box
            sx={{
              marginTop: "16px",
              border: "2px dashed grey",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
              maxWidth: "525px",
              width: "100%",
              margin: "0 auto",
              height: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: formData.uploadedFile
                ? `url(${URL.createObjectURL(formData.uploadedFile)})`
                : "none",
              "&:hover": {
                backgroundColor: formData.uploadedFile
                  ? "transparent"
                  : "#f5f5f5",
              },
            }}
          >
            {!formData.uploadedFile && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <IconButton
                    component="span"
                    color="primary"
                    aria-label="upload picture"
                  >
                    <CloudUploadIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="body2" color="textSecondary">
                    Click or drag file to this area to upload
                  </Typography>
                  <Typography variant="caption" display="block">
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other banned files.
                  </Typography>
                </label>
              </>
            )}
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              px: 3,
              alignItems: "end",
              justifyContent: "end",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              sx={{ borderRadius: "999px" }}
              onClick={handleCloseMainModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "999px" }}
              color="primary"
              onClick={handleOpenNestedModal}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Nested Modal */}
      <Modal
        open={openNestedModal}
        onClose={handleCloseNestedModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: "700px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* First Box: Title and Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              borderRadius: "20px 20px 0 0",
              background: "#F8F8F8",
            }}
          >
            <Typography variant="h6">Detail</Typography>
            <ClearIcon
              onClick={handleCloseNestedModal}
              style={{ cursor: "pointer" }}
            />
          </Box>

          {/* Second Box: Fields and Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 3,
              margin: "40px 0px",
            }}
          >
            {/* Left Side: Input Fields with Labels */}
            <Box
              sx={{
                display: "flex",
                width: "50%",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              {/* Name Field */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mr: 2,
                    fontSize: "16px",
                    fontWeight: "medium",
                    color: "black",
                  }}
                >
                  Name
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="name"
                  sx={{
                    maxWidth: "133px",
                    maxHeight: "32px",
                    "& .MuiInputBase-input": {
                      padding: "4px", // Remove padding
                    },
                  }}
                  value={formData.name}
                  onChange={handleChange}
                />
              </Box>

              {/* Booking ID Field */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mr: 2,
                    fontSize: "16px",
                    fontWeight: "medium",
                    color: "black",
                  }}
                >
                  Booking ID
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="bookingID"
                  sx={{
                    maxWidth: "133px",
                    maxHeight: "32px",
                    "& .MuiInputBase-input": {
                      padding: "4px", // Remove padding
                    },
                  }}
                  value={formData.bookingID}
                  onChange={handleChange}
                />
              </Box>

              {/* Rooms Field */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mr: 2,
                    fontSize: "16px",
                    fontWeight: "medium",
                    color: "black",
                  }}
                >
                  Rooms
                </Typography>
                <TextField
                  variant="outlined"
                  type="text"
                  fullWidth
                  name="rooms"
                  sx={{
                    maxWidth: "38px",
                    maxHeight: "32px",
                    "& .MuiInputBase-input": {
                      padding: "4px 0 4px 14px", // Remove padding
                    },
                  }}
                  value={formData.rooms}
                  onChange={handleChange}
                />
              </Box>

              {/* Number of Guests Field */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mr: 2,
                    fontSize: "16px",
                    fontWeight: "medium",
                    color: "black",
                  }}
                >
                  Number of Guests
                </Typography>
                <TextField
                  variant="outlined"
                  type="text"
                  fullWidth
                  name="guests"
                  sx={{
                    maxWidth: "38px",
                    maxHeight: "32px",
                    "& .MuiInputBase-input": {
                      padding: "4px 0 4px 14px", // Remove padding
                    },
                  }}
                  value={formData.guests}
                  onChange={handleChange}
                />
              </Box>

              {/* Booked Date Field */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mr: 2,
                    fontSize: "16px",
                    fontWeight: "medium",
                    color: "black",
                  }}
                >
                  Booked Date
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="bookedDate"
                  value={formData.bookedDate}
                  onChange={handleChange}
                  sx={{
                    maxWidth: "133px",
                    "& .MuiInputBase-input": { padding: "4px" },
                  }}
                />
              </Box>
            </Box>

            {/* Right Side: Image Preview */}
            <Box
              sx={{
                display: "flex",
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {formData.uploadedFile ? (
                <img
                  src={URL.createObjectURL(formData.uploadedFile)}
                  alt="Uploaded Preview"
                  style={{
                    maxHeight: "134px",
                    maxWidth: "256px",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No Image Uploaded
                </Typography>
              )}
            </Box>
          </Box>

          {/* Button Section */}
          <Box
            sx={{
              mt: 3,
              px: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCloseNestedModal}
              sx={{ borderRadius: "999px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOk}
              sx={{ borderRadius: "999px" }}
            >
              OK{" "}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomContainer;
