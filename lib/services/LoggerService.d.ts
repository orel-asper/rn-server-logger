import { Log, LogType } from "../types/types";
export declare const useServerLogger: () => [Record<LogType, Log[]>, boolean, (value: boolean) => void, () => void];
export declare const exportLogsToFileAndShare: (logs: Log[]) => Promise<void>;
