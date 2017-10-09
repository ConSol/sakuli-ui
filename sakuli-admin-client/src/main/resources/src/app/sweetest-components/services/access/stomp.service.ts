import {Injectable} from "@angular/core";
import * as Stomp from 'stompjs';
import * as SockJS from "sockjs-client";
import {Subject} from "rxjs/Subject";

export class StompConnection extends Subject<StompConnection> {

  private socket: SockJS.Socket;
  private stompClient: Stomp.Client;

  private topicMap = new Map <string, Subject<any>>();

  constructor(url: string) {
    super();
    this.socket = new SockJS(url);
    this.stompClient = Stomp.over(this.socket as any);
    this.stompClient.debug = (...args: any[]) => {}
  }

  open() {
    if(!this.stompClient.connected) {
      this.stompClient.connect({login: '', passcode: ''}, f => {
          if (f) {
            this.next(this);
          }
        },
        e => {
          console.warn("Some error trying to reconnect");
          this.error(e);
        })
    } else {
      this.next(this);
    }
    return this;
  }

  topic<T>(destination: string): Subject<T> {
    if (!this.topicMap.has(destination)) {
      const topic = new Subject<T>();
      this.stompClient.subscribe(destination, raw => topic.next(JSON.parse(raw.body)));
      this.topicMap.set(destination, topic);
    } else {
    }
    return this.topicMap.get(destination);
  }

  get connected() {
    return this.stompClient.connected;
  }

  end() {
    this.topicMap.forEach(s => s.complete());
    this.topicMap.clear();
    this.stompClient.disconnect(() => this.complete());
  }
}

@Injectable()
export class StompService {

  connectionMap = new Map<string, StompConnection>();

  connect(url: string) {
    if (!this.connectionMap.has(url)) {
      const conn = new StompConnection(url);
      this.connectionMap.set(url, conn);
    }
    //return this.connectionMap.get(url).open();
    return new StompConnection(url).open();
  }

}
