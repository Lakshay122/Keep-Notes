import axios from "axios";
import React from "react";
import {
  CssBaseline,
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Avatar,
  Step,
  StepLabel,
  Grid,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import "react-phone-number-input/style.css";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#53B175",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#53B175",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#53B175",
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#53B175",
    },
  },
});

const BasicForm = ({
  formErrors,
  setFormErrors,
  image,
  setImage,
  initialValues,
  setInitialValues,
}) => {
  const handleImage = (e) => {
    console.dir(e);
    const data = e.target.files[0];
    setImage(data);
  };
  const handlePic = () => {
    setImage("");
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          {image ? (
            <div className="avatar">
              <Avatar
                src={URL.createObjectURL(image)}
                sx={{ width: 200, height: 200 }}
              ></Avatar>
              {/* <Button variant='outlined' sx={{mt: 1 , color: '#000000'}} onClick={handlePic}>delete</Button> */}
              <IconButton onClick={handlePic} aria-label="delete" size="large">
                <DeleteIcon />
              </IconButton>
            </div>
          ) : (
            <label className="flex">
              <UploadIcon sx={{ width: 100, height: 80, color: "#53B175" }} />
              <input className="hidden" type="file" onChange={handleImage} />
            </label>
          )}
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <CssTextField
            id="product-name"
            // label="Name"
            label="Product Name"
            variant="outlined"
            placeholder="Enter Product Name"
            fullWidth
            margin="normal"
            value={initialValues.productName}
            onChange={(event) => {
              setInitialValues({
                ...initialValues,
                name: event.target.value,
              });
            }}
            error={formErrors.productName}
            helperText={formErrors.productName}
          />
          <CssTextField
            id="Price"
            label="Product Price"
            type="number"
            placeholder="Enter Price"
            fullWidth
            margin="normal"
            value={initialValues.price}
            onChange={(event) => {
              setInitialValues({
                ...initialValues,
                price: event.target.value,
              });
            }}
            error={formErrors.price}
            helperText={formErrors.price}
          />
          <CssTextField
            id="product-name"
            type="number"
            label="Product Rating"
            variant="outlined"
            placeholder="Enter Product Rating"
            fullWidth
            margin="normal"
            value={initialValues.rating}
            onChange={(event) => {
              setInitialValues({
                ...initialValues,
                rating: event.target.value,
              });
            }}
            error={formErrors.rating}
            helperText={formErrors.rating}
          />
        </Grid>
      </Grid>
    </>
  );
};

const LinaerStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const [initialValues, setInitialValues] = useState({});
  const navigate = useNavigate()
  function getSteps() {
    return [
      "Product information",
      // "Office Information",
      // "Address",
    ];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <BasicForm
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            initialValues={initialValues}
            setInitialValues={setInitialValues}
            image={image}
            setImage={setImage}
          />
        );
      default:
        return "unknown step";
    }
  }

  const steps = getSteps();
  let value = localStorage.getItem("token");
  if(!value){
      value=sessionStorage.getItem("token")
  }

  const config = {
      "Content-Type": "multipart/form-data",
      headers: { Authorization: `Bearer ${value}` }
  };
  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(initialValues);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.Email) {
      errors.Email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.Email = "Email is not valid!";
    }

    return errors;
  };

  const handleNext = () => {
    if (activeStep == steps.length - 1) {
      setFormErrors(validate(initialValues));
      setIsSubmit(true);
      let formData = new FormData();
      formData.append("file", image);
      console.log(initialValues);
      Object.keys(initialValues).forEach((key) => {
        formData.append(`${key}`, initialValues[`${key}`]);
      });
      for (var pair of formData.entries()) {
        console.log(pair[0] + ":- " + pair[1]);
      }
      console.log(formData.entries());

      axios
        .post("http://localhost:5000/api/add-product", formData,config)
        .then((resp) => {
          console.log(resp.data);
          navigate("/");
          setActiveStep(activeStep + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setActiveStep(activeStep + 1);
    }
  };
  return (
    <>
      <CssBaseline />
      <Container
        component={Box}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        p={4}
      >
        <Paper component={Box} p={3} sx={{ maxWidth: 800 }}>
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {};

              return (
                <Step
                  key={index}
                  sx={{
                    "& .MuiStepLabel-root .Mui-active": {
                      color: theme.palette.primary.main, // circle color (COMPLETED)
                    },
                    "& .MuiStepLabel-root .Mui-completed": {
                      background: "white",

                      color: "gray", // circle color (COMPLETED)
                    },
                  }}
                >
                  <StepLabel {...labelProps}>{step}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === steps.length ? (
            <Typography>product added</Typography>
          ) : (
            <>
              <Box component="form" className="form">
                {getStepContent(activeStep)}

                {image == "" ||
                !initialValues.name ||
                !initialValues.price ||
                !initialValues.rating || initialValues.rating<0 || initialValues.rating>5? (
                  <Button
                    disabled
                    sx={{ mt: 2, mx: 2 }}
                    variant="contained"
                    style={{ backgroundColor: theme.palette.primary.main }}
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                ) : (
                  <Button
                    sx={{ mt: 2, mx: 2 }}
                    variant="contained"
                    style={{ backgroundColor: theme.palette.primary.main }}
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default LinaerStepper;
