import { getToken, onMessage } from "firebase/messaging";
import { MouseEvent, useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { messaging, VITE_FIREBASE_VALID_KEY } from "./firebase-config";
import viteLogo from "/vite.svg";

function App() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promptInstall, setPromptInstall] = useState<any>();
  const [token, setToken] = useState<string>("");

  const handleInstallPWA = async (evt: MouseEvent<HTMLElement>) => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (e: any) => {
    e.preventDefault();
    setSupportsPWA(true);
    setPromptInstall(e);
  };

  useLayoutEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            // Registration was successful
            console.log("ServiceWorker scope: ", registration.scope);
          })
          .catch((err) => {
            console.log("ServiceWorker registration failed: ", err);
          });

        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log(
              "Registration successful, scope is:",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("Service worker registration failed: ", error);
          });
      });
    }
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const requestPermission = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: VITE_FIREBASE_VALID_KEY,
      });
      if (token) {
        console.log("Token generated:", token);
        setToken(token);
        // Send this token to your server to store it for later use
      } else {
        console.log("No registration token available.");
      }
    } catch (err) {
      console.error("Error getting token:", err);
    }
  };
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    alert(payload.notification?.body);
    // Customize notification display here
  });

  useEffect(() => {
    if (supportsPWA) requestPermission();
  }, [supportsPWA]);

  return (
    <>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleInstallPWA}>Install</button>
        <p>Supports PWA: {supportsPWA ? "true" : "false"}</p>
        <p style={{ width: "200px", wordBreak: "break-all" }}>{token}</p>
      </div>
    </>
  );
}

export default App;
