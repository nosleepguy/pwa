import { getToken, onMessage } from "firebase/messaging";
import { useLayoutEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { FIREBASE_VAPID_KEY, messaging } from "./lib/firebaseConfig";
import viteLogo from "/vite.svg";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  const handleInstallPWA = async (evt) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();

    const { outcome } = await promptInstall.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // Clear the deferredPrompt variable, it can only be used once.
    setPromptInstall(null);
  };

  const handler = (e) => {
    e.preventDefault();
    setSupportsPWA(true);
    setPromptInstall(e);
  };
  useLayoutEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").then(
          function (registration) {
            // Registration was successful
            console.log(
              "ServiceWorker scope: ",
              registration.scope
            );
          },
          function (err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
          }
        );
      });
      navigator.serviceWorker.register("/firebase-messaging-sw.js").then(
        function (registration) {
          // Registration was successful
          console.log(
            "firebase ServiceWorker scope: ",
            registration.scope
          );
        },
        function (err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    }
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
    });

    return function cleanup() {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useLayoutEffect(() => {
    const requestPermission = async () => {
      try {
          const token = await getToken(messaging, { vapidKey: FIREBASE_VAPID_KEY });
          if (token) {
              console.log('Token generated:', token);
              // Send this token to your server to store it for later use
          } else {
              console.log('No registration token available.');
          }
      } catch (err) {
          console.error('Error getting token:', err);
      }
  };
  requestPermission();
  },[])

  useLayoutEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // Customize notification display here
    });

    return () => {
        unsubscribe();
    };
}, []);

  return (
    <>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleInstallPWA}>Install</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
