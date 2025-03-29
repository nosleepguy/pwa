// gape for admin push notification to any devices
'use client';

import { useState } from 'react';
import { sendNotification } from '../actions';
// const db = await JSONFilePreset('db.json', dbTemplate);

export default function AdminPush() {
  const [deviceID, setDeviceID] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const subscriptions = [];

  const handleSendNotification = async () => {
    await sendNotification(message, deviceID);
    setMessage('');
  };

  //   useEffect(() => {
  //     console.log(db.data.subscriptions);
  //   }, [db.data.subscriptions]);

  return (
    <>
      <input
        placeholder="device ID:"
        onChange={e => setDeviceID(e.target.value)}
      ></input>
      <input
        placeholder="message: "
        onChange={e => setMessage(e.target.value)}
      ></input>
      <button onClick={handleSendNotification}>Send</button>
      <p>Danh sach device:</p>
      {/* map deviceID from db */}
      {/* {subscriptions &&
        subscriptions.map((subscription, index) => (
          <div key={index}>
            <p>{subscription.deviceID}</p>
          </div>
        ))} */}
    </>
  );
}
