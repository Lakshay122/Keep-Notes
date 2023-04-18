import React from "react";
import { useLocation } from "react-router-dom";
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
import { useParams } from "react-router-dom";
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
const SingleNote = () => {
  const navigate = useNavigate()
  const loggedInUser = localStorage.getItem("userId")

  const [openShareDilogue, setOpenShareDilogue] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [refresh, setRefresh] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const params = useParams();
  const { id } = params;

  const handleSave = (id) => {
    const formData = new FormData()
    formData.append("title",editTitle)
    formData.append("description",editDescription)
    axios.put(`https://keepnotes-5qsn.onrender.com/api/update-note/${id}`,formData,config)
    .then((resp)=>{
        toast.success("Updated successfully")
        setOpenEdit(false)
        setRefresh(true)
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  };




  const handleShareLink = (note) => {
    // Generate share link for note here
    const link = `https://superb-selkie-bf2228.netlify.app/note/${note._id}`;
    setShareLink(link);
    setOpenShareDilogue(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setOpenShareDilogue(false);
  };

  let value = localStorage.getItem("token");
  if (!value) {
    value = sessionStorage.getItem("token");
  }
  const config = {
    "Content-Type": "multipart/form-data",
    headers: { Authorization: `Bearer ${value}` },
  };
  useEffect(() => {

    axios
      .get(
        `https://keepnotes-5qsn.onrender.com/api/get-single-note/${id}`,
        config
      )
      .then((res) => {
        setNote(res.data.note);
        
        setRefresh(false)
      });
  }, [refresh]);

  const [note, setNote] = useState({});

  const handleDelete = (id ) => {
    axios.delete(`https://keepnotes-5qsn.onrender.com/api/delete-note/${id}`,config)
    .then((resp)=>{
        toast.success("deleted successfully")
        navigate('/')
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  };

  return (
    <Container sx={{ mt: 3, mb: 3 }}>
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
              cursor: "pointer",
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
                // subheader={`Last updated: ${new Date(note.lastUpdated).toLocaleString()}`}
                subheader={
                  note.updatedAt ? `Last updated: ${note.updatedAt}` : null
                }
                subheaderTypographyProps={{
                  variant: "subtitle2",
                  color: "textSecondary",
                  paragraph: false,
                }}
              />
              {note.user == loggedInUser &&
              <CardActions disableSpacing>
                <IconButton aria-label="Edit" onClick={() => {
                            setOpenEdit(true);
                            setEditDescription(note.description);
                            setEditTitle(note.title);
                          }}>
                  <Edit />
                </IconButton>
                <IconButton aria-label="Delete" onClick={()=>handleDelete(note._id)}>
                  <Delete />
                </IconButton>
                <IconButton aria-label="Share" onClick={()=> handleShareLink(note)}>
                  <Share />
                </IconButton>
              </CardActions>}
            </div>
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {note.description}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Grid>

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
    </Container>
  );
};

export default SingleNote;
