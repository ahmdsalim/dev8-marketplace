import { useState, useEffect } from "react";
import { MIDTRANS_CLIENT_ID } from "../utils/const";

const useSnap = () => {
  const [snap, setSnap] = useState(null);

  useEffect(() => {
    const myMidTransClientKey = MIDTRANS_CLIENT_ID;
    const script = document.createElement("script");
    script.src = `https://app.sandbox.midtrans.com/snap/snap.js`;
    script.setAttribute("data-client-key", myMidTransClientKey);
    script.onload = () => {
      setSnap(window.snap);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const snapEmbed = (snap_token, embedId, action) => {
    if (snap) {
      snap.embed(snap_token, {
        embedId,
        onSuccess: (res) => {
          console.log("Payment success:", res);
          action.onSuccess(res);
        },
        onPending: (res) => {
          console.log("Payment pending:", res);
          action.onPending(res);
        },
        onClose: () => {
          console.log("Payment popup closed.");
          action.onClose();
        },
      });
    } else {
      console.error("Snap.js is not loaded yet.");
    }
  };

  return { snap, snapEmbed };
};

export default useSnap;
