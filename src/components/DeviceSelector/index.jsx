import React, {useState, useEffect} from 'react';

const DeviceSelector = ({ onDeviceSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    fetch(`/devices`)
    .then(res => res.json())
    .then(data => {
      setDevices(data.map(device => device.device_id));
    })
    .finally(() => setIsLoading(false));
  }, []);

  const onChange = (event) => onDeviceSelected(event.target.value);

  return (
    <>
      {isLoading && <span>Loading devices...</span>}
      {!isLoading && <label>Device ID &nbsp;</label>}
      <select onChange={onChange}>
        {devices.map(d => <option value={d} key={d}>{d}</option>)}
      </select>
    </>
  )
};

export default DeviceSelector;