import React from 'react';
import $ from 'jquery';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import axios from 'axios';
import SearchView from './searchView.jsx';
import LoginView from './loginView.jsx';
import SignUpView from './signUpView.jsx';
import CreateListingView from './createListingView.jsx';
import HouseListingView from './houseListingView.jsx';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      term: '',
      listings: [],
      currentHouseView: {},
      justRegistered: false
    };
    this.onSubmitPost = this.onSubmitPost.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.searchByZipCode = this.searchByZipCode.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onTitleClick = this.onTitleClick.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  /* ******** Helpers and Events **********/

  componentDidMount () {
    // get request fetches the zipcode of the user's IP address and calls onEnterSite
    axios.get('http://ip-api.com/json')
      .then(response => this.searchByZipCode(response.data.zip))
      .catch(err => console.log(err));
  }

  onInput (e) {
    this.setState({ term: e.target.value });
  }

  onTitleClick (item) {
    // populate houselistingview with data from searchresult view
    this.setState({
      currentHouseView: item
    });
  }

  onSignUp (e) {
    // give user a human way to know they have registered
    this.setState({
      justRegistered: true
    });
  }

  /* ******** Helpers and Events **********/

  /*  ******** axios Requests **********/

  onSearch (event) {
    event.preventDefault();
    this.searchByZipCode(this.state.term);
  }

  onSubmitPost (newListingData) {
    // create new house listing in db
    this.setState( { currentHouseView: newListingData } )
    // post request to server
    axios.post('/listing', newListingData)
      .then((res) => {
        // console.log(`-------> Folowing data returned from server POST -> ${res}`)
      })
      .catch(err => console.log(err));
  }

  searchByZipCode (zipCode) {
    // get request queries databse for all listings matching the user's ip address zipcode
    axios.get('/searchListing', { params: { zip: zipCode } })
      .then(res => this.setState({ listings: res.data }))
      .catch(err => console.log(err) );
  }

  /*  ******** axios Requests **********/

  /* ******** Render **********/

  render () {
    // passing props to views with routes
    const renderHouseListingView = props => (
      <HouseListingView
        currentHouseView={this.state.currentHouseView}
      />);
    const renderSignUpView = props => (
      <SignUpView
        onSignUp={this.onSignUp}
      />);
    const renderLoginView = props => (
      <LoginView
        registered={this.state.justRegistered}
      />);
    const renderCreateListingView = props => (
      <CreateListingView
        onSubmit={this.onSubmitPost}
      />);
    const renderSearchView = props => (
      <SearchView
        onInput={this.onInput}
        value={this.state.term}
        listings={this.state.listings}
        onSearch={this.onSearch}
        onTitleClick={this.onTitleClick}
      />);
    const Home = () => (
      <section className="hero is-medium is-primary">
        <div className="hero-body">
          <h1 className="title is-1">
          Welcome to Roomee
          </h1>
          <h2 className="subtitle is-2">
          We're not craigslist.
          </h2>
        </div>
      </section>
    );

    return (
      <Router>
        <div className="hero">
          <h1 className="level-item title has-text-centered is-medium">
          Roomee
          </h1>
          {/* React router routes*/}
          <nav className="level container has-text-centered heading is-6">
            <Link to="/" className="level-item">
            Home
            </Link>
            <Link to="/search" className="level-item">
            Search
            </Link>
            <Link to="/createListing" className="level-item">
            New Listing
            </Link>
            <Link to="/loginView" className="level-item">
            Login
            </Link>
            <Link to="/signUpView" className="level-item">
            Sign Up
            </Link>
          </nav>

          <Route exact path="/" component={Home} />
          <Route path="/search" render={renderSearchView} />
          <Route path="/createListing" render={renderCreateListingView} />
          <Route path="/loginView" render={renderLoginView} />
          <Route path="/signUpView" render={renderSignUpView} />
          <Route path="/house" render={renderHouseListingView} />

          <footer className="footer has-text-centered heading is-6">
          by the roomee project
          </footer>
        </div>
      </Router>
    );
  }

  /* ******** Render **********/
}
