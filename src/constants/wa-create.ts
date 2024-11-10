import { NotificationLanguage } from "@open-wa/wa-automate";

export const WA_CREATE = {
  sessionId: "GH-MAP-CHATBOT",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: NotificationLanguage.PTBR,
  logConsole: false,
  popup: false,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
};
