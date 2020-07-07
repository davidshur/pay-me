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

  deleteFromDb = (idToDelete) => {
    let objIdToDelete = null;
    let intId = parseInt(idToDelete);
    this.state.data.forEach(item => {
      if (item.id === intId) {
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
    let intId = parseInt(idToUpdate);
    this.state.data.forEach(item => {
      if (item.id === intId) {
        objIdToUpdate = item._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? 'No DB entries yet...'
            : data.map(item => (
              <li style={{ padding: '10px' }} key={item.id}>
                <span style={{ color: 'grey' }}> ID: </span> {item.id} <br />
                <span style={{ color: 'grey' }}> Message: </span> {item.message}
              </li>
            ))}
        </ul>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={event => this.setState({ message: event.target.value})}
            placeholder="Say something..."
            style={{ width: '200px' }}
          />
          <button onClick={() => this.putDataToDb(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{ padding: '10px'}}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={event =>
              this.setState({ idToDelete: event.target.value })
            }
            placeholder="ID of item to delete..."
          />
          <button onClick={() => this.deleteFromDb(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px'}}
            onChange={event =>
              this.setState({ idToUpdate: event.target.value })
            }
            placeholder="ID of item to update..."
          />
          <input
            type="text"
            style={{ width: '200px'}}
            onChange={event =>
              this.setState({ updateToApply: event.target.value })
            }
            placeholder="Updated message..."
          />
          <button
            onClick={() =>
              this.updateDb(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  };
};

export default App;
