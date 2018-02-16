import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {
  LOAD_RUN_CONFIGURATION,
  LOAD_RUN_CONFIGURATION_SUCCESS,
  LOAD_SAKULI_CONTAINER,
  LOAD_SAKULI_CONTAINER_SUCCESS,
  LOAD_SAKULI_CONTAINER_TAGS,
  LOAD_SAKULI_CONTAINER_TAGS_SUCCESS,
  LoadRunConfiguration,
  LoadRunConfigurationSuccess,
  LoadSakuliContainerSuccess,
  LoadSakuliContainerTags,
  LoadSakuliContainerTagsSuccess,
  SAVE_RUN_CONFIGURATION,
  SAVE_RUN_CONFIGURATION_SUCCESS,
  SaveRunConfiguration,
  SaveRunConfigurationSuccess,
  SELECT_SAKULI_CONTAINER,
  SelectSakuliContainer
} from "./run-configuration.actions";
import {RunConfigurationService} from "../../../sweetest-components/services/access/run-configuration.service";
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {ContainerTag, RunConfiguration, SakuliContainer} from "./run-configuration.interface";
import {ScToastService} from "../../../sweetest-components/components/presentation/toast/toast.service";
import {CreateToast, ErrorMessage,} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {ScLoadingService} from "../../../sweetest-components/components/presentation/loading/sc-loading.service";
import {SuccessToast} from "../../../sweetest-components/components/presentation/toast/toast.model";

@Injectable()
export class RunConfigurationEffects {

  @Effect() getConfig$ = this.actions$
    .ofType(LOAD_RUN_CONFIGURATION)
    .mergeMap((lrc: LoadRunConfiguration) => this.runConfigurationService
      .getRunConfiguration(lrc.path)
      .map((r: RunConfiguration) => new LoadRunConfigurationSuccess(r))
      .catch(ErrorMessage(`cannot fetch current configuration`))
    );

  @Effect() getConfigSuccess$ = this.actions$
    .ofType(LOAD_RUN_CONFIGURATION_SUCCESS)
    .filter((a: LoadRunConfigurationSuccess) => !!a.runConfiguration.sakuli.container)
    .map((a: LoadRunConfigurationSuccess) => new SelectSakuliContainer(a.runConfiguration.sakuli.container));

  @Effect() saveConfig$ = this.actions$
    .ofType(SAVE_RUN_CONFIGURATION)
    .mergeMap((a: SaveRunConfiguration) => this
      .runConfigurationService
      .saveRunConfiguration(a.path, a.runConfiguration)
      .map(_ => a.runConfiguration)
      .mergeMap((rc) => [
        new SaveRunConfigurationSuccess(),
        new LoadRunConfigurationSuccess(rc)
      ])
      .catch(ErrorMessage(`Unable to save configuration`))
    );

  @Effect() saveConfigSuccess$ = this.actions$
    .ofType(SAVE_RUN_CONFIGURATION_SUCCESS)
    .mergeMap(() => [
      new CreateToast(new SuccessToast('Successfully saved configuration')),
    ]);


  @Effect() loadContainer$ = this.actions$.ofType(LOAD_SAKULI_CONTAINER)
    .mergeMap(_ => this.runConfigurationService
      .loadSakuliContainer()
      .map((c:SakuliContainer[]) => new LoadSakuliContainerSuccess(c))
      .catch(ErrorMessage(`Unable to fetch sakuli-containers`))
    );

  /*
  @Effect() loadSakuliContainersSuccess$ = this.actions$.ofType(LOAD_SAKULI_CONTAINER_SUCCESS)
    .withLatestFrom(this.store.select(RunConfigurationSelect.runConfiguration))
    .filter(([_ , rc]: [LoadSakuliContainerSuccess, RunConfiguration]) => !!rc.sakuli.tag)
    .map(([a , rc]: [LoadSakuliContainerSuccess, RunConfiguration]) => new SelectSakuliContainer(a.containers[0]));
  */

  @Effect() loadContainerTags$ = this.actions$.ofType(LOAD_SAKULI_CONTAINER_TAGS)
    .filter((a: LoadSakuliContainerTags) => !!a.container)
    .mergeMap((a: LoadSakuliContainerTags) => this
      .runConfigurationService
      .loadSakuliContainerTags(a.container.name)
      .map((c:ContainerTag[]) => new LoadSakuliContainerTagsSuccess(a.container, c))
      .catch(ErrorMessage(`Unable to fetch tags for '${a.container.name}'`))
    );

  @Effect() selectContainer$ = this.actions$.ofType(SELECT_SAKULI_CONTAINER)
    .map((a: SelectSakuliContainer) => new LoadSakuliContainerTags(a.container));

  @Effect() loadingState = this.loading.registerLoadingActions(
    'runconfig',
    LOAD_RUN_CONFIGURATION,
    LOAD_RUN_CONFIGURATION_SUCCESS
  );

  @Effect() loadingContainer = this.loading.registerLoadingActions(
    'sakuli-containers',
    LOAD_SAKULI_CONTAINER,
    LOAD_SAKULI_CONTAINER_SUCCESS
  );

  @Effect() loadingTags = this.loading.registerLoadingActions(
    'tags',
    LOAD_SAKULI_CONTAINER_TAGS,
    LOAD_SAKULI_CONTAINER_TAGS_SUCCESS
  );


  constructor(readonly actions$: Actions,
              readonly runConfigurationService: RunConfigurationService,
              readonly store: Store<AppState>,
              readonly toast: ScToastService,
              readonly loading: ScLoadingService,) {

  }
}
