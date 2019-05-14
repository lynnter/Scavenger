import React from "react";
import axios from 'axios';
import history from '../../history';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import "./styles.css";
//setting up the maps imports
import MapContainer from '../../components/MapContainer';

const styles = {
  root: {
    backgroundColor: "white",
    marginRight: "10px",
  },
  input: {
    color: "black",
  },
  containedPrimary: {
    marginLeft: "20px",
  },
  submitButton: {
    marginLeft: "100px",
  }
};

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#093E0A' }
  },
  typography: {
    useNextVariants: true,
  },
});

const theme2 = createMuiTheme({
  palette: {
    primary: { main: '#9e9d24' }
  },
  typography: {
    useNextVariants: true,
  },
});

const theme3 = createMuiTheme({
  palette: {
    primary: { main: '#1b5e20' }
  },
  typography: {
    useNextVariants: true,
  },
});

class InputForm extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "",
      clue: [{ value: "" }],
      code: [{ value: "" }],
      clickLatLng: {},
      useLatLng: false
    };
  }

  propFunction = (obj) => {
    console.log(obj);
    this.setState({ clickLatLng: obj });
    //if you clicke the map it throws the useLatLng as true
    this.setState({ useLatLng: true });
    console.log("clickLatLng: " + this.state.clickLatLng.lat + " , " + this.state.clickLatLng.lng);
  }

  handleSubmit = e => {
    e.preventDefault();
    // const { title, clue, code } = this.state;
  };

  // Title Handler
  handleTitleChange = e => {
    this.setState({ title: e.target.value });
  };


  // Change Handler
  handleClueChange = idx => e => {
    const newClue = this.state.clue.map((clue, sidx) => {
      if (idx !== sidx) return clue;
      return { ...clue, value: e.target.value };
    });
    this.setState({ clue: newClue });
  };


  handleCodeChange = idx => e => {
    const newCode = this.state.code.map((code, sidx) => {
      if (idx !== sidx) return code;
      return { ...code, value: e.target.value };
    });
    this.setState({ code: newCode });
  };


  // Add Handler
  handleAddClueandCode = () => {
    //check to see whether the code or lat long was filled and then set that 
    //possible bug, you click the map, save a location but then want to enter a code instead 
    //if the useLatLng flag is thrown then we save the clue, latitide and longitude
    if (this.state.useLatLng) {
      console.log("The handleAddClueCode threw the true about the useLatLng flag")
      this.setState(
        {
          clue: this.state.clue.concat([{ value: "" }]),
          //store the {Lat: 000, Lng: 000} object in the array
          code: this.state.clickLatLng.concat([{ value: "" }]),
          //turn off the flag
          useLatLng: false
        });
    } else {
      console.log("Just the else");
      this.setState(
        {
          clue: this.state.clue.concat([{ value: "" }]),
          code: this.state.code.concat([{ value: "" }])
        });
    }


  };

  // Remove Handler
  handleRemoveClueAndCode = idx => () => {
    this.setState({
      clue: this.state.clue.filter((s, sidx) => idx !== sidx),
      code: this.state.code.filter((s, sidx) => idx !== sidx)
    });
  };

  //////////////////////
  // POST to database //
  //////////////////////
  saveGame = e => {
    e.preventDefault();
    const title = this.state.title;
    const game = []

    console.log("clue: " + this.state.clue);
    console.log("code: " + this.state.code[0]);
    console.log("code: " + this.state.code[1]);
    for (let i = 0; i < this.state.clue.length; i++) {
      // choose between code or coordinates
      //check if the code is a coordinate object or code by checking the type
      //if it is a string, then we push the clue and the code: (text: whatever)
      if ((typeof this.state.code[i].value) === "string") {
        let clue = this.state.clue[i].value;
        let code = this.state.code[i].value;
        console.log(clue + ", " + code);
        game.push({
          clue: clue,
          code: { text: code }
        });
        // if it is not a string, then we push the lat  
      } else {
        let clue = this.state.clue[i].value;
        let latitude = this.state.code[i].value.lat;
        let longitude = this.state.code[i].value.lng;
        console.log(latitude, longitude)
        game.push({
          clue: clue,
          code: {
            lat: latitude,
            lng: longitude
          }
        });
      }

      axios.request({
        method: 'get',
        url: "/api/users/" + window.localStorage.sub
      })
        .then(function (response) {
          const newGame = {
            title: title,
            game: game,
            createdBy: window.localStorage.sub,
            nickname: response.data[0].nickname
          };
          axios.request({
            method: 'post',
            url: "/api/games/",
            data: newGame,
          }).then((response) => {
            console.log("here: ", response.config.data);
            history.replace('/home');
          }).catch((error) => {
            console.log(error);
          });
        })
    }
  }

  render() {
    return (
    <div>
      <div className="container">
      <div className="createGame">
        <h1>Create a Game</h1>
      </div>
        <div className="createContainer">
        <div className="createTitle">Title</div>
          <form onSubmit={this.saveGame} className="form">
            <MuiThemeProvider theme={theme}>
            <TextField
              required
              id="filled-required"
              label="Required"
              className={this.props.classes.root}
              margin="normal"
              variant="filled"
              onChange={this.handleTitleChange}
            />
            </  MuiThemeProvider>
          
            <br/><br/>
              <h5>Clue and Code</h5>
              {this.state.clue.map((clue, idx) => (
                <div key={idx} className="clueinput">
                  <MuiThemeProvider theme={theme}>
                    <TextField
                      id="outlined-textarea"
                      label="Enter clue here"
                      multiline
                      className={this.props.classes.root}
                      margin="normal"
                      variant="filled"
                      placeholder={`Clue #${idx + 1}`}
                      value={this.state.clue[idx].value}
                      onChange={this.handleClueChange(idx)}
                      required
                    />

                    <TextField
                      id="outlined-textarea"
                      label="Enter code here"
                      multiline
                      className={this.props.classes.root}
                      margin="normal"
                      variant="filled"
                      placeholder={`Code #${idx + 1}`}
                      value={this.state.code[idx].value}
                      onChange={this.handleCodeChange(idx)}
                      required
                    />  
                  </MuiThemeProvider>

                <div className="googleMapCreate">
                  <MapContainer grabCoords={this.propFunction}>
                    Map goes here
                  </MapContainer>
                </div>
              


                    <IconButton onClick={this.handleRemoveClueAndCode(idx)} className="trashcanButton" aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}


                <MuiThemeProvider theme={theme2}>
                  <Fab
                    color="primary"
                    aria-label="Add"
                    className={this.props.classes.fabButton}
                    onClick={this.handleAddClueandCode}
                    size="small"
                  >
                    <AddIcon />
                  </Fab>
                </MuiThemeProvider>

                <MuiThemeProvider theme={theme3}>
                  <Button onClick={this.saveGame} variant="contained" color="primary" className={this.props.classes.submitButton}>
                    Submit
                    <Icon className="newIcon">send</Icon>
                  </Button>
                </MuiThemeProvider>


              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  export default withStyles(styles)(InputForm);
