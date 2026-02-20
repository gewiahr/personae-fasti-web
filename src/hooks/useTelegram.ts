import { miniApp, retrieveRawInitData, parseInitDataQuery } from "@tma.js/sdk-react";
import { config } from "../utils/config";

const useTelegram = () => {
  const TMA = miniApp.ready.isAvailable();
  
  const initDataRaw = ""; //TMA ? retrieveRawInitData() : config.tgRawData; //"";
  const initData = TMA ? parseInitDataQuery(String(initDataRaw)) : null;
  const user = TMA ? initData?.user : null;

 return { TMA, initDataRaw, initData, user };
};

export default useTelegram;