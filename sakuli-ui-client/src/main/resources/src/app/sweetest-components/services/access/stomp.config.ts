import {StompConfig} from "@stomp/ng2-stompjs";
import {environment} from "../../../../environments/environment";
import * as SockJS from 'sockjs-client';

function socketProvider() {
  return new SockJS('/api/socket')
}

export const stompConfig: StompConfig = {
  url: socketProvider,

  headers: {},

  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: !environment.production
};
