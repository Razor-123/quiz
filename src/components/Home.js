import React, { Component } from 'react';
//import { Link } from 'react-router';
import { Link } from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

function Home(){
      React.useEffect(()=>{
        console.log('use Effect in App.js');
      },[])
        return (
            <div >
                <br/><br/><br/>
                <Box >
                    <center>
                            <div>
                            <Typography variant="h1" component="div" gutterBottom>
                                Quiz App
                            </Typography>
                            </div>
                            <br/>
                            <Link to="/enterurl" style={{ textDecoration: 'none' }}>
                                <Button size='large' variant="outlined">Enter quiz</Button>
                            </Link>
                            <br/><br/>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button size='large' variant="outlined">Create quiz</Button>
                            </Link>
                    </center>
                </Box>

            </div>
        )
}

export default Home;