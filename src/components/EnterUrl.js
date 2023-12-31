import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { server_home } from '../secret';

function EnterUrl() {
    const [url,setUrl] = useState('');
    const navigate = useNavigate();
    function urlchangehandle(event){
        setUrl(event.target.value);
    }
    function enterQuizClicked(){
        navigate('/'+url.replace(server_home+"/",""));
    }
    return (
        <div>
            <br/><br/><br/>
            <Box sx={{margin:'20px', display:'flex',flexDirection:'column',alignItems:'center',alignContent:'center',justifyContent:'center'}}>
                <TextField onChange={urlchangehandle} id="outlined-basic" label="url" variant="outlined" />
                <br/>
                <Button onClick={enterQuizClicked}>Enter Quiz</Button>
            </Box>
        </div>
    )
}

export default EnterUrl