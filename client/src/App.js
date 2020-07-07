import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      id: 0,
      message: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null
    };
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  };

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  putDataToDb = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      idToBeAdded++;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message
    });
  };

  deleteFromDb = idToDelete => {
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach(item => {
      if (item.id == idToDelete) {
        objIdToDelete = item._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete
      }
    });
  };

  updateDb = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach(item => {
      if (item.id == idToUpdate) {
        objIdToUpdate = item._id;
      }
    });

    axios.post('http://localhost3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  render() {
    return (
      <p>Ready to use my backend!</p>
    );
  };
};

export default App;
