import {BoundIndexIterator,  Deferred} from "./utils";

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
  });

  describe(Deferred.name, () => {

    it('should resolve a value in promise', done =>  {
      const deferred = new Deferred<number>();
      deferred.resolve(5);
      deferred.promise.then(v => {
        expect(v).toBe(5);
        done();
      })
    });

    it('should reject a error in promise', done => {
      const deferred = new Deferred<number>();
      deferred.reject('fail');
      deferred.promise.then(
        () => {
        fail("should not resolve")
      },
        (reason: any) => {
          expect(reason).toBe('fail');
          done();
        })
    });

    it('should resolve value on each then', async (done) => {
      const deferred = new Deferred<number>();
      deferred.resolve(5);
      const v1 = await deferred.promise;
      const v2 = await deferred.promise;
      expect(v1).toBe(5);
      expect(v2).toBe(5);
      done();
      })
    })
});
