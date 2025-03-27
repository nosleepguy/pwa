import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import {
  MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { useSubscribe } from "./hook/useSubscribe";
import viteLogo from "/vite.svg";

const PUBLIC_KEY =
  "BMaZoBwZ9hKINlyxR3pMvgkykXoMAfaoLEiGHa2GXpcWS5Q2Ib0dBtMUzcevNB8lAa2LpqJS7N5Esl0aSN_bXnQ";

function App() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [isInstall, setIsInstall] = useState(false);
  const [pushId, setPushId] = useState<string>("");

  const { getSubscription } = useSubscribe({ publicKey: PUBLIC_KEY });

  const onSubmitSubscribe = useCallback(
    async (id: string) => {
      try {
        const subscription = await getSubscription();

        await axios({
          url: "/subscribe",
          method: "post",
          data: {
            subscription: subscription,
            id,
          },
          baseURL: "http://localhost:3000",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        });
        toast.success("Subscribe success");
      } catch (e) {
        toast.error(JSON.stringify(e));
        toast.error("Details console");
      }
    },
    [getSubscription]
  );

  const handlePushNoti = async (evt: MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    try {
      await axios.post(
        "/send",
        {
          message: "ccccc",
          title: "vvvvvv",
          id: pushId,
        },
        {
          baseURL: "http://localhost:3000",
        }
      );
      toast.success("Push success");
    } catch (e) {
      toast.error(JSON.stringify(e));
    }
    // if (!promptInstall) {
    //   return;
    // }
    // promptInstall.prompt();
    // const { outcome } = await promptInstall.userChoice;
    // console.log(`User response to the install prompt: ${outcome}`);
    // // Clear the deferredPrompt variable, it can only be used once.
    // setPromptInstall(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const handler = (e: any) => {
  //   e.preventDefault();
  //   setSupportsPWA(true);

  //   // See if the app is already installed, in that case, do nothing
  //   // setPromptInstall(e);
  // };

  useLayoutEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js", { scope: "./" })
          .then((registration) => {
            // Registration was successful
            console.log("ServiceWorker scope: ", registration.scope);
          })
          .catch((err) => {
            console.log("ServiceWorker registration failed: ", err);
          });
      });
    }
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator?.standalone ||
      document.referrer.includes("android-app://")
    ) {
      setIsInstall(true);
    }
    // window.addEventListener("beforeinstallprompt", handler);
    // window.addEventListener("appinstalled", () => {
    //   console.log("PWA was installed");
    //   setIsInstall(true);
    // });
    // return () => {
    //   window.removeEventListener("beforeinstallprompt", handler);
    // };
  }, []);

  useEffect(() => {
    try {
      FingerprintJS.load()
        .then((fp) => fp.get())
        .then((result) => {
          setPushId(result.visitorId);
        });
    } catch (error) {
      alert(error);
    }
  }, []);

  return (
    <>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => onSubmitSubscribe(pushId)}>Subcribe</button>
        <button onClick={handlePushNoti}>Push noti</button>
        <p>
          Supports PWA: {isInstall ? "true" : supportsPWA ? "true" : "false"}
        </p>
        <p>pushId: {pushId}</p>
      </div>
      <Toaster />
    </>
  );
}

export default App;
