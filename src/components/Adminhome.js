import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import {auth,db} from '../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from 'firebase/auth';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { doc, getDoc, onSnapshot,getDocs,collection } from "firebase/firestore";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Grid } from '@mui/material';
import { server_home } from '../secret';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display:'flex',
};

class QuizDetails{
  constructor(quiz_title,quiz_duration){
    this.quiz_title = quiz_title;
    this.quiz_duration = quiz_duration;
  }
};



function Adminhome() {
  
  const [quizes_id_list,setQuizesIdList] = React.useState([]);
  const [quiz_list,setQuizList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  
  

  React.useEffect(()=>{
    //setQuizList([]);
    setQuizesIdList([]);
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
        var quiz_data = doc.data().quizes;
        quiz_data.reverse();
        setQuizesIdList(quiz_data);
    });

    //return () => unsub();
  },[]);
  React.useEffect(()=>{
    setQuizList([]);
    // test
    async function get_quizes(quiz_id){
      const docrf = doc(db,"quizes",quiz_id);
      const datasnap = await getDoc(docrf);
      if (datasnap.exists()){
        var data = datasnap.data();
        var quiz_obj = new QuizDetails(data.Title,data.quizDuration);
        setQuizList(oldList => [...oldList,quiz_obj]);
      }
      else
      console.log("no data");
    }
    quizes_id_list.map((q_id,idx)=>{
      get_quizes(q_id);
    })
    //
    console.log("quizes id list changed");
  },[quizes_id_list])
  const navigate = useNavigate();
  
  function logout_clicked(){
    signOut(auth).then(()=>{
      // navigate to home
      navigate('/');
    }).catch((err)=>{
      alert(err);
    })
  }
  return (
    <div >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Admin Home
              </Typography>
              <Button color="inherit" onClick={logout_clicked}>Logout</Button>
            </Toolbar>
          </AppBar>
        </Box>
        <br/><br/>
        <Box sx={{ display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
          <Grid>
              <Link to="createquiz" style={{ textDecoration: 'none' }} >
                  <Button variant="contained" size="large">Create Quiz</Button>
              </Link>
          </Grid>
          <br/>
          
          <h1>Recent Quizes</h1>
          </Box>
          <List sx={{margin:'30px'}}>
            {
              quiz_list.map((quiz_obj,idx)=>{
                return (
              <ListItem sx={{ boxShadow: 2,marginTop:"10px"}}
                  secondaryAction={
                    <div>
                      <IconButton title='Copy Link' onClick={()=>{navigator.clipboard.writeText(server_home+"/quiz/"+quizes_id_list[idx])}} edge="end" aria-label="delete">
                        <ContentCopyIcon sx={{ padding:"10px" }}/>
                      </IconButton>
                      <Link to={{pathname: `/result/${quizes_id_list[idx]}`}}>
                        <IconButton  title='Show Result' edge="end" aria-label="show">
                          <AssessmentIcon sx={{ padding:"10px" }}/>
                        </IconButton>
                      </Link>
                      
                    </div>
                }
              >
                <ListItemText
                  primary={quiz_obj.quiz_title}
                />
              </ListItem>
              )
              })
            }
          </List>
       
        
    </div>
  );
}

export default Adminhome;
