import React, { Component } from "react";
import { Link } from 'react-router-dom';
import "./styles.css";
import NavigationBar from '../../components/NavigationBar';
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { List, ListItem } from "../../components/List";
import { Col, Row, Container } from "../../components/Grid";

class ChooseGame extends Component {
  state = {
    games: [],
    title: "",
    date: ""
  }

  // When this component mounts, grab the book with the _id of this.props.match.params.id
  componentDidMount() {
    API.getGames()
      .then(res => this.setState({ games: res.data }))
      .catch(err => console.log(err));
  }

  //function here to make each div clickable to bring the user to the instructions page
  deleteGame = id => {
    API.deleteGame(id)
      .then(res => this.loadGames())
      .catch(err => console.log(err));
  };


  render() {
    return (
      <div>
        <div className="container">
          <div>
            <NavigationBar auth={this.props.auth} history={this.props.history} />
          </div>
          <div className="contentContainer">
            <title>Choose a Scavenger Hunt</title>
            <header>
              <h1>Choose a Scavenger Hunt</h1>
            </header>
            <div className="huntsBox">
              <Container fluid>
                <Row>
                  <Col size="md-1"></Col>
                  <Col size="md-10">
                      {this.state.games.length ? (
                        <List>
                          {/* all info must be within this list */}
                          {this.state.games.map(game => (
                            <ListItem key={game._id}>
                              <Link to={"/play/" + game._id}>
                                <strong>
                                {console.log({game})}
                                  {game.title}
                                </strong><br/>
                                created on {game.date}
                              </Link>
                              <DeleteBtn onClick={() => this.deleteGame(game._id)} /><br/>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                          <h3>No Results to Display</h3>
                        )}
                  </Col>
                  <Col size="md-1">
                  </Col>
                </Row>
              </Container>
            </div>
            <button className="chooseGameButton"><Link to="/play" className="playLink">Choose Game</Link></button>
          </div>
        </div>
      </div>


    );
  }

}

export default ChooseGame;
