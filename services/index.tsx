import React, { useContext } from "react";
import { createContext } from "react";
import axios from "axios";
import defaultService from "./services";
import { useSession } from "@/contexts/session";

type Service = typeof defaultService;

const ServiceContext = createContext<Service>(defaultService);

export function useService() {
  return useContext(ServiceContext);
}

export { defaultService as services };

export default function ServicesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //TODO: Add session to axios headers
  const { session } = useSession();
  // axios.defaults.headers.common.AUTHORIZATION = session;
  axios.defaults.headers.common.AUTHORIZATION =
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLnRhbmNhLmlvL2FwaS92NC9hdXRoL3NpZ25pbi12MiIsImlhdCI6MTc0MTIzNDY3NiwibmJmIjoxNzQxMjM0Njc2LCJqdGkiOiJvNk01YVhEV0h1a0dDUFRKIiwic3ViIjoiTml0SnBlSnV2QXgzWmNhd0oiLCJwcnYiOiIxYzU1MjBmNzBiYWE2NTVkZGM1NzQ2YTY3NjRmMzcyYTFiNjU1YWE2Iiwic2hvcF9pZCI6IjVjMjBhMTljMGIwODg4MGY1OTRmYzQ2OCIsInNob3BfdXNlcm5hbWUiOiJ0YW5jYXhheWR1bmciLCJzaG9wX3ByZWZpeCI6InQiLCJ0eXBlIjoiYXBpIn0.2RPOSAcs_yiHbtrBgUHlpIdxa4gI8qr8smK1ZDCJ_0U";
  axios.defaults.baseURL = "https://api.tanca.io";
  axios.defaults.headers.common.LANG = "vi";
  axios.defaults.headers.common.Timezone = "Asia/Saigon";
  axios.defaults.headers.common.Device = process.env.NEXT_PUBLIC_DEVICE_INFO;

  return (
    <ServiceContext.Provider value={defaultService}>
      {children}
    </ServiceContext.Provider>
  );
}
