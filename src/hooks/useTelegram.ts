import { miniApp, retrieveRawInitData, parseInitDataQuery } from "@tma.js/sdk-react";

const useTelegram = () => {
  const TMA = miniApp.ready.isAvailable();
  
  const initDataRaw = TMA ? retrieveRawInitData() : "";
  const initData = TMA ? parseInitDataQuery(String(initDataRaw)) : null;
  const user = TMA ? initData?.user : null;

 return { TMA, initDataRaw, initData, user };
};

export default useTelegram;