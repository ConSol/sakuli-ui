import {getModeForPath} from "./modelist";

describe('modelist', () => {
    it('should detect json', () => {
      const mode = getModeForPath("ace/mode/json.json");
      expect(mode.name).toBe('json');
    })
});
