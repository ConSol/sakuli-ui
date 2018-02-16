import {TestBed} from "@angular/core/testing";
import {RunConfigurationEffects} from "./run-configuration.effects";
import {provideMockActions} from "@ngrx/effects/testing";
import {Observable} from "rxjs/Observable";
import {marbles} from "rxjs-marbles";
import {
  LoadRunConfiguration,
  LoadRunConfigurationSuccess,
  LoadSakuliContainer,
  LoadSakuliContainerSuccess,
  LoadSakuliContainerTags,
  LoadSakuliContainerTagsSuccess,
  SaveRunConfiguration,
  SaveRunConfigurationSuccess,
  SelectSakuliContainer
} from "./run-configuration.actions";
import {RunConfigurationService} from "../../../sweetest-components/services/access/run-configuration.service";
import {StoreModule} from "@ngrx/store";
import {RunConfigurationModule} from "./run-configuration.module";
import {ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {EffectsModule} from "@ngrx/effects";
import {RunConfiguration} from "./run-configuration.interface";
import {RunConfigurationTypes} from "./run-configuration-types.enum";
import {
  LoadingSetBusy,
  LoadingSetIdle
} from "../../../sweetest-components/components/presentation/loading/sc-loading.state";
import {RouterModule} from "@angular/router";
import {APP_BASE_HREF} from "@angular/common";
import {DangerToast} from "../../../sweetest-components/components/presentation/toast/toast.model";
import {CREATE_TOAST, CreateToast} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import Mocked = jest.Mocked;


describe(RunConfigurationEffects.name, () => {


    const runConfiguration: RunConfiguration = {
      type: RunConfigurationTypes.Local,
      dockerCompose: {
        file: ''
      },
      dockerfile: {
        file: ''
      },
      local: {},
      sakuli: {
        tag: {name: 'tag'},
        container: {name: 'container'},
        environment: []
      }
    };

    let mockActions: Observable<any>;
    let effects: RunConfigurationEffects;

    const mockRunConfigurationService: Mocked<Partial<RunConfigurationService>> = {
      loadSakuliContainerTags: jest.fn(),
      loadSakuliContainer: jest.fn(),
      saveRunConfiguration: jest.fn(),
      getRunConfiguration: jest.fn()
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          RunConfigurationModule,
          RouterModule.forRoot([])
        ],
        providers: [
          RunConfigurationEffects,
          provideMockActions(() => mockActions),
          {provide: RunConfigurationService, useValue: mockRunConfigurationService},
          {provide: ScToastService, useValue: {}},
          {provide: APP_BASE_HREF, useValue: ''},
        ]
      });
      effects = TestBed.get(RunConfigurationEffects);
    });

    describe('getConfig$', () => {
      it('positive', marbles(m => {
        mockActions = m.hot('---a-', {
          a: new LoadRunConfiguration('')
        });
        mockRunConfigurationService.getRunConfiguration.mockReturnValueOnce(m.cold('a|', {
          a: runConfiguration
        }));
        const expected = m.cold('---a-', {
          a: new LoadRunConfigurationSuccess(runConfiguration)
        });

        m.expect(effects.getConfig$).toBeObservable(expected)
      }));

      it('negative', marbles(m => {
        const error = Error();
        const values = {
          a: new LoadRunConfiguration(''),
          r: new CreateToast(new DangerToast('cannot fetch current configuration', error))
        }
        mockActions = m.cold('---a-', values);
        mockRunConfigurationService.getRunConfiguration.mockReturnValueOnce(m.cold('#', null, error));
        effects.getConfig$.subscribe(a => {
          expect(a.type).toBe(values.r.type);
        })
      }));
    });

    describe('getConfigSuccess$', () => {
      it('positive', marbles(m => {
        mockActions = m.hot('--a', {a: new LoadRunConfigurationSuccess(runConfiguration)});
        const expect = m.cold('--a', {
          a: new SelectSakuliContainer(runConfiguration.sakuli.container)
        });
        m.expect(effects.getConfigSuccess$).toBeObservable(expect)
      }));

    })

    describe('saveConfig$', () => {

      it('positive', marbles(m => {
        mockActions = m.hot('-a', {
          a: new SaveRunConfiguration('', runConfiguration)
        })
        mockRunConfigurationService.saveRunConfiguration
          .mockReturnValueOnce(m.cold('a|', {a: runConfiguration}));
        const expect = m.cold('-(ab)', {
          a: new SaveRunConfigurationSuccess(),
          b: new LoadRunConfigurationSuccess(runConfiguration)
        });
        m.expect(effects.saveConfig$).toBeObservable(expect);
      }));

      it('negative', marbles(m => {
        mockActions = m.hot('-a', {
          a: new SaveRunConfiguration('', runConfiguration)
        });
        const error = Error();
        mockRunConfigurationService.saveRunConfiguration
          .mockReturnValueOnce(m.cold('#', null, error));

        effects.saveConfig$.subscribe(a => {
          expect(a.type).toBe(CREATE_TOAST);
        })
      }))
    });

    describe('saveConfigSuccess$', () => {

      it('positive', marbles(m => {
        mockActions = m.hot('-a', {
          a: new SaveRunConfigurationSuccess()
        });
        mockRunConfigurationService.saveRunConfiguration
          .mockReturnValueOnce(m.cold('a|', {a: runConfiguration}));
        effects.saveConfigSuccess$.subscribe(a => {
          expect(a.type).toBe(CREATE_TOAST);
        })
      }));

    });

    describe('loadContainer$', () => {

      it('positive', marbles(m => {
        mockActions = m.hot('-a-', {
          a: new LoadSakuliContainer()
        });
        mockRunConfigurationService.loadSakuliContainer
          .mockReturnValueOnce(m.cold('a|', {a: []}));
        const expect = m.cold('-a', {
          a: new LoadSakuliContainerSuccess([]),
        });
        m.expect(effects.loadContainer$).toBeObservable(expect);

      }));

      it('negative', marbles(m => {
        mockActions = m.hot('-a-', {
          a: new LoadSakuliContainer()
        });

        const error = Error();
        mockRunConfigurationService.loadSakuliContainer
          .mockReturnValueOnce(m.cold('#', null, error));

        effects.loadContainer$.subscribe(a => {
          expect(a.type).toBe(CREATE_TOAST);
        })
      }))
    })

    describe('loadContainerTags$', () => {
      it('positiv', marbles(m => {
        mockActions = m.hot('--a', {
          a: new LoadSakuliContainerTags(runConfiguration.sakuli.container)
        });

        mockRunConfigurationService.loadSakuliContainerTags
          .mockReturnValueOnce(m.cold('a|', {a: []}));

        const expect = m.cold('--a', {
          a: new LoadSakuliContainerTagsSuccess(runConfiguration.sakuli.container, [])
        });
        m.expect(effects.loadContainerTags$).toBeObservable(expect);
      }));

      it('negative', marbles(m => {
        mockActions = m.hot('--a', {
          a: new LoadSakuliContainerTags(runConfiguration.sakuli.container)
        });

        const error = Error();
        mockRunConfigurationService.loadSakuliContainerTags
          .mockReturnValueOnce(m.cold('#', null, error));

        effects.loadContainerTags$.subscribe(a => {
          expect(a.type).toBe(CREATE_TOAST)
        })
      }))
    })

    describe('loading', () => {

      it('should set loading for runconfig', marbles(m => {
        mockActions = m.hot('--a--b', {
          a: new LoadRunConfiguration(''),
          b: new LoadRunConfigurationSuccess(null)
        })

        const expect = m.cold('--a--b', {
          a: new LoadingSetBusy('runconfig'),
          b: new LoadingSetIdle('runconfig')
        })

        m.expect(effects.loadingState).toBeObservable(expect);
      }))

      it('should set loading for sakuli-containers', marbles(m => {
        mockActions = m.hot('--a--b', {
          a: new LoadSakuliContainer(),
          b: new LoadSakuliContainerSuccess(null)
        })

        const expect = m.cold('--a--b', {
          a: new LoadingSetBusy('sakuli-containers'),
          b: new LoadingSetIdle('sakuli-containers')
        })

        m.expect(effects.loadingContainer).toBeObservable(expect);
      }))


      it('should set loading for tags', marbles(m => {
        mockActions = m.hot('--a--b', {
          a: new LoadSakuliContainerTags(null),
          b: new LoadSakuliContainerTagsSuccess(null, null)
        })

        const expect = m.cold('--a--b', {
          a: new LoadingSetBusy('tags'),
          b: new LoadingSetIdle('tags')
        })

        m.expect(effects.loadingTags).toBeObservable(expect);
      }))


    })

});
