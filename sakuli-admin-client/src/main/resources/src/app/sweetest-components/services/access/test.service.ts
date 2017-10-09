import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {TestCase, TestSuite} from "./model/test-suite.model";
import {Observable} from "rxjs/Observable";
import {TestRunInfo} from "./model/test-run-info.interface";
import {StompConnection, StompService} from "./stomp.service";
import {TestExecutionEvent} from "./model/test-execution-event.interface";
import {TestSuiteResult} from "./model/test-result.interface";
import {FileService} from "./file.service";
import {ProjectService} from "./project.service";
import {absPath} from "./model/file-response.interface";
import * as moment from "moment";
import {DateUtil} from "../../utils";

const testUrl = `api/test`;

@Injectable()
export class TestService {

  constructor(private http: Http,
              private files: FileService,
              private project: ProjectService,
              private stomp: StompService) {
  }

  testSuite<S extends TestSuite<{}, TestCase<{}>>>(): Observable<S> {
    return this.http.get(testUrl)
      .map(r => r.json() as S);
  }

  run(testSuite: TestSuite): Observable<TestRunInfo> {
    return this.http.post(`${testUrl}/run`, testSuite)
      .map(r => r.json());
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

  testResultsFromLogs(): Observable<TestSuiteResult[]> {
    return this.http.get(`${testUrl}/results`)
      .map(r => r.json())
  }

  testResultsFromJson(): Observable<TestSuiteResult[]> {
    return this.project
      .activeProject()
      .mergeMap(p => this.files.files(`${p.path}/_logs/_json`))
      .mergeMap(files => Observable
        .forkJoin(...files.map(file => this.files.read(absPath(file)))))
      .map(raw => raw.map(JSON.parse.bind(JSON)))

  }

  testResults(): Observable<TestSuiteResult[]> {
    return Observable.combineLatest(
      this.testResultsFromLogs(),
      this.testResultsFromJson()
    ).map(([fromLogs, fromJson]) => ([
        //...fromLogs,
        ...fromJson])
      .sort(DateUtil
        .createComparator(
          (r:TestSuiteResult) => r.startDate,
          DateUtil.Formats.default)
      )
    )
  }

}
