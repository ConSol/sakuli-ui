import {Observable} from "rxjs/Observable";
import {SocketEvent} from "./socket-event.interface";

export interface TestRunInfo {
  vncPort:number;
  vncWebPort:number;
  containerId:string;
}
