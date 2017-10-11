import {BoundIndexIterator} from "./utils";

describe('utils', () => {
  describe(BoundIndexIterator.name, () => {
    let iterator: BoundIndexIterator;

    it('should navigate forward', () => {
      iterator = new BoundIndexIterator(3);
      expect(iterator.current).toEqual(0);
      expect(iterator.next()).toEqual(1);
      expect(iterator.next()).toEqual(2);
      expect(iterator.next()).toEqual(0);
      expect(iterator.next()).toEqual(1)
    })

    it('should navigate backward', () => {
      iterator = new BoundIndexIterator(3);
      expect(iterator.current).toEqual(0);
      expect(iterator.prev()).toEqual(2);
      expect(iterator.prev()).toEqual(1);
      expect(iterator.prev()).toEqual(0);
      expect(iterator.prev()).toEqual(2)
    })
  })
})
