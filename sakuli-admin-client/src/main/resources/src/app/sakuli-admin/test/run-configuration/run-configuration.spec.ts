import {TestBed} from "@angular/core/testing";
import {RunConfigurationEffects} from "./run-configuration.effects";
import {provideMockActions} from "@ngrx/effects/testing";
import {Observable} from "rxjs/Observable";
import {marbles} from "rxjs-marbles";
import {
  LoadRunConfiguration, LoadRunConfigurationSuccess, LoadSakuliContainer, LoadSakuliContainerSuccess,
  LoadSakuliContainerTags, LoadSakuliContainerTagsSuccess,
  SaveRunConfiguration,
  SaveRunConfigurationSuccess,
  SelectSakuliContainer
} from "./run-configuration.actions";
import {RunConfigurationService} from "../../../sweetest-components/services/access/run-configuration.service";
import {Store, StoreModule} from "@ngrx/store";
import {RunConfigurationModule} from "./run-configuration.module";
import {CreateToast, ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {EffectsModule} from "@ngrx/effects";
import {RunConfiguration} from "./run-configuration.interface";
import {RunConfigurationTypes} from "./run-configuration-types.enum";
import {
  DangerToast,
  SuccessToast, IToast
} from "../../../sweetest-components/components/presentation/toast/toast-state.interface";
import {
  LoadingSetBusy,
  LoadingSetIdle
} from "../../../sweetest-components/components/presentation/loading/sc-loading.state";
import {RouterModule} from "@angular/router";
import {APP_BASE_HREF} from "@angular/common";
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
        container: {name: 'container'}
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
          a: new LoadRunConfiguration()
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
        mockActions = m.hot('---a-', {
          a: new LoadRunConfiguration()
        });
        const error = Error();
        mockRunConfigurationService.getRunConfiguration.mockReturnValueOnce(m.cold('#', null, error));
        const expected = m.cold('---a-', {
          a: new CreateToast(new DangerToast('cannot fetch current configuration', error))
        });
        m.expect(effects.getConfig$).toBeObservable(expected)
      }));
    });

    describe('getConfigSuccess$', () => {

      it('positive', marbles(m => {
        mockActions = m.hot('--a', {a: new LoadRunConfigurationSuccess(runConfiguration)})
        const expect = m.cold('--a', {
          a: new SelectSakuliContainer(runConfiguration.sakuli.container)
        });
        m.expect(effects.getConfigSuccess$).toBeObservable(expect)
      }));

    })

    describe('saveConfig$', () => {

      it('positive', marbles(m => {
        mockActions = m.hot('-a', {
          a: new SaveRunConfiguration(runConfiguration)
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
          a: new SaveRunConfiguration(runConfiguration)
        });
        const error = Error();
        mockRunConfigurationService.saveRunConfiguration
          .mockReturnValueOnce(m.cold('#', null, error))
        const expect = m.cold('-a', {
          a: new CreateToast(new DangerToast('Unable to save configuration', error))
        });
        m.expect(effects.saveConfig$).toBeObservable(expect);
      }))
    });

    describe('saveConfigSuccess$', () => {

      it('positive', marbles(m => {
        mockActions = m.hot('-a', {
          a: new SaveRunConfigurationSuccess()
        });
        mockRunConfigurationService.saveRunConfiguration
          .mockReturnValueOnce(m.cold('a|', {a: runConfiguration}));
        const expect = m.cold('-a', {
          a: new CreateToast(new SuccessToast('Successfully saved configuration')),
        });
        m.expect(effects.saveConfigSuccess$).toBeObservable(expect);
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

        const expect = m.cold('-a', {
          a: new CreateToast(new DangerToast('Unable to fetch sakuli-containers', error))
        });
        m.expect(effects.loadContainer$).toBeObservable(expect);
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

        const expect = m.cold('--a', {
          a: new CreateToast(new DangerToast(`Unable to fetch tags for '${runConfiguration.sakuli.container.name}'`, error))
        });

        m.expect(effects.loadContainerTags$).toBeObservable(expect);
      }))
    })

    describe('loading', () => {

      it('should set loading for runconfig', marbles(m => {
        mockActions = m.hot('--a--b', {
          a: new LoadRunConfiguration(),
          b: new LoadRunConfigurationSuccess(null)
        })

        const expect = m.cold('--a--b', {
          a: new LoadingSetBusy('runconfig'),
          b: new LoadingSetIdle('runconfig')
        })

        m.expect(effects.loadingState).toBeObservable(expect);
      }))

      it('should set loading for sakuli-container', marbles(m => {
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
