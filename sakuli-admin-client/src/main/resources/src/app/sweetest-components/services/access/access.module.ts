import {NgModule} from "@angular/core";
import {StompService} from "./stomp.service";
import {FileService} from "./file.service";
import {TestService} from "./test.service";
import {ProjectService} from "./project.service";



export const providers = [
  ProjectService,
  TestService,
  FileService,
  StompService,
];

@NgModule({
  providers
})
export class ScAccessModule {
}
