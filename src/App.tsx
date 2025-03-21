import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { MouseEvent, useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { VITE_FIREBASE_VALID_KEY } from "./firebase-config";
import viteLogo from "/vite.svg";

function App() {
  const [, setSupportsPWA] = useState(false);
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

  async function registerServiceWorkerWithTimeout(
    path: string,
    timeout = 10000
  ) {
    return new Promise((resolve, reject) => {
      // Start a timeout timer
      const timer = setTimeout(() => {
        reject(new Error("Service Worker registration timed out."));
      }, timeout);

      // // Attempt to register the service worker
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length === 0) {
          navigator.serviceWorker
            .register(path)
            .then((registration) => {
              clearTimeout(timer); // Clear the timeout on success
              resolve(registration);
            })
            .catch((error) => {
              clearTimeout(timer); // Clear the timeout on failure
              reject(error);
            });
        } else {
          console.log("Service Worker already registered");
        }
      });

      // navigator.serviceWorker
      //   .register(path)
      //   .then((registration) => {
      //     clearTimeout(timer); // Clear the timeout on success
      //     resolve(registration);
      //   })
      //   .catch((error) => {
      //     clearTimeout(timer); // Clear the timeout on failure
      //     reject(error);
      //   });
    });
  }

  useLayoutEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").then(
          function (registration) {
            // Registration was successful
            console.log("ServiceWorker scope: ", registration.scope);
          },
          function (err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
          }
        );
        // Usage
        registerServiceWorkerWithTimeout("/firebase-messaging-sw.js", 20000) // Set a custom timeout (e.g., 20 seconds)
          .then((registration) => {
            console.log("Service Worker registered:", registration);
          })
          .catch((error) => {
            console.error("Failed to register Service Worker:", error);
          });
      });
    }
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
    });

    return function cleanup() {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const requestPermission = async () => {
    try {
      const token = await getToken(getMessaging(), {
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
    } finally {
      console.log("run");
    }
  };
  useEffect(() => {
    if (!token) {
      requestPermission();
    } else {
      onMessage(getMessaging(), (payload) => {
        console.log("Message received. ", payload);
        // Customize notification display here
      });
    }
  }, [token]);

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
