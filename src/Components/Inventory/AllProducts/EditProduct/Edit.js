import React from "react";
import {
  CssBaseline,
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import "react-phone-number-input/style.css";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import { Navigate, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { Image } from "mui-image";
import axios from "axios";
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

const Edit = () => {
  const location = useLocation();
  const product = location.state.product;
  const [image, setImage] = React.useState("");
  const [productName,setProductName] = React.useState(product.name);
  const [price,setPrice] = React.useState(product.price);
  const [rating,setRating] = React.useState(product.rating)

  const handleImage = (e) => {
    console.log(e);
    const data = e.target.files[0];

    console.log(data);
    setImage(data);
    // setAnchorEl(null);
  };
  let value = localStorage.getItem("token");
  if(!value){
      value=sessionStorage.getItem("token")
  }

  const config = {
      "Content-Type": "multipart/form-data",
      headers: { Authorization: `Bearer ${value}` }
  };
  const handleCloseSaveChanges = () => {
  
    let formData = new FormData();
    formData.append("public_image_id", product.public_image_id)
   image? formData.append("file", image):formData.append("file", product.image)
    formData.append("name", productName)
    formData.append("price", price)
    formData.append("rating", rating)
  
    for (var pair of formData.entries()) {
        console.log(pair[0] + ':- ' + pair[1]);
    }
       console.log("hey")
    axios.put(`http://localhost:5000/api/update-product/${product._id}`, formData,config)
        .then((resp) => {
            console.log("data",resp.data)
            navigate("/")
        })
        .catch((error) => {
            console.log(error);
        });

};
  const navigate = useNavigate();
  console.log(product);
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80%",
      }}
    >
      <Paper component={Box} p={3} sx={{ maxWidth: 800 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              fontSize={20}
              fontWeight="medium"
              sx={{ color: "#53B175" }}
            >
              Edit Product
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{display:"flex",justifyContent:"center",alignItems:"center"}} md={6} lg={4}>
            {image ? (
              <Image
                src={URL.createObjectURL(image)}
                alt={"product image"}
                width={200}
                height={200}
                style={{
                  borderRadius: 10,
                  border: "2px solid white",
                  
                }}
                cover="true"
              />
            ) : (
              <Image
                src={product.image}
                alt={"product image"}
                width={200}
                height={200}
                style={{
                  borderRadius: 10,
                  border: "2px solid white",
                
                }}
                cover="true"
              />
            )}
            <Tooltip title="Change Image">
              <IconButton
                aria-label="more"
                id="long-button"
                bgcolor="white"
                className="Card"
                m={1}
                sx={{
                  position: "relative",
                  
                
                  bottom: 120,
                  width: 38,
                  height: 38,
                  background: "white",
                  "&: hover": { background: "white" },
                }}
                aria-haspopup="true"
                // onClick={handleClick3dot}
              >
                <label>
                  <EditIcon />
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImage}
                  />
                </label>
              </IconButton>
            </Tooltip>
            
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
              value={productName}
              onChange={(event) => {
                setProductName( event.target.value )
              }}
              // error={formErrors.productName}
              // helperText={formErrors.productName}
            />
            <CssTextField
              id="Descripton"
              // label="Mobile"
              label="Price"
              type="text"
              variant="outlined"
              placeholder="Enter Price"
              fullWidth
              margin="normal"
              value={price}
              onChange={(event) => {
                  setPrice( event.target.value )
              }}
              // error={formErrors.Description}
              // helperText={formErrors.Description}
            />
            <CssTextField
              id="Description"
              // label="Mobile"
              label="Rating"
              type="number"
              placeholder="Enter Rating"
              fullWidth
              margin="normal"
              value={rating}
              onChange={(event) => {
                  setRating( event.target.value )
              }}
              // error={formErrors.Description}
              // helperText={formErrors.Description}
            />
          </Grid>

          <Grid
            item
            sx={12}
            md={12}
            lg={12}
            sx={{ display: "flex", justifyContent: "end" }}
          >
            <Button
            
              sx={{ bgcolor: "#53B175", color: "#fff", marginRight: "15px","&:hover":{bgcolor:"#53B175"} }}
            onClick={()=>{
                navigate(-1)
            }} >
              Cancel
            </Button>
            {
                productName=="" || price=="" || rating<0 || rating>5 ?  <Button disabled ml={3} sx={{ bgcolor: "#53B175", color: "#fff" ,"&:hover":{bgcolor:"#53B175"}}}>
                Save
              </Button>:
            
            <Button ml={3} sx={{ bgcolor: "#53B175", color: "#fff" ,"&:hover":{bgcolor:"#53B175"}}} onClick={handleCloseSaveChanges}>
              Save
            </Button>}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};


export default Edit;
