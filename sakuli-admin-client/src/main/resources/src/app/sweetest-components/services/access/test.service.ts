import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {TestCase, TestSuite} from "./model/test-suite.model";
import {Observable} from "rxjs/Observable";
import {TestRunInfo} from "./model/test-run-info.interface";
import {StompConnection, StompService} from "./stomp.service";
import {SocketEvent} from "./model/socket-event.interface";
import {ActionCreator} from "../ngrx-util/action-creator-metadata";
import {log} from "../../../core/redux.util";

const testUrl = `api/test`

@Injectable()
export class TestService {

  constructor(
    private http: Http,
    private stomp: StompService
  ) {}

  testSuite<S extends TestSuite<{}, TestCase<{}>>>(): Observable<S> {
    return this.http.get(testUrl)
      .map(r => r.json() as S);
  }

  run(testSuite:TestSuite):Observable<TestRunInfo> {
    return this.http.post(`${testUrl}/run`, testSuite)
      .map(r => r.json());
  }

  testRunLogs(processId: string) {
    console.log('ProcessID outer', processId);

    return this.stomp.connect('/api/socket')
      .combineLatest(Observable.of(processId).do(log('Observable pid')))
      .do(log('Topic Stream'))
      .mergeMap(([conn, pid]: [StompConnection, string]) =>{
        console.log('ProcessID inner', pid)
        return conn.topic<SocketEvent>(`/topic/test-run-info/${pid}`)
      })
  }

  testResults() {
    return this.http.get(`${testUrl}/results`)
      .map(r => r.json())
  }

}
