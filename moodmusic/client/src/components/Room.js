import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {Grid, Button, Typography } from '@material-ui/core';
import {Link} from 'react-router-dom';

function Room(props) {
  const { roomCode } = useParams(); // Use the useParams hook to get the roomCode
  const navigate = useNavigate();

  const initialState = {
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false
  };
  const [roomData, setRoomData] = useState(initialState);

  useEffect(() => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then(res => {
        if(!res.ok){
          props.leaveRoomCallback();
          navigate('/');
        }
        return res.json()
      })
      .then(data => {
        setRoomData({
          ...roomData, 
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  }, [roomCode, setRoomData]); // It renders when the object changes. If we use roomData and/or roomCode then it rerenders infinite times.

  console.log("roomCode is " + roomCode)

  function leaveButtonPressed(){
    const requestOptions ={
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    }
    fetch('/api/leave-room', requestOptions).then((_response) => {
      props.leaveRoomCallback();
      navigate('/');
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Room Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
      <Typography variant="h5" component="h5">
          Votes to Skip: {roomData.votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
      <Typography variant="h5" component="h5">
          Guest Can Pause: {String(roomData.guestCanPause)}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
      <Typography variant="h5" component="h5">
          Host: {String(roomData.isHost)}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
