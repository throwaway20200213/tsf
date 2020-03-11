import React, {useState} from 'react';

import DeviceSelector from './components/DeviceSelector';
import ConnectionList from './components/ConnectionList';

import './App.css';

function App() {
  const [selectedDevice, setSelectedDevice] = useState('0000');
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [connections, setConnections] = useState(undefined);

  const onDeviceSelected = (device) => setSelectedDevice(device);

  const onButtonClick = () => {
    setIsFetchingData(true);
    const url = `devices/${selectedDevice}/connections`;

    fetch(url)
    .then(res => res.json())
    .then(data => {
      setConnections(data);
    })
    .finally(() => setIsFetchingData(false));

  }
  return (
    <div className="App">
      <DeviceSelector onDeviceSelected={onDeviceSelected} />
      <button className="device-search" onClick={onButtonClick} disabled={isFetchingData}>Search</button>

      <div className="results-section">
        {isFetchingData && <span>Loading results...</span>}
        {connections && <ConnectionList connections={connections} />}
      </div>
    </div>
  );
}

export default App;
