import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Edit, Delete, Share } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@material-ui/core";

import IconButton from "@mui/material/IconButton";
import {
  CssBaseline,
  Grid,
  Card,
  CardContent,
  Container,
  Avatar,
  TableBody,
  Table,
  TableRow,
  TableCell,
  Button,
  CardActions,
  CardHeader,
} from "@mui/material";
import axios from "axios";
import { createTheme } from "@mui/material/styles";
import CircleIcon from "@mui/icons-material/Circle";
import Rating from "@mui/material/Rating";
import { useEffect } from "react";
import AddNoteDialog from "../../Dilogues/AddNewDialogue";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
const theme = createTheme({
  palette: {
    custom: {
      main: "#53B175",
      green: "#56B378",
      light_green: "#0dc44f7d",
    },
  },
});

let value = localStorage.getItem("token");
if (!value) {
  value = sessionStorage.getItem("token");
}

const config = {
  headers: { Authorization: `Bearer ${value}` },
};

export default function Notes({searchNotes}) {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isDeleteClicked, setisDeleteClicked] = useState(true);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTitle, setEditTitle] = useState();
  const [editDescription, setEditDescription] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [notes, setNotes] = useState();
 
  useEffect(() => {
      if(searchNotes.length){
      setNotes(searchNotes); return }
    
      let value = localStorage.getItem("token");
      if (!value) {
        value = sessionStorage.getItem("token");
      }
      const config = {
        "Content-Type": "multipart/form-data",
        headers: { Authorization: `Bearer ${value}` },
      };

      axios
        .get("https://keepnotes-5qsn.onrender.com/api/get-notes", config)
        .then((res) => {
          setNotes(res.data.notes);
          setOpen(false);
          setRefresh(false);
        });
  }, [refresh,searchNotes]);
  

  


  const handleAddItem = (event) => {
    navigate("/products/newproduct");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
  };
  const handleSubmit = () => {
    const formData = new FormData()
    formData.append("title",title)
    formData.append("description",description)
    let value = localStorage.getItem("token");
if (!value) {
  value = sessionStorage.getItem("token");
}

const config = {
  headers: { Authorization: `Bearer ${value}` },
};
console.log(config)
    axios.post("https://keepnotes-5qsn.onrender.com/api/add-note",formData,config)
    .then((resp)=>{
        toast.success("Added successfully")
        setRefresh(true)
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })

  };

  
  const handleSave = (id) => {
    const formData = new FormData()
    formData.append("title",editTitle)
    formData.append("description",editDescription)
    axios.put(`https://keepnotes-5qsn.onrender.com/api/update-note/${id}`,formData,config)
    .then((resp)=>{
      setOpenEdit(false)
        toast.success("Updated successfully")
        setRefresh(true)
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  };

  const handleDelete = (id ) => {
    axios.delete(`https://keepnotes-5qsn.onrender.com/api/delete-note/${id}`,config)
    .then((resp)=>{
        toast.success("deleted successfully")
        setRefresh(true)
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  };

  const handleShare = () => {
    // Handle share functionality here
  };



  const [openShareDilogue, setOpenShareDilogue] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [id, setId] = useState("");

  const handleShareLink = (note) => {
    // Generate share link for note here
    const link = `http://example.com/note/${note._id}`;
    setShareLink(link);
    setOpenShareDilogue(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setOpenShareDilogue(false);
  };

  

  return (
    <>
      <Container sx={{ mt: 1, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
            <Button width={20} variant="outlined" onClick={handleOpen}>
              Create Note
            </Button>
          </Grid>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Note</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                fullWidth
                variant={"outlined"}
                margin="normal"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                multiline
                variant={"outlined"}
                rows={4}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>

          {/* Share dialog */}
          <Dialog
            open={openShareDilogue}
            onClose={() => {
              setOpenShareDilogue(false);
            }}
          >
            <DialogTitle>Share Note</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To share this note, copy the link below and send it to the
                recipient.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="link"
                label="Link"
                value={shareLink}
                fullWidth
                readOnly
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenShareDilogue(false);
                }}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleCopyLink} color="primary">
                Copy Link
              </Button>
            </DialogActions>
          </Dialog>

          {/* edit dilogue  */}
          <Dialog
            open={openEdit}
            onClose={() => {
              setOpenEdit(false);
            }}
          >
            <DialogTitle>Edit Note</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                fullWidth
                variant={"outlined"}
                margin="normal"
              />
              <TextField
                label="Description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                multiline
                variant={"outlined"}
                rows={4}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEdit(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => handleSave(id)}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {notes?.map((note, i) => (
            <>
              <Grid item xs={12} md={12} lg={12} key="1">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      borderRadius: "14px",
                      transition: "transform .2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <CardHeader
                        title={note.title}
                        titleTypographyProps={{
                          variant: "subtitle2",
                          paragraph: false,
                        }}
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/note/${note._id}`)}
                      />
                      <CardActions disableSpacing>
                        <IconButton
                          aria-label="Edit"
                          onClick={() => {
                            setOpenEdit(true);
                            setId(note._id);
                            setEditDescription(note.description);
                            setEditTitle(note.title);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          onClick={() => handleDelete(note._id)}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          aria-label="Share"
                          onClick={() => handleShareLink(note)}
                        >
                          <Share />
                        </IconButton>
                      </CardActions>
                    </div>
                    <CardContent
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/note/${note._id}`)}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {note.description.length > 270
                          ? `${note.description.slice(0, 270)}`
                          : note.description}
                        {note.description.length > 270 && (
                          <span style={{ color: "black", fontWeight: 500 }}>
                            ...Show more
                          </span>
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            </>
          ))}
        </Grid>
      </Container>
    </>
  );
}
