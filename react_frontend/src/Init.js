import React, { useState } from 'react';
import axios from 'axios';

const Init = () => {
  const [dbName, setDbName] = useState('');
  const [tableName, setTableName] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleInit = () => {
    // Send a POST request to the server using Axios
    axios
      .post('http://localhost:3001/init', { dbName, tableName })
      .then((response) => {
        setResponseMessage(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h2>Initialize Database and Table</h2>
      <div>
        <label>
          Database Name:
          <input type="text" value={dbName} onChange={(e) => setDbName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Table Name:
          <input type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} />
        </label>
      </div>
      <div>
        <button onClick={handleInit}>Initialize</button>
      </div>
      <div>
        <p>{responseMessage}</p>
      </div>
    </div>
  );
};

export default Init;
