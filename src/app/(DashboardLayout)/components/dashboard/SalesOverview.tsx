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
import { db } from "@/utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";

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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const defaultFormData = {
    title: "",
    name: "",
    uploadedFile: null as File | null,
    bookingID: "12345678",
    rooms: 4,
    guests: 4,
    bookedDate: format(new Date(), "yyyy-MM-dd"),
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleOpenMainModal = (): void => {
    setOpenMainModal(true);
    setFormData(defaultFormData);
    setFormErrors({});
  };

  const handleCloseMainModal = (): void => {
    setOpenMainModal(false);
    setFormData(defaultFormData);
    setFormErrors({});
  };

  const handleOpenNestedModal = (): void => {
    const errors: { [key: string]: string } = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.uploadedFile) errors.uploadedFile = "Image is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setOpenNestedModal(true);
      setOpenMainModal(false);
      setFormErrors({});
    }
  };

  const handleCloseNestedModal = (): void => {
    setOpenNestedModal(false);
    setFormData(defaultFormData);
    setFormErrors({});
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        uploadedFile: files[0],
      }));
      setFormErrors((prevErrors) => ({ ...prevErrors, uploadedFile: "" }));
    }
  };

  const uploadFile = async (file: File) => {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleOk = async () => {
    const errors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        errors[key] = `${key} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      let fileUrl = "";
      if (formData.uploadedFile) {
        fileUrl = await uploadFile(formData.uploadedFile);
      }

      const docRef = await addDoc(collection(db, "checkin"), {
        ...formData,
        uploadedFile: fileUrl,
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
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const date = new Date(value);
    const formattedDate = format(date, "yyyy-MM-dd");
    setFormData((prevData) => ({
      ...prevData,
      bookedDate: formattedDate,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, bookedDate: "" }));
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
            error={!!formErrors.title}
            helperText={formErrors.title}
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
                <img
    src="/images/logos/upload.png" 
    alt="Upload"
    style={{ width: '35.11px', height: '35.11px' , marginBottom:"12px" }} 
  />
                  <Typography variant="h5" color="black">
                    Click or drag file to this area to upload
                  </Typography>
                  <Typography variant="h6" color="#B4B4B4" fontStyle="regular" marginTop="4px" maxWidth="395px" fontSize="14px" display="block">
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other banned files.
                  </Typography>
                </label>
              </>
            )}
          </Box>
          {formErrors.uploadedFile && (
            <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
              {formErrors.uploadedFile}
            </Typography>
          )}

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

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 3,
              margin: "40px 0px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "50%",
                flexDirection: "column",
                gap: "30px",
              }}
            >
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
                      padding: "4px",
                    },
                  }}
                  value={formData.name}
                  onChange={handleChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Box>

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
                      padding: "4px",
                    },
                  }}
                  value={formData.bookingID}
                  onChange={handleChange}
                  error={!!formErrors.bookingID}
                  helperText={formErrors.bookingID}
                />
              </Box>

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
                  type="number"
                  fullWidth
                  name="rooms"
                  sx={{
                    maxWidth: "38px",
                    maxHeight: "32px",
                    "& .MuiInputBase-input": {
                      padding: "4px 0 4px 14px",
                    },
                  }}
                  value={formData.rooms}
                  onChange={handleChange}
                  error={!!formErrors.rooms}
                  helperText={formErrors.rooms}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              ><Typography
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
              type="number"
              fullWidth
              name="guests"
              sx={{
                maxWidth: "38px",
                maxHeight: "32px",
                "& .MuiInputBase-input": {
                  padding: "4px 0 4px 14px",
                },
              }}
              value={formData.guests}
              onChange={handleChange}
              error={!!formErrors.guests}
              helperText={formErrors.guests}
            />
          </Box>

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
              onChange={handleDateChange}
              sx={{
                maxWidth: "133px",
                "& .MuiInputBase-input": { padding: "4px" },
              }}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!formErrors.bookedDate}
              helperText={formErrors.bookedDate}
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
          OK
        </Button>
      </Box>
    </Box>
  </Modal>
</Box>
);
};

export default CustomContainer;