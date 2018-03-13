import {initStateFactory} from "./sakuli-admin/appstate.interface";
import {TestBed} from "@angular/core/testing";
import {AppModule} from "./app.module";
import {Store} from "@ngrx/store";
import {APP_BASE_HREF} from "@angular/common";
import {StompConfig} from "@stomp/ng2-stompjs";

describe("App State init", () => {

  let store: Store<any>;

  beforeEach(() => {
    sessionStorage.setItem("sakuli-admin-state", JSON.stringify(_initState()));

    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        {provide: APP_BASE_HREF, useValue: './'},
        {provide: StompConfig, useValue: {url: 'ws://127.0.0.1:15674/ws'}}
      ]
    });

    store = TestBed.get(Store);
    console.log(store);
  });

  it('not touch the init state', done => {
    const initState = initStateFactory();

    store.select(s => s).first().subscribe(s => {
      expect(s).toEqual(initState);
      done();
    })


  });

})

function _initState() {
  return {
    "auth": {
      "user": {
        "name": "master"
      },
      "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUyMTcxMjEyMn0.mqhLpw_47xEVZrc_WOlwzsXRVmstsK_dRWFhuDCRABhNwuE32irdTogeAZAOP7Ck2uJtbwmPEejl3ycevSIXjA",
      "type": "[AUTH] LOGIN SUCCESS"
    },
    "scToast": {
      "ids": [],
      "entities": {},
      "history": [],
      "configuration": {
        "ttl": 30000
      }
    },
    "scLoading": {
      "loadingTestResults": false
    },
    "scMenu": {
      "ids": [
        "secondary.log",
        "primary.open",
        "secondary.help",
        "sidebar.dashboard",
        "sidebar.reports",
        "secondary.logut"
      ],
      "entities": {
        "secondary.log": {
          "id": "secondary.log",
          "label": "Log",
          "_link": "/app-log",
          "icon": "fa-commenting-o",
          "selected": 2,
          "order": 10,
          "parent": "secondary",
          "link": [
            "/app-log"
          ]
        },
        "secondary.help": {
          "id": "secondary.help",
          "label": "Help",
          "_link": "",
          "icon": "fa-question-circle",
          "selected": 2,
          "order": 20,
          "parent": "secondary",
          "link": [
            ""
          ]
        },
        "primary.open": {
          "id": "primary.open",
          "label": "Open",
          "_link": {
            "type": "[testSuite] OPEN_WORKSPACE_DIALOG"
          },
          "icon": "fa-folder-o",
          "selected": 2,
          "order": 20,
          "parent": "primary",
          "action": {
            "type": "[testSuite] OPEN_WORKSPACE_DIALOG"
          }
        },
        "sidebar.dashboard": {
          "id": "sidebar.dashboard",
          "label": "Dashboard",
          "_link": "",
          "icon": "fa-dashboard",
          "selected": 2,
          "order": 30,
          "parent": "primary",
          "link": [
            ""
          ]
        },
        "sidebar.reports": {
          "id": "sidebar.reports",
          "label": "Reports",
          "_link": "reports",
          "icon": "fa-tasks",
          "selected": 2,
          "order": 40,
          "parent": "primary",
          "link": [
            "reports"
          ]
        },
        "secondary.logut": {
          "id": "secondary.logut",
          "label": "Logout",
          "_link": {
            "type": "[AUTH] Logout"
          },
          "icon": "fa-sign-out",
          "selected": 2,
          "order": 99,
          "parent": "secondary",
          "action": {
            "type": "[AUTH] Logout"
          }
        }
      }
    },
    "scFileSelector": {
      "ids": [
        "Movies",
        "android",
        "Desktop",
        "Documents",
        "dolphin",
        "Downloads",
        "Dropbox",
        "go",
        "vpn-config",
        "VirtualBox VMs",
        "Library",
        "Applications",
        "Music",
        "npm",
        "OneDrive",
        "Public",
        "pgadmin",
        "Pictures",
        "Projects",
        "Zotero",
        "package-lock.json",
        "jssecacerts",
        "java_error_in_idea.hprof",
        "Projects/MyPlayground.playground",
        "Projects/consol",
        "Projects/docker",
        "Projects/docker-compose-test",
        "Projects/java",
        "Projects/javascript",
        "Projects/kotlin",
        "Projects/machine-learning",
        "Projects/mobile",
        "Projects/Design",
        "Projects/unity",
        "Projects/photo_test",
        "Projects/RD-84",
        "Projects/swift",
        "Projects/TEMP",
        "Projects/typescript",
        "Projects/web",
        "Projects/PANO_20160129_132329.jpg",
        "Projects/consol/hackathon_regensburg_2017",
        "Projects/consol/01_Orga",
        "Projects/consol/TA",
        "Projects/consol/dev_day",
        "Projects/consol/dnrd",
        "Projects/consol/experiments",
        "Projects/consol/aerzte_der_welt",
        "Projects/consol/labs.consol.de",
        "Projects/consol/os",
        "Projects/consol/smart_es",
        "Projects/consol/tmp",
        "Projects/consol/blog_image.pptx",
        "Projects/consol/TA/sakuli-se-example",
        "Projects/consol/TA/01_ORGA",
        "Projects/consol/TA/_sweetest-components",
        "Projects/consol/TA/citrus",
        "Projects/consol/TA/citrus-admin",
        "Projects/consol/TA/citrus-samples",
        "Projects/consol/TA/testautomation-docs",
        "Projects/consol/TA/go",
        "Projects/consol/TA/kyocera",
        "Projects/consol/TA/MA14",
        "Projects/consol/TA/sakuli",
        "Projects/consol/TA/sakuli-examples",
        "Projects/consol/TA/02_docs",
        "Projects/consol/TA/sakuli_installer",
        "Projects/consol/TA/sakuliadmin",
        "Projects/consol/TA/sakuliadmin Kopie",
        "Projects/consol/TA/showroom",
        "Projects/consol/TA/smartes",
        "Projects/consol/TA/sweetest-components",
        "Projects/consol/TA/temp",
        "Projects/consol/TA/undefined",
        "Projects/consol/TA/sweetest.afdesign",
        "Projects/consol/TA/sweetest-mock.afdesign",
        "Projects/consol/TA/Dockerfile",
        "Projects/consol/TA/sakuli/src",
        "Projects/consol/TA/sakuli/docs",
        "Projects/consol/TA/sakuli/example_test_suites",
        "Projects/consol/TA/sakuli/docker",
        "Projects/consol/TA/sakuli/LICENSE-2.0.txt",
        "Projects/consol/TA/sakuli/NOTICE.txt",
        "Projects/consol/TA/sakuli/pom.xml",
        "Projects/consol/TA/sakuli/README.md",
        "Projects/consol/TA/sakuli/sakuli.iml",
        "Projects/consol/TA/sakuli/changelog.md",
        "Projects/consol/TA/sakuli/mkdocs.yml",
        "Projects/consol/TA/sakuli/example_test_suites/example_macos",
        "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu",
        "Projects/consol/TA/sakuli/example_test_suites/example_windows7",
        "Projects/consol/TA/sakuli/example_test_suites/example_windows8",
        "Projects/consol/TA/sakuli/example_test_suites/example_xfce",
        "Projects/consol/TA/sakuli/example_test_suites/example_opensuse",
        "Projects/consol/TA/sakuli/example_test_suites/start_example_opensuse.sh",
        "Projects/consol/TA/sakuli/example_test_suites/start_example_ubuntu.sh",
        "Projects/consol/TA/sakuli/example_test_suites/start_example_windows7.bat",
        "Projects/consol/TA/sakuli/example_test_suites/start_example_windows8.bat",
        "Projects/consol/TA/sakuli/example_test_suites/start_example_xfce.sh",
        "Projects/consol/TA/sakuli/example_test_suites/sakuli.properties"
      ],
      "entities": {
        "Movies": {
          "path": "",
          "name": "Movies",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "android": {
          "path": "",
          "name": "android",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Desktop": {
          "path": "",
          "name": "Desktop",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Documents": {
          "path": "",
          "name": "Documents",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "dolphin": {
          "path": "",
          "name": "dolphin",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Downloads": {
          "path": "",
          "name": "Downloads",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Dropbox": {
          "path": "",
          "name": "Dropbox",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "go": {
          "path": "",
          "name": "go",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "vpn-config": {
          "path": "",
          "name": "vpn-config",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "VirtualBox VMs": {
          "path": "",
          "name": "VirtualBox VMs",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Library": {
          "path": "",
          "name": "Library",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Applications": {
          "path": "",
          "name": "Applications",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Music": {
          "path": "",
          "name": "Music",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "npm": {
          "path": "",
          "name": "npm",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "OneDrive": {
          "path": "",
          "name": "OneDrive",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Public": {
          "path": "",
          "name": "Public",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "pgadmin": {
          "path": "",
          "name": "pgadmin",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Pictures": {
          "path": "",
          "name": "Pictures",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects": {
          "path": "",
          "name": "Projects",
          "type": null,
          "directory": true,
          "open": true,
          "selected": false,
          "loading": false
        },
        "Zotero": {
          "path": "",
          "name": "Zotero",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "package-lock.json": {
          "path": "",
          "name": "package-lock.json",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "jssecacerts": {
          "path": "",
          "name": "jssecacerts",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "java_error_in_idea.hprof": {
          "path": "",
          "name": "java_error_in_idea.hprof",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/MyPlayground.playground": {
          "path": "Projects",
          "name": "MyPlayground.playground",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol": {
          "path": "Projects",
          "name": "consol",
          "type": null,
          "directory": true,
          "open": true,
          "selected": false,
          "loading": false
        },
        "Projects/docker": {
          "path": "Projects",
          "name": "docker",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/docker-compose-test": {
          "path": "Projects",
          "name": "docker-compose-test",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/java": {
          "path": "Projects",
          "name": "java",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/javascript": {
          "path": "Projects",
          "name": "javascript",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/kotlin": {
          "path": "Projects",
          "name": "kotlin",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/machine-learning": {
          "path": "Projects",
          "name": "machine-learning",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/mobile": {
          "path": "Projects",
          "name": "mobile",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/Design": {
          "path": "Projects",
          "name": "Design",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/unity": {
          "path": "Projects",
          "name": "unity",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/photo_test": {
          "path": "Projects",
          "name": "photo_test",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/RD-84": {
          "path": "Projects",
          "name": "RD-84",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/swift": {
          "path": "Projects",
          "name": "swift",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/TEMP": {
          "path": "Projects",
          "name": "TEMP",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/typescript": {
          "path": "Projects",
          "name": "typescript",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/web": {
          "path": "Projects",
          "name": "web",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/PANO_20160129_132329.jpg": {
          "path": "Projects",
          "name": "PANO_20160129_132329.jpg",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/hackathon_regensburg_2017": {
          "path": "Projects/consol",
          "name": "hackathon_regensburg_2017",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/01_Orga": {
          "path": "Projects/consol",
          "name": "01_Orga",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA": {
          "path": "Projects/consol",
          "name": "TA",
          "type": null,
          "directory": true,
          "open": true,
          "selected": false,
          "loading": false
        },
        "Projects/consol/dev_day": {
          "path": "Projects/consol",
          "name": "dev_day",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/dnrd": {
          "path": "Projects/consol",
          "name": "dnrd",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/experiments": {
          "path": "Projects/consol",
          "name": "experiments",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/aerzte_der_welt": {
          "path": "Projects/consol",
          "name": "aerzte_der_welt",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/labs.consol.de": {
          "path": "Projects/consol",
          "name": "labs.consol.de",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/os": {
          "path": "Projects/consol",
          "name": "os",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/smart_es": {
          "path": "Projects/consol",
          "name": "smart_es",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/tmp": {
          "path": "Projects/consol",
          "name": "tmp",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/blog_image.pptx": {
          "path": "Projects/consol",
          "name": "blog_image.pptx",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli-se-example": {
          "path": "Projects/consol/TA",
          "name": "sakuli-se-example",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/01_ORGA": {
          "path": "Projects/consol/TA",
          "name": "01_ORGA",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/_sweetest-components": {
          "path": "Projects/consol/TA",
          "name": "_sweetest-components",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/citrus": {
          "path": "Projects/consol/TA",
          "name": "citrus",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/citrus-admin": {
          "path": "Projects/consol/TA",
          "name": "citrus-admin",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/citrus-samples": {
          "path": "Projects/consol/TA",
          "name": "citrus-samples",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/testautomation-docs": {
          "path": "Projects/consol/TA",
          "name": "testautomation-docs",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/go": {
          "path": "Projects/consol/TA",
          "name": "go",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/kyocera": {
          "path": "Projects/consol/TA",
          "name": "kyocera",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/MA14": {
          "path": "Projects/consol/TA",
          "name": "MA14",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli": {
          "path": "Projects/consol/TA",
          "name": "sakuli",
          "type": null,
          "directory": true,
          "open": true,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli-examples": {
          "path": "Projects/consol/TA",
          "name": "sakuli-examples",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/02_docs": {
          "path": "Projects/consol/TA",
          "name": "02_docs",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli_installer": {
          "path": "Projects/consol/TA",
          "name": "sakuli_installer",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuliadmin": {
          "path": "Projects/consol/TA",
          "name": "sakuliadmin",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuliadmin Kopie": {
          "path": "Projects/consol/TA",
          "name": "sakuliadmin Kopie",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/showroom": {
          "path": "Projects/consol/TA",
          "name": "showroom",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/smartes": {
          "path": "Projects/consol/TA",
          "name": "smartes",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sweetest-components": {
          "path": "Projects/consol/TA",
          "name": "sweetest-components",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/temp": {
          "path": "Projects/consol/TA",
          "name": "temp",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/undefined": {
          "path": "Projects/consol/TA",
          "name": "undefined",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sweetest.afdesign": {
          "path": "Projects/consol/TA",
          "name": "sweetest.afdesign",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sweetest-mock.afdesign": {
          "path": "Projects/consol/TA",
          "name": "sweetest-mock.afdesign",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/Dockerfile": {
          "path": "Projects/consol/TA",
          "name": "Dockerfile",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/src": {
          "path": "Projects/consol/TA/sakuli",
          "name": "src",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/docs": {
          "path": "Projects/consol/TA/sakuli",
          "name": "docs",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites": {
          "path": "Projects/consol/TA/sakuli",
          "name": "example_test_suites",
          "type": null,
          "directory": true,
          "open": true,
          "selected": true,
          "loading": false
        },
        "Projects/consol/TA/sakuli/docker": {
          "path": "Projects/consol/TA/sakuli",
          "name": "docker",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/LICENSE-2.0.txt": {
          "path": "Projects/consol/TA/sakuli",
          "name": "LICENSE-2.0.txt",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/NOTICE.txt": {
          "path": "Projects/consol/TA/sakuli",
          "name": "NOTICE.txt",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/pom.xml": {
          "path": "Projects/consol/TA/sakuli",
          "name": "pom.xml",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/README.md": {
          "path": "Projects/consol/TA/sakuli",
          "name": "README.md",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/sakuli.iml": {
          "path": "Projects/consol/TA/sakuli",
          "name": "sakuli.iml",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/changelog.md": {
          "path": "Projects/consol/TA/sakuli",
          "name": "changelog.md",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/mkdocs.yml": {
          "path": "Projects/consol/TA/sakuli",
          "name": "mkdocs.yml",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_macos": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "example_macos",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "example_ubuntu",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_windows7": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "example_windows7",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_windows8": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "example_windows8",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_xfce": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "example_xfce",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_opensuse": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "example_opensuse",
          "type": null,
          "directory": true,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/start_example_opensuse.sh": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "start_example_opensuse.sh",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/start_example_ubuntu.sh": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "start_example_ubuntu.sh",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/start_example_windows7.bat": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "start_example_windows7.bat",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/start_example_windows8.bat": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "start_example_windows8.bat",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/start_example_xfce.sh": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "start_example_xfce.sh",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        },
        "Projects/consol/TA/sakuli/example_test_suites/sakuli.properties": {
          "path": "Projects/consol/TA/sakuli/example_test_suites",
          "name": "sakuli.properties",
          "type": null,
          "directory": false,
          "open": false,
          "selected": false,
          "loading": false
        }
      },
      "open": false
    },
    "project": {
      "fileTree": [],
      "selectedFile": null,
      "workspace": "Projects/consol/TA/sakuli/example_test_suites"
    },
    "assets": {
      "files": [],
      "currentFolder": null,
      "basePath": "",
      "uploading": [],
      "selectedFile": null,
      "pinned": []
    },
    "testsuite": {
      "ids": [
        "Projects/consol/TA/sakuli/example_test_suites/example_macos",
        "Projects/consol/TA/sakuli/example_test_suites/example_opensuse",
        "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu",
        "Projects/consol/TA/sakuli/example_test_suites/example_windows7",
        "Projects/consol/TA/sakuli/example_test_suites/example_windows8",
        "Projects/consol/TA/sakuli/example_test_suites/example_xfce"
      ],
      "entities": {
        "Projects/consol/TA/sakuli/example_test_suites/example_macos": {
          "name": "Projects/consol/TA/sakuli/example_test_suites/example_macos",
          "testCases": [
            {
              "configuration": null,
              "name": "case1",
              "sourceFiles": null,
              "configurationFiles": null,
              "comment": "use \"\" to disable single testcases\n... define your tescase like:\nfolder-of-testcase http:www.startURL.de",
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "active": true,
              "mainFile": "sakuli_demo.js"
            }
          ],
          "configurationFiles": [
            "Projects/consol/TA/sakuli/example_test_suites/example_macos/testsuite.properties",
            "Projects/consol/TA/sakuli/example_test_suites/example_macos/testsuite.suite"
          ],
          "configuration": {
            "id": "example_macos",
            "name": "example test suite for Sakuli",
            "warningTime": 120,
            "criticalTime": 140,
            "browser": "firefox",
            "testSuiteFile": "Projects/consol/TA/sakuli/example_test_suites/example_macos/testsuite.suite",
            "propertiesFile": "Projects/consol/TA/sakuli/example_test_suites/example_macos/testsuite.properties"
          },
          "root": "Projects/consol/TA/sakuli/example_test_suites/example_macos",
          "configurationFile": null,
          "testSuiteFile": null,
          "id": "example_macos"
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu": {
          "name": "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu",
          "testCases": [
            {
              "configuration": null,
              "name": "case1",
              "sourceFiles": null,
              "configurationFiles": null,
              "comment": "use \"\" to disable single testcases\n... define your tescase like:\nfolder-of-testcase http:www.startURL.de",
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "active": true,
              "mainFile": "sakuli_demo.js"
            }
          ],
          "configurationFiles": [
            "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu/testsuite.properties",
            "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu/testsuite.suite"
          ],
          "configuration": {
            "id": "example_ubuntu",
            "name": "example test suite for Sakuli",
            "warningTime": 120,
            "criticalTime": 140,
            "browser": "firefox",
            "testSuiteFile": "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu/testsuite.suite",
            "propertiesFile": "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu/testsuite.properties"
          },
          "root": "Projects/consol/TA/sakuli/example_test_suites/example_ubuntu",
          "configurationFile": null,
          "testSuiteFile": null,
          "id": "example_ubuntu"
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_windows7": {
          "name": "Projects/consol/TA/sakuli/example_test_suites/example_windows7",
          "testCases": [
            {
              "configuration": null,
              "name": "demo_win7",
              "sourceFiles": null,
              "configurationFiles": null,
              "comment": "use \"\" to disable single testcases\n... define your tescase like:\nfolder-of-testcase http:www.startURL.de",
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "active": true,
              "mainFile": "sakuli_demo.js"
            }
          ],
          "configurationFiles": [
            "Projects/consol/TA/sakuli/example_test_suites/example_windows7/testsuite.properties",
            "Projects/consol/TA/sakuli/example_test_suites/example_windows7/testsuite.suite"
          ],
          "configuration": {
            "id": "sakuli_windows7",
            "name": "example test suite for Sakuli",
            "warningTime": 120,
            "criticalTime": 140,
            "browser": "firefox",
            "testSuiteFile": "Projects/consol/TA/sakuli/example_test_suites/example_windows7/testsuite.suite",
            "propertiesFile": "Projects/consol/TA/sakuli/example_test_suites/example_windows7/testsuite.properties"
          },
          "root": "Projects/consol/TA/sakuli/example_test_suites/example_windows7",
          "configurationFile": null,
          "testSuiteFile": null,
          "id": "sakuli_windows7"
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_windows8": {
          "name": "Projects/consol/TA/sakuli/example_test_suites/example_windows8",
          "testCases": [
            {
              "configuration": null,
              "name": "demo_win8",
              "sourceFiles": null,
              "configurationFiles": null,
              "comment": "use \"\" to disable single testcases\n... define your tescase like:\nfolder-of-testcase http:www.startURL.de",
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "active": true,
              "mainFile": "sakuli_demo.js"
            }
          ],
          "configurationFiles": [
            "Projects/consol/TA/sakuli/example_test_suites/example_windows8/testsuite.properties",
            "Projects/consol/TA/sakuli/example_test_suites/example_windows8/testsuite.suite"
          ],
          "configuration": {
            "id": "sakuli_windows8",
            "name": "example test suite for Sakuli",
            "warningTime": 120,
            "criticalTime": 140,
            "browser": "firefox",
            "testSuiteFile": "Projects/consol/TA/sakuli/example_test_suites/example_windows8/testsuite.suite",
            "propertiesFile": "Projects/consol/TA/sakuli/example_test_suites/example_windows8/testsuite.properties"
          },
          "root": "Projects/consol/TA/sakuli/example_test_suites/example_windows8",
          "configurationFile": null,
          "testSuiteFile": null,
          "id": "sakuli_windows8"
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_opensuse": {
          "name": "Projects/consol/TA/sakuli/example_test_suites/example_opensuse",
          "testCases": [
            {
              "configuration": null,
              "name": "case1",
              "sourceFiles": null,
              "configurationFiles": null,
              "comment": "use \"\" to disable single testcases\n... define your tescase like:\nfolder-of-testcase http:www.startURL.de",
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "active": true,
              "mainFile": "sakuli_demo.js"
            }
          ],
          "configurationFiles": [
            "Projects/consol/TA/sakuli/example_test_suites/example_opensuse/testsuite.properties",
            "Projects/consol/TA/sakuli/example_test_suites/example_opensuse/testsuite.suite"
          ],
          "configuration": {
            "id": "example_opensuse",
            "name": "example test suite for Sakuli",
            "warningTime": 120,
            "criticalTime": 140,
            "browser": "firefox",
            "testSuiteFile": "Projects/consol/TA/sakuli/example_test_suites/example_opensuse/testsuite.suite",
            "propertiesFile": "Projects/consol/TA/sakuli/example_test_suites/example_opensuse/testsuite.properties"
          },
          "root": "Projects/consol/TA/sakuli/example_test_suites/example_opensuse",
          "configurationFile": null,
          "testSuiteFile": null,
          "id": "example_opensuse"
        },
        "Projects/consol/TA/sakuli/example_test_suites/example_xfce": {
          "name": "Projects/consol/TA/sakuli/example_test_suites/example_xfce",
          "testCases": [
            {
              "configuration": null,
              "name": "case1",
              "sourceFiles": null,
              "configurationFiles": null,
              "comment": "",
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "active": true,
              "mainFile": "sakuli_demo.js"
            }
          ],
          "configurationFiles": [
            "Projects/consol/TA/sakuli/example_test_suites/example_xfce/testsuite.properties",
            "Projects/consol/TA/sakuli/example_test_suites/example_xfce/testsuite.suite"
          ],
          "configuration": {
            "id": "example_xfce",
            "name": "example test suite inside of the Xfce desktop for Sakuli",
            "warningTime": 60,
            "criticalTime": 90,
            "browser": null,
            "testSuiteFile": "Projects/consol/TA/sakuli/example_test_suites/example_xfce/testsuite.suite",
            "propertiesFile": "Projects/consol/TA/sakuli/example_test_suites/example_xfce/testsuite.properties"
          },
          "root": "Projects/consol/TA/sakuli/example_test_suites/example_xfce",
          "configurationFile": null,
          "testSuiteFile": null,
          "id": "example_xfce"
        }
      },
      "selectedTestSuite": ""
    },
    "test": {
      "testSuite": null,
      "openTests": [],
      "activeTest": null,
      "testResults": [
        {
          "type": "object",
          "properties": {
            "dockerClientConfig": {
              "type": "object",
              "properties": {
                "dockerHost": {
                  "type": "string"
                },
                "apiVersion": {
                  "type": "object",
                  "properties": {
                    "version": {
                      "type": "string"
                    }
                  }
                },
                "registryUsername": {
                  "type": "string"
                },
                "registryPassword": {
                  "type": "string"
                },
                "registryEmail": {
                  "type": "string"
                },
                "registryUrl": {
                  "type": "string"
                },
                "authConfigurations": {
                  "type": "object",
                  "properties": {
                    "configs": {
                      "type": "object"
                    }
                  }
                },
                "sslconfig": {
                  "type": "object",
                  "properties": {
                    "sslcontext": {
                      "type": "object",
                      "properties": {
                        "provider": {
                          "type": "object"
                        },
                        "protocol": {
                          "type": "string"
                        },
                        "socketFactory": {
                          "type": "object",
                          "properties": {
                            "defaultCipherSuites": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            },
                            "supportedCipherSuites": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            }
                          }
                        },
                        "clientSessionContext": {
                          "type": "object",
                          "properties": {
                            "sessionTimeout": {
                              "type": "integer"
                            },
                            "ids": null,
                            "sessionCacheSize": {
                              "type": "integer"
                            }
                          }
                        },
                        "defaultSSLParameters": {
                          "type": "object",
                          "properties": {
                            "cipherSuites": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            },
                            "protocols": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            },
                            "wantClientAuth": {
                              "type": "boolean",
                              "required": true
                            },
                            "needClientAuth": {
                              "type": "boolean",
                              "required": true
                            },
                            "algorithmConstraints": null,
                            "useCipherSuitesOrder": {
                              "type": "boolean",
                              "required": true
                            },
                            "endpointIdentificationAlgorithm": {
                              "type": "string"
                            },
                            "serverNames": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "type": {
                                    "type": "integer"
                                  },
                                  "encoded": {
                                    "type": "array",
                                    "items": {
                                      "type": "string"
                                    }
                                  }
                                }
                              }
                            },
                            "snimatchers": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "type": {
                                    "type": "integer"
                                  }
                                }
                              }
                            }
                          }
                        },
                        "supportedSSLParameters": {
                          "type": "object",
                          "properties": {
                            "cipherSuites": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            },
                            "protocols": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            },
                            "wantClientAuth": {
                              "type": "boolean",
                              "required": true
                            },
                            "needClientAuth": {
                              "type": "boolean",
                              "required": true
                            },
                            "algorithmConstraints": null,
                            "useCipherSuitesOrder": {
                              "type": "boolean",
                              "required": true
                            },
                            "endpointIdentificationAlgorithm": {
                              "type": "string"
                            },
                            "serverNames": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "type": {
                                    "type": "integer"
                                  },
                                  "encoded": {
                                    "type": "array",
                                    "items": {
                                      "type": "string"
                                    }
                                  }
                                }
                              }
                            },
                            "snimatchers": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "type": {
                                    "type": "integer"
                                  }
                                }
                              }
                            }
                          }
                        },
                        "serverSessionContext": {
                          "type": "object",
                          "properties": {
                            "sessionTimeout": {
                              "type": "integer"
                            },
                            "ids": null,
                            "sessionCacheSize": {
                              "type": "integer"
                            }
                          }
                        },
                        "serverSocketFactory": {
                          "type": "object",
                          "properties": {
                            "defaultCipherSuites": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            },
                            "supportedCipherSuites": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "authenticationEnabled": {
              "type": "boolean",
              "required": true
            },
            "dockerComposeExecutionEnabled": {
              "type": "boolean",
              "required": true
            },
            "dockerContainerExecutionEnabled": {
              "type": "boolean",
              "required": true
            },
            "localExecutionEnabled": {
              "type": "boolean",
              "required": true
            },
            "dockerFileExecutionEnabled": {
              "type": "boolean",
              "required": true
            },
            "version": {
              "type": "string"
            }
          },
          "sourceFile": "test.json",
          "testSuitePath": "Projects/consol/TA/sakuli/example_test_suites/example_xfce"
        },
        {
          "browserName": "firefox",
          "browserInfo": null,
          "host": "710e039e7392",
          "testSuiteFolder": "../..",
          "testSuiteFile": "../../testsuite.suite",
          "dbJobPrimaryKey": -1,
          "testCases": {
            "case1": {
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "lastURL": null,
              "steps": [],
              "testActions": [
                {
                  "object": null,
                  "method": "Total Memory in JVM (Xmx) is: 889 MB;<br/>Memory currently in use is: 95 MB;<br/>Memory increment during this test is: 14.5 MB",
                  "args": [],
                  "message": "Sahi Action",
                  "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_null"
                }
              ],
              "tcFile": "../../case1/sakuli_demo.js",
              "startDate": null,
              "stopDate": null,
              "exception": {
                "stackTrace": "Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34\n\tat org.sakuli.exceptions.SakuliExceptionHandler.transformException(SakuliExceptionHandler.java:266)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.processException(SakuliExceptionHandler.java:152)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:140)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:299)\n\tat org.sakuli.aop.RhinoAspect.doHandleRhinoException(RhinoAspect.java:232)\n\tat net.sf.sahi.report.Report.addResult(Report.java:93)\n\tat net.sf.sahi.rhino.RhinoScriptRunner.run(RhinoScriptRunner.java:124)\n\tat java.lang.Thread.run(Thread.java:748)\nCaused by: Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34\n\t... 5 more\n",
                "detailMessage": "Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34",
                "screenshot": "../_screenshots/2018_02_27_15_39_42_249_Error_ERROR_CALL_Projects_.png"
              },
              "state": "ERRORS",
              "name": "case1",
              "dbPrimaryKey": -1,
              "warningTime": 40,
              "criticalTime": 60,
              "id": "case1",
              "creationDate": "2018-02-27T15:39:29.816Z"
            }
          },
          "startDate": "2018-02-27T15:39:29.760Z",
          "stopDate": "2018-02-27T15:39:44.963Z",
          "exception": null,
          "state": "ERRORS",
          "name": "example test suite inside of the Xfce desktop for Sakuli",
          "dbPrimaryKey": -1,
          "warningTime": 60,
          "criticalTime": 90,
          "id": "example_xfce",
          "creationDate": "2018-02-27T15:39:29.304Z",
          "sourceFile": "example_xfce_2018.02.27-15-39-45-188.json",
          "testSuitePath": "Projects/consol/TA/sakuli/example_test_suites/example_xfce"
        },
        {
          "browserName": "firefox",
          "browserInfo": null,
          "host": "04054b62015a",
          "testSuiteFolder": "../..",
          "testSuiteFile": "../../testsuite.suite",
          "dbJobPrimaryKey": -1,
          "testCases": {
            "case1": {
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "lastURL": null,
              "steps": [],
              "testActions": [
                {
                  "object": null,
                  "method": "Total Memory in JVM (Xmx) is: 889 MB;<br/>Memory currently in use is: 114.5 MB;<br/>Memory increment during this test is: 19.5 MB",
                  "args": [],
                  "message": "Sahi Action",
                  "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_null"
                }
              ],
              "tcFile": "../../case1/sakuli_demo.js",
              "startDate": null,
              "stopDate": null,
              "exception": {
                "stackTrace": "Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34\n\tat org.sakuli.exceptions.SakuliExceptionHandler.transformException(SakuliExceptionHandler.java:266)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.processException(SakuliExceptionHandler.java:152)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:140)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:299)\n\tat org.sakuli.aop.RhinoAspect.doHandleRhinoException(RhinoAspect.java:232)\n\tat net.sf.sahi.report.Report.addResult(Report.java:93)\n\tat net.sf.sahi.rhino.RhinoScriptRunner.run(RhinoScriptRunner.java:124)\n\tat java.lang.Thread.run(Thread.java:748)\nCaused by: Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34\n\t... 5 more\n",
                "detailMessage": "Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34",
                "screenshot": "../_screenshots/2018_02_27_15_38_19_847_Error_ERROR_CALL_Projects_.png"
              },
              "state": "ERRORS",
              "name": "case1",
              "dbPrimaryKey": -1,
              "warningTime": 40,
              "criticalTime": 60,
              "id": "case1",
              "creationDate": "2018-02-27T15:38:13.639Z"
            }
          },
          "startDate": "2018-02-27T15:38:13.583Z",
          "stopDate": "2018-02-27T15:38:24.243Z",
          "exception": null,
          "state": "ERRORS",
          "name": "example test suite inside of the Xfce desktop for Sakuli",
          "dbPrimaryKey": -1,
          "warningTime": 60,
          "criticalTime": 90,
          "id": "example_xfce",
          "creationDate": "2018-02-27T15:38:13.189Z",
          "sourceFile": "example_xfce_2018.02.27-15-38-24-459.json",
          "testSuitePath": "Projects/consol/TA/sakuli/example_test_suites/example_xfce"
        },
        {
          "browserName": "firefox",
          "browserInfo": null,
          "host": "e84e048cfd6b",
          "testSuiteFolder": "../..",
          "testSuiteFile": "../../testsuite.suite",
          "dbJobPrimaryKey": -1,
          "testCases": {
            "case1": {
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "lastURL": null,
              "steps": [],
              "testActions": [
                {
                  "object": null,
                  "method": "Total Memory in JVM (Xmx) is: 889 MB;<br/>Memory currently in use is: 94.5 MB;<br/>Memory increment during this test is: 15.5 MB",
                  "args": [],
                  "message": "Sahi Action",
                  "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_null"
                }
              ],
              "tcFile": "../../case1/sakuli_demo.js",
              "startDate": null,
              "stopDate": null,
              "exception": {
                "stackTrace": "Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34\n\tat org.sakuli.exceptions.SakuliExceptionHandler.transformException(SakuliExceptionHandler.java:266)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.processException(SakuliExceptionHandler.java:152)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:140)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:299)\n\tat org.sakuli.aop.RhinoAspect.doHandleRhinoException(RhinoAspect.java:232)\n\tat net.sf.sahi.report.Report.addResult(Report.java:93)\n\tat net.sf.sahi.rhino.RhinoScriptRunner.run(RhinoScriptRunner.java:124)\n\tat java.lang.Thread.run(Thread.java:748)\nCaused by: Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34\n\t... 5 more\n",
                "detailMessage": "Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34",
                "screenshot": "../_screenshots/2018_02_27_15_00_43_707_Error_ERROR_CALL_Projects_.png"
              },
              "state": "ERRORS",
              "name": "case1",
              "dbPrimaryKey": -1,
              "warningTime": 40,
              "criticalTime": 60,
              "id": "case1",
              "creationDate": "2018-02-27T15:00:37.849Z"
            }
          },
          "startDate": "2018-02-27T15:00:37.822Z",
          "stopDate": "2018-02-27T15:00:46.494Z",
          "exception": null,
          "state": "ERRORS",
          "name": "example test suite inside of the Xfce desktop for Sakuli",
          "dbPrimaryKey": -1,
          "warningTime": 60,
          "criticalTime": 90,
          "id": "example_xfce",
          "creationDate": "2018-02-27T15:00:37.446Z",
          "sourceFile": "example_xfce_2018.02.27-15-00-46-735.json",
          "testSuitePath": "Projects/consol/TA/sakuli/example_test_suites/example_xfce"
        },
        {
          "browserName": "firefox",
          "browserInfo": null,
          "host": "4ed963451ddf",
          "testSuiteFolder": "../..",
          "testSuiteFile": "../../testsuite.suite",
          "dbJobPrimaryKey": -1,
          "testCases": {
            "case1": {
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "lastURL": null,
              "steps": [
                {
                  "testActions": [],
                  "startDate": null,
                  "stopDate": null,
                  "exception": {
                    "stackTrace": "Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34\n\tat org.sakuli.exceptions.SakuliExceptionHandler.transformException(SakuliExceptionHandler.java:266)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.processException(SakuliExceptionHandler.java:152)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:140)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:299)\n\tat org.sakuli.aop.RhinoAspect.doHandleRhinoException(RhinoAspect.java:232)\n\tat net.sf.sahi.report.Report.addResult(Report.java:93)\n\tat net.sf.sahi.rhino.RhinoScriptRunner.run(RhinoScriptRunner.java:124)\n\tat java.lang.Thread.run(Thread.java:748)\nCaused by: Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34\n\t... 5 more\n",
                    "detailMessage": "Error => ERROR ... @CALL: /Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/sakuli_demo.js&n=34",
                    "screenshot": "../_screenshots/2018_02_27_14_56_49_379_Error_ERROR_CALL_Projects_.png"
                  },
                  "state": "ERRORS",
                  "name": "Test_Sahi_landing_page",
                  "dbPrimaryKey": -1,
                  "warningTime": -1,
                  "criticalTime": -1,
                  "id": "Test_Sahi_landing_page",
                  "creationDate": "2018-02-27T14:56:40.889Z"
                },
                {
                  "testActions": [],
                  "startDate": null,
                  "stopDate": null,
                  "exception": null,
                  "state": "INIT",
                  "name": "Calculation",
                  "dbPrimaryKey": -1,
                  "warningTime": -1,
                  "criticalTime": -1,
                  "id": "Calculation",
                  "creationDate": "2018-02-27T14:56:40.890Z"
                },
                {
                  "testActions": [],
                  "startDate": null,
                  "stopDate": null,
                  "exception": null,
                  "state": "INIT",
                  "name": "Editor",
                  "dbPrimaryKey": -1,
                  "warningTime": -1,
                  "criticalTime": -1,
                  "id": "Editor",
                  "creationDate": "2018-02-27T14:56:40.891Z"
                }
              ],
              "testActions": [
                {
                  "object": null,
                  "method": "Total Memory in JVM (Xmx) is: 889 MB;<br/>Memory currently in use is: 118.5 MB;<br/>Memory increment during this test is: 24 MB",
                  "args": [],
                  "message": "Sahi Action",
                  "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_null"
                }
              ],
              "tcFile": "../../case1/sakuli_demo.js",
              "startDate": null,
              "stopDate": null,
              "exception": null,
              "state": "ERRORS",
              "name": "case1",
              "dbPrimaryKey": -1,
              "warningTime": 40,
              "criticalTime": 60,
              "id": "case1",
              "creationDate": "2018-02-27T14:56:40.881Z"
            }
          },
          "startDate": "2018-02-27T14:56:40.788Z",
          "stopDate": "2018-02-27T14:56:51.578Z",
          "exception": null,
          "state": "ERRORS",
          "name": "example test suite inside of the Xfce desktop for Sakuli",
          "dbPrimaryKey": -1,
          "warningTime": 60,
          "criticalTime": 90,
          "id": "example_xfce",
          "creationDate": "2018-02-27T14:56:40.470Z",
          "sourceFile": "example_xfce_2018.02.27-14-56-51-824.json",
          "testSuitePath": "Projects/consol/TA/sakuli/example_test_suites/example_xfce"
        },
        {
          "browserName": "firefox",
          "browserInfo": "Mozilla/5.0 (X11, Linux x86_64, rv:45.0) Gecko/20100101 Firefox/45.0",
          "host": "fb33472ac919",
          "testSuiteFolder": "../..",
          "testSuiteFile": "../../testsuite.suite",
          "dbJobPrimaryKey": -1,
          "testCases": {
            "case1": {
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "lastURL": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "steps": [
                {
                  "testActions": [
                    {
                      "object": null,
                      "method": "_highlight(_link(\"SSL Manager\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": null,
                      "method": "_highlight(_link(\"Logs\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": null,
                      "method": "_highlight(_link(\"Online Documentation\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": null,
                      "method": "_highlight(_link(\"Test Pages\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": null,
                      "method": "_highlight(_link(\"Sample Application\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": "TestCaseAction",
                      "method": "addTestCaseStep",
                      "args": [
                        "Test Sahi landing page",
                        "1519723476768",
                        "1519723478016",
                        "5"
                      ],
                      "message": "add a step to the current test case",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#TestCaseAction.addTestCaseStep"
                    }
                  ],
                  "startDate": "2018-02-27T09:24:36.768Z",
                  "stopDate": "2018-02-27T09:24:38.016Z",
                  "exception": null,
                  "state": "OK",
                  "name": "Test_Sahi_landing_page",
                  "dbPrimaryKey": -1,
                  "warningTime": 5,
                  "criticalTime": -1,
                  "id": "Test_Sahi_landing_page",
                  "creationDate": "2018-02-27T09:24:31.825Z"
                },
                {
                  "testActions": [
                    {
                      "object": "Application",
                      "method": "open",
                      "args": [],
                      "message": "open application",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.open"
                    },
                    {
                      "object": "Region",
                      "method": "waitForImage",
                      "args": [
                        "calculator.png",
                        "5"
                      ],
                      "message": "wait for image for x seconds",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.waitForImage"
                    },
                    {
                      "object": "Region",
                      "method": "mouseMove",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.mouseMove"
                    },
                    {
                      "object": "Region",
                      "method": "highlight",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.highlight"
                    },
                    {
                      "object": "Environment",
                      "method": "type",
                      "args": [
                        "525"
                      ],
                      "message": "type over system keyboard",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Environment.type"
                    },
                    {
                      "object": "Environment",
                      "method": "sleep",
                      "args": [
                        "2.0"
                      ],
                      "message": "sleep and do nothing for x seconds",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Environment.sleep"
                    },
                    {
                      "object": "Application",
                      "method": "getRegion",
                      "args": [],
                      "message": "get a Region object from the application",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.getRegion"
                    },
                    {
                      "object": "Region",
                      "method": "find",
                      "args": [
                        "plus.png"
                      ],
                      "message": "find the image in this region",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.find"
                    },
                    {
                      "object": "Region",
                      "method": "highlight",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.highlight"
                    },
                    {
                      "object": "Region",
                      "method": "click",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.click"
                    },
                    {
                      "object": "Region",
                      "method": "type",
                      "args": [
                        "200"
                      ],
                      "message": "type over system keyboard",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.type"
                    },
                    {
                      "object": "Region",
                      "method": "find",
                      "args": [
                        "result.png"
                      ],
                      "message": "find the image in this region",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.find"
                    },
                    {
                      "object": "Region",
                      "method": "highlight",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.highlight"
                    },
                    {
                      "object": "Region",
                      "method": "click",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.click"
                    },
                    {
                      "object": "Region",
                      "method": "waitForImage",
                      "args": [
                        "625",
                        "5"
                      ],
                      "message": "wait for image for x seconds",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.waitForImage"
                    }
                  ],
                  "startDate": null,
                  "stopDate": null,
                  "exception": {
                    "stackTrace": "Can't find \"[id=625, path=/Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/625.png ]\" inR[0,0 1280x1024]@S(0)waitFor function in 5 sec.\n\tat org.sakuli.exceptions.SakuliExceptionHandler.transformException(SakuliExceptionHandler.java:266)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.processException(SakuliExceptionHandler.java:152)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:140)\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:285)\n\tat org.sakuli.actions.screenbased.RegionImpl.waitForImage(RegionImpl.java:262)\n\tat org.sakuli.actions.screenbased.Region.waitForImage(Region.java:249)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat org.mozilla.javascript.MemberBox.invoke(MemberBox.java:126)\n\tat org.mozilla.javascript.NativeJavaMethod.call(NativeJavaMethod.java:225)\n\tat org.mozilla.javascript.Interpreter.interpretLoop(Interpreter.java:1479)\n\tat org.mozilla.javascript.Interpreter.interpret(Interpreter.java:815)\n\tat org.mozilla.javascript.InterpretedFunction.call(InterpretedFunction.java:109)\n\tat org.mozilla.javascript.ContextFactory.doTopCall(ContextFactory.java:393)\n\tat org.mozilla.javascript.ScriptRuntime.doTopCall(ScriptRuntime.java:3282)\n\tat org.mozilla.javascript.InterpretedFunction.exec(InterpretedFunction.java:120)\n\tat org.mozilla.javascript.Context.evaluateString(Context.java:1219)\n\tat net.sf.sahi.rhino.RhinoScriptRunner.run(RhinoScriptRunner.java:114)\n\tat java.lang.Thread.run(Thread.java:748)\nCaused by: Can't find \"[id=625, path=/Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/625.png ]\" inR[0,0 1280x1024]@S(0)waitFor function in 5 sec.\n\tat org.sakuli.exceptions.SakuliExceptionHandler.handleException(SakuliExceptionHandler.java:286)\n\t... 17 more\n",
                    "detailMessage": "Can't find \"[id=625, path=/Projects/consol/TA/sakuli/example_test_suites/example_xfce/case1/625.png ]\" inR[0,0 1280x1024]@S(0)waitFor function in 5 sec.",
                    "screenshot": "../_screenshots/2018_02_27_09_24_53_198_Can_t_find_id_625_path_Pro.png"
                  },
                  "state": "ERRORS",
                  "name": "Calculation",
                  "dbPrimaryKey": -1,
                  "warningTime": -1,
                  "criticalTime": -1,
                  "id": "Calculation",
                  "creationDate": "2018-02-27T09:24:31.826Z"
                },
                {
                  "testActions": [],
                  "startDate": null,
                  "stopDate": null,
                  "exception": null,
                  "state": "INIT",
                  "name": "Editor",
                  "dbPrimaryKey": -1,
                  "warningTime": -1,
                  "criticalTime": -1,
                  "id": "Editor",
                  "creationDate": "2018-02-27T09:24:31.827Z"
                }
              ],
              "testActions": [
                {
                  "object": "Application",
                  "method": "closeApp",
                  "args": [
                    "true"
                  ],
                  "message": "",
                  "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.closeApp"
                },
                {
                  "object": "Application",
                  "method": "kill",
                  "args": [
                    "true"
                  ],
                  "message": "",
                  "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.kill"
                },
                {
                  "object": null,
                  "method": "_sahi.setServerVar('lastURL', window.document.location.href)",
                  "args": [],
                  "message": "Sahi Action",
                  "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_sahi.setServerVar"
                },
                {
                  "object": null,
                  "method": "_sahi.setServerVar('browser', navigator.userAgent)",
                  "args": [],
                  "message": "Sahi Action",
                  "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_sahi.setServerVar"
                },
                {
                  "object": "TestCaseAction",
                  "method": "saveResult",
                  "args": [
                    "case1",
                    "1519723476768",
                    "1519723493690",
                    "http://sahi.example.com/_s_/dyn/Driver_initialized",
                    "Mozilla/5.0 (X11, Linux x86_64, rv:45.0) Gecko/20100101 Firefox/45.0"
                  ],
                  "message": "save the result of the current test case",
                  "documentationURL": "http://consol.github.io/sakuli/latest/index.html#TestCaseAction.saveResult"
                }
              ],
              "tcFile": "../../case1/sakuli_demo.js",
              "startDate": "2018-02-27T09:24:36.768Z",
              "stopDate": "2018-02-27T09:24:53.690Z",
              "exception": null,
              "state": "ERRORS",
              "name": "case1",
              "dbPrimaryKey": -1,
              "warningTime": 40,
              "criticalTime": 60,
              "id": "case1",
              "creationDate": "2018-02-27T09:24:31.818Z"
            }
          },
          "startDate": "2018-02-27T09:24:31.770Z",
          "stopDate": "2018-02-27T09:24:58.347Z",
          "exception": null,
          "state": "ERRORS",
          "name": "example test suite inside of the Xfce desktop for Sakuli",
          "dbPrimaryKey": -1,
          "warningTime": 60,
          "criticalTime": 90,
          "id": "example_xfce",
          "creationDate": "2018-02-27T09:24:31.471Z",
          "sourceFile": "example_xfce_2018.02.27-09-24-58-550.json",
          "testSuitePath": "Projects/consol/TA/sakuli/example_test_suites/example_xfce"
        },
        {
          "browserName": "firefox",
          "browserInfo": "Mozilla/5.0 (X11, Linux x86_64, rv:45.0) Gecko/20100101 Firefox/45.0",
          "host": "0060cf301c7a",
          "testSuiteFolder": "../..",
          "testSuiteFile": "../../testsuite.suite",
          "dbJobPrimaryKey": -1,
          "testCases": {
            "case1": {
              "startUrl": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "lastURL": "http://sahi.example.com/_s_/dyn/Driver_initialized",
              "steps": [
                {
                  "testActions": [
                    {
                      "object": null,
                      "method": "_highlight(_link(\"SSL Manager\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": null,
                      "method": "_highlight(_link(\"Logs\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": null,
                      "method": "_highlight(_link(\"Online Documentation\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": null,
                      "method": "_highlight(_link(\"Test Pages\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": null,
                      "method": "_highlight(_link(\"Sample Application\"))",
                      "args": [],
                      "message": "Sahi Action",
                      "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_highlight"
                    },
                    {
                      "object": "TestCaseAction",
                      "method": "addTestCaseStep",
                      "args": [
                        "Test Sahi landing page",
                        "1519723330134",
                        "1519723331258",
                        "5"
                      ],
                      "message": "add a step to the current test case",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#TestCaseAction.addTestCaseStep"
                    }
                  ],
                  "startDate": "2018-02-27T09:22:10.134Z",
                  "stopDate": "2018-02-27T09:22:11.258Z",
                  "exception": null,
                  "state": "OK",
                  "name": "Test_Sahi_landing_page",
                  "dbPrimaryKey": -1,
                  "warningTime": 5,
                  "criticalTime": -1,
                  "id": "Test_Sahi_landing_page",
                  "creationDate": "2018-02-27T09:22:06.180Z"
                },
                {
                  "testActions": [
                    {
                      "object": "Application",
                      "method": "open",
                      "args": [],
                      "message": "open application",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.open"
                    },
                    {
                      "object": "Region",
                      "method": "waitForImage",
                      "args": [
                        "calculator.png",
                        "5"
                      ],
                      "message": "wait for image for x seconds",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.waitForImage"
                    },
                    {
                      "object": "Region",
                      "method": "mouseMove",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.mouseMove"
                    },
                    {
                      "object": "Region",
                      "method": "highlight",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.highlight"
                    },
                    {
                      "object": "Environment",
                      "method": "type",
                      "args": [
                        "525"
                      ],
                      "message": "type over system keyboard",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Environment.type"
                    },
                    {
                      "object": "Environment",
                      "method": "sleep",
                      "args": [
                        "2.0"
                      ],
                      "message": "sleep and do nothing for x seconds",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Environment.sleep"
                    },
                    {
                      "object": "Application",
                      "method": "getRegion",
                      "args": [],
                      "message": "get a Region object from the application",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.getRegion"
                    },
                    {
                      "object": "Region",
                      "method": "find",
                      "args": [
                        "plus.png"
                      ],
                      "message": "find the image in this region",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.find"
                    },
                    {
                      "object": "Region",
                      "method": "highlight",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.highlight"
                    },
                    {
                      "object": "Region",
                      "method": "click",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.click"
                    },
                    {
                      "object": "Region",
                      "method": "type",
                      "args": [
                        "100"
                      ],
                      "message": "type over system keyboard",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.type"
                    },
                    {
                      "object": "Region",
                      "method": "find",
                      "args": [
                        "result.png"
                      ],
                      "message": "find the image in this region",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.find"
                    },
                    {
                      "object": "Region",
                      "method": "highlight",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.highlight"
                    },
                    {
                      "object": "Region",
                      "method": "click",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.click"
                    },
                    {
                      "object": "Region",
                      "method": "waitForImage",
                      "args": [
                        "625",
                        "5"
                      ],
                      "message": "wait for image for x seconds",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.waitForImage"
                    },
                    {
                      "object": "Region",
                      "method": "highlight",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.highlight"
                    },
                    {
                      "object": "TestCaseAction",
                      "method": "addTestCaseStep",
                      "args": [
                        "Calculation",
                        "1519723331258",
                        "1519723342980",
                        "25"
                      ],
                      "message": "add a step to the current test case",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#TestCaseAction.addTestCaseStep"
                    }
                  ],
                  "startDate": "2018-02-27T09:22:11.258Z",
                  "stopDate": "2018-02-27T09:22:22.980Z",
                  "exception": null,
                  "state": "OK",
                  "name": "Calculation",
                  "dbPrimaryKey": -1,
                  "warningTime": 25,
                  "criticalTime": -1,
                  "id": "Calculation",
                  "creationDate": "2018-02-27T09:22:06.181Z"
                },
                {
                  "testActions": [
                    {
                      "object": "Application",
                      "method": "open",
                      "args": [],
                      "message": "open application",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.open"
                    },
                    {
                      "object": "Region",
                      "method": "waitForImage",
                      "args": [
                        "gedit.png",
                        "10"
                      ],
                      "message": "wait for image for x seconds",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.waitForImage"
                    },
                    {
                      "object": "Region",
                      "method": "highlight",
                      "args": [],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Region.highlight"
                    },
                    {
                      "object": "Environment",
                      "method": "paste",
                      "args": [
                        "Initial test passed. Sakuli, Sahi and Sikuli seem to work fine. Exiting..."
                      ],
                      "message": "",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Environment.paste"
                    },
                    {
                      "object": "TestCaseAction",
                      "method": "addTestCaseStep",
                      "args": [
                        "Editor",
                        "1519723342980",
                        "1519723345526",
                        "10"
                      ],
                      "message": "add a step to the current test case",
                      "documentationURL": "http://consol.github.io/sakuli/latest/index.html#TestCaseAction.addTestCaseStep"
                    }
                  ],
                  "startDate": "2018-02-27T09:22:22.980Z",
                  "stopDate": "2018-02-27T09:22:25.526Z",
                  "exception": null,
                  "state": "OK",
                  "name": "Editor",
                  "dbPrimaryKey": -1,
                  "warningTime": 10,
                  "criticalTime": -1,
                  "id": "Editor",
                  "creationDate": "2018-02-27T09:22:06.182Z"
                }
              ],
              "testActions": [
                {
                  "object": "Application",
                  "method": "closeApp",
                  "args": [
                    "true"
                  ],
                  "message": "",
                  "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.closeApp"
                },
                {
                  "object": "Application",
                  "method": "kill",
                  "args": [
                    "true"
                  ],
                  "message": "",
                  "documentationURL": "http://consol.github.io/sakuli/latest/index.html#Application.kill"
                },
                {
                  "object": null,
                  "method": "_sahi.setServerVar('lastURL', window.document.location.href)",
                  "args": [],
                  "message": "Sahi Action",
                  "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_sahi.setServerVar"
                },
                {
                  "object": null,
                  "method": "_sahi.setServerVar('browser', navigator.userAgent)",
                  "args": [],
                  "message": "Sahi Action",
                  "documentationURL": "http://sahipro.com/docs/all-topics.html?q=_sahi.setServerVar"
                },
                {
                  "object": "TestCaseAction",
                  "method": "saveResult",
                  "args": [
                    "case1",
                    "1519723330134",
                    "1519723345588",
                    "http://sahi.example.com/_s_/dyn/Driver_initialized",
                    "Mozilla/5.0 (X11, Linux x86_64, rv:45.0) Gecko/20100101 Firefox/45.0"
                  ],
                  "message": "save the result of the current test case",
                  "documentationURL": "http://consol.github.io/sakuli/latest/index.html#TestCaseAction.saveResult"
                }
              ],
              "tcFile": "../../case1/sakuli_demo.js",
              "startDate": "2018-02-27T09:22:10.134Z",
              "stopDate": "2018-02-27T09:22:25.588Z",
              "exception": null,
              "state": "OK",
              "name": "case1",
              "dbPrimaryKey": -1,
              "warningTime": 40,
              "criticalTime": 60,
              "id": "case1",
              "creationDate": "2018-02-27T09:22:06.172Z"
            }
          },
          "startDate": "2018-02-27T09:22:06.145Z",
          "stopDate": "2018-02-27T09:22:30.697Z",
          "exception": null,
          "state": "OK",
          "name": "example test suite inside of the Xfce desktop for Sakuli",
          "dbPrimaryKey": -1,
          "warningTime": 60,
          "criticalTime": 90,
          "id": "example_xfce",
          "creationDate": "2018-02-27T09:22:05.833Z",
          "sourceFile": "example_xfce_2018.02.27-09-22-30-839.json",
          "testSuitePath": "Projects/consol/TA/sakuli/example_test_suites/example_xfce"
        }
      ],
      "dockerPullInfo": {},
      "dockerPullStream": {}
    },
    "testEditor": {
      "ids": [],
      "entities": {},
      "selected": ""
    },
    "testexecution": {
      "ids": [],
      "entities": {}
    },
    "testexecutionlog": {
      "ids": [],
      "entities": {}
    }
  }
}
