import { useEffect } from "react";
import { onLogout, useAuthContext } from "../core/contexts/Auth";
import { useRtcContext } from "../features/rtc/Rtc";

export default function Logout() {
  const { authDispatcher } = useAuthContext();
  const { tryToDisconnect } = useRtcContext();

  useEffect(() => {
    authDispatcher(onLogout());
    tryToDisconnect();
  }, [authDispatcher, tryToDisconnect]);

  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Please, have a patience.
        </h2>
      </div>
    </>
  );
}
