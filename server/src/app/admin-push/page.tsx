// page for admin push notification to any devices
'use client';

import { useEffect, useState } from 'react';
import { sendNotification } from '../actions';
import "./../index.css"

export default function AdminPush() {
  const [deviceID, setDeviceID] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [subscriptions, setSubscriptions] = useState<
    { subscription: PushSubscription; deviceID: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendNotification = async () => {
    await sendNotification(message, deviceID);
    setMessage('');
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin-subcription');
      const data = await response.json();
      console.log("🚀 ~ fetchSubscriptions ~ data:", data)
      setSubscriptions(data.subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <>
      {/* reload data button */}
      <button onClick={fetchSubscriptions}>Reload</button>
      {/* loading animation */}
      {loading && <p>Loading...</p>}
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
      {subscriptions &&
        subscriptions.map((subscription, index) => (
          <div key={index}>
            <p>{subscription.deviceID}</p>
          </div>
        ))}
    </>
  );
}
