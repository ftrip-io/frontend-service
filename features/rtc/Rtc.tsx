import * as signalR from "@microsoft/signalr";
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getToken } from "../../core/utils/token";
import { useNotifications } from "../../core/hooks/useNotifications";
import { useNotificationsResult } from "../notifications/useNotificationsResult";
import { ResultStatus } from "../../core/contexts/Result";

type RtcContextType = {
  tryToConnect: () => any;
  tryToDisconnect: () => any;
};

const initialRtcContextValues: RtcContextType = {
  tryToConnect: () => {},
  tryToDisconnect: () => {},
};

const RtcContext = createContext<RtcContextType>(initialRtcContextValues);

function buildHubConnection() {
  return new signalR.HubConnectionBuilder()
    .withUrl("/rtcService/hubs/notifications", {
      accessTokenFactory: () => {
        return getToken()?.toString() ?? "";
      },
    })
    .withAutomaticReconnect()
    .build();
}

export const useRtcContext = () => useContext(RtcContext);

export const RtcContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [connection, setConnection] = useState<signalR.HubConnection | undefined>(undefined);

  const notifications = useNotifications();
  const { setResult } = useNotificationsResult();

  const tryToConnect = useCallback(() => {
    if (connection) return;

    const newConnection = buildHubConnection();
    newConnection
      .start()
      .then(() => {
        console.log("Successfully connected to the SignalR Hub.");

        newConnection.on("notification", (message: string) => {
          notifications.success(message);
          setResult({ status: ResultStatus.Ok, type: "NEW_NOTIFICATION" });
        });
      })
      .catch((err: any) => console.log(`Failed to connect to SignalR Hub because of: ${err}.`));
    setConnection(newConnection);
  }, [connection, notifications, setResult]);

  const tryToDisconnect = useCallback(() => {
    if (!connection) return;

    connection
      .stop()
      .then(() => console.log("Successfully disconnected from the SignalR Hub."))
      .catch((err: any) =>
        console.log(`Failed to disconnected from the SignalR Hub because of: ${err}.`)
      );
    setConnection(undefined);
  }, [connection]);

  useEffect(() => {
    if (!getToken()) return;
    tryToConnect();

    return () => tryToDisconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RtcContext.Provider value={{ tryToConnect, tryToDisconnect }}>{children}</RtcContext.Provider>
  );
};
