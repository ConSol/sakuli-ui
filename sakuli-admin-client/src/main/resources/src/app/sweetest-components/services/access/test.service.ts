import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {TestCase, TestSuite} from "./model/test-suite.model";
import {Observable} from "rxjs/Observable";
import {TestRunInfo} from "./model/test-run-info.interface";
import {StompConnection, StompService} from "./stomp.service";
import {TestExecutionEvent} from "./model/test-execution-event.interface";

const testUrl = `api/test`;

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

  testRunLogs(processId: string): Observable<TestExecutionEvent> {
    return this.stomp.connect('/api/socket')
      .combineLatest(Observable.of(processId))
      .mergeMap(([conn, pid]: [StompConnection, string]) =>{
        return conn.topic<TestExecutionEvent>(`/topic/test-run-info/${pid}`)
      })
      .catch(e => {
        console.warn('Error while fetching logs', e);
        return Observable.empty() as Observable<TestExecutionEvent>;
      })
  }

  testResults() {
    return this.http.get(`${testUrl}/results`)
      .map(r => r.json())
  }

}
