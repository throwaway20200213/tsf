import React from 'react';

const ConnectionItem = ({ connection }) => {
  return (
    <div className="connection-item">
      <h4 className="device-id">{connection.device_id}</h4>
      <span> Average level: {connection.average_level}</span>

      <h5 className="neighbours-heading">Neighbours:</h5>
      {connection.neighbours.map(neighbour => (
        <div key={`${neighbour.remote_device_id}_${neighbour.timestamp}`}>
          <span>ID: {neighbour.remote_device_id}</span> &nbsp;
          <span>Interface: {neighbour.interface}</span> &nbsp;
          <span>Level: {neighbour.level}</span> &nbsp;
          <span>Time: {neighbour.time}</span>
        </div>
      ))}
    </div>
  );
}

export default ConnectionItem;