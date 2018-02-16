import {
  LOAD_RUN_CONFIGURATION_SUCCESS,
  LOAD_SAKULI_CONTAINER_SUCCESS,
  LOAD_SAKULI_CONTAINER_TAGS_SUCCESS,
  RunConfigurationActions,
  SELECT_SAKULI_CONTAINER
} from "./run-configuration.actions";
import {ContainerTag, RunConfigurationState, SakuliContainer} from "./run-configuration.interface";

function getDefaultTag(currentTag: ContainerTag, tags: ContainerTag[] = []) {
  return currentTag ? (tags || []).find(t => currentTag.name === t.name)
    : tags.find(t => t.name === 'latest')
    || tags[0];
}

function getDefaultContainer(currentContainer: SakuliContainer, container: SakuliContainer[] = []) {
  return (currentContainer) ? container.find(c => c.name === currentContainer.name) || container[0] : container[0];
}

export function runConfigurationReducer(state: RunConfigurationState, action: RunConfigurationActions): RunConfigurationState {
  switch (action.type) {
    case LOAD_RUN_CONFIGURATION_SUCCESS: {
      return ({...state, configuration: action.runConfiguration});
    }
    case LOAD_SAKULI_CONTAINER_SUCCESS: {
      const {containers} = action;
      const {container: currentContainer} = state.configuration.sakuli;
      return ({
        ...state,
        configuration: {
          ...state.configuration,
          sakuli: {
            ...state.configuration.sakuli,
            container: getDefaultContainer(currentContainer, containers)
          }
        },
        containers
      })
    }
    case LOAD_SAKULI_CONTAINER_TAGS_SUCCESS: {
      const {container, tags = []} = action;
      const {tag} = state.configuration.sakuli;
      return ({
        ...state,
        configuration: {
          ...state.configuration,
          sakuli: {
            ...state.configuration.sakuli,
            tag: getDefaultTag(tag, tags)
          }
        },
        tags: {
          ...state.tags,
          [container.name]: tags
        }
      });
    }
    case SELECT_SAKULI_CONTAINER: {
      const {container} = action;
      const {containers} = state;
      return ({
        ...state, configuration: {
          ...state.configuration,
          sakuli: {
            ...state.configuration.sakuli,
            container: getDefaultContainer(container, containers)
          }
        }
      });
    }
  }
  return state;
}
