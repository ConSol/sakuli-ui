import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {TestRunInfo} from "./model/test-run-info.interface";
import {StompConnection, StompService} from "./stomp.service";
import {TestExecutionEvent} from "./model/test-execution-event.interface";
import {TestSuiteResult} from "./model/test-result.interface";
import {FileService} from "./file.service";
import {absPath} from "./model/file-response.interface";
import {DateUtil} from "../../utils";
import {SakuliTestSuite} from "./model/sakuli-test-model";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const testUrl = `api/testsuite`;

@Injectable()
export class TestService {

  constructor(private http: HttpClient,
              private files: FileService,
              private stomp: StompService) {
  }

  testSuite(path: string): Observable<SakuliTestSuite> {
    return this.http.get<SakuliTestSuite>(`${testUrl}?path=${path}`)
  }

  putTestSuite(testSuite: SakuliTestSuite) {
    return this.http.put(
      `${testUrl}`,
      JSON.stringify(testSuite),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        responseType: 'text'
      }
    )
  }

  stop(containerId: string) {
    this.stomp.connect('/api/socket')
      .subscribe((c: StompConnection) => {
        c.send(`/execution/stop/${containerId}`, {stop:true})
      })
  }

  run(testSuite: SakuliTestSuite, workspace: string): Observable<TestRunInfo> {
    return this.http.post<TestRunInfo>(`${testUrl}/run?workspace=${workspace}`, testSuite)
  }

  testRunLogs(processId: string): Observable<TestExecutionEvent> {
    return this.stomp.connect('/api/socket')
      .combineLatest(Observable.of(processId))
      .mergeMap(([conn, pid]: [StompConnection, string]) => {
        return conn.topic<TestExecutionEvent>(`/topic/test-run-info/${pid}`)
      })
      .catch(e => {
        console.warn('Error while fetching logs', e);
        return Observable.empty() as Observable<TestExecutionEvent>;
      })
  }

  testResultsFromLogs(testSuitePath: string): Observable<TestSuiteResult[]> {
    return this.http.get<TestSuiteResult[]>(`${testUrl}/results?path=${testSuitePath}`)
  }

  testResultsFromJson(testSuitePath: string): Observable<TestSuiteResult[]> {
    return this.files.files(`${testSuitePath}/_logs/_json`)
      .mergeMap(files => {
        if (files.length) {
          return Observable
            .forkJoin(...files.map(file => {
              return this.files
                .read(absPath(file))
                .map(JSON.parse.bind(JSON))
                .map(res => ({...res, sourceFile: file.name}))
            }))
        } else {
          return Observable.of([]);
        }
      })
  }

  testResults(testSuitePath: string): Observable<TestSuiteResult[]> {
    return this.testResultsFromJson(testSuitePath)
      .catch(e => this.testResultsFromLogs(testSuitePath))
      .catch((e):Observable<TestSuiteResult[]> => Observable.of([]))
      .map((results) => results
        .sort(DateUtil
          .createComparator(
            (r: TestSuiteResult) => r.startDate,
            DateUtil.Formats.default)
        ));
  }

}
