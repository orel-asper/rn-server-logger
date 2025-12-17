import { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface ServerLoggerRef {
  printHelper: (message: string | object) => void;
}

declare const ServerLogger: ForwardRefExoticComponent<RefAttributes<ServerLoggerRef>>;

export default ServerLogger;
