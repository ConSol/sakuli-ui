
import {urlencoded} from "./utils";

describe('core.utils', () => {
  describe('urlencoded', () => {

    it('should encode dynamic parts', () => {
      const enc = urlencoded`my/path/to/${'encoded/path'}`;
      expect(enc).toBe('my/path/to/encoded%2Fpath');
    })

  })
});
