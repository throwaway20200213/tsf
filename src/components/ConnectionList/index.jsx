import React from 'react';
import ConnectionItem from './ConnectionItem';

const ConnectionList = ({ connections }) => (
  <>
  <h2>Connections</h2>
    {connections.map(connection => <ConnectionItem connection={connection} key={connection.device_id} />)}
  </>
);

export default ConnectionList;