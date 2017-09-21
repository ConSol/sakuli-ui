export const uniq = <T>(array: T[], idFactory: (e: T) => string) => {
  return Array.from(
    array
      .reduce((m, e) => {
        const id = idFactory(e);
        if (!m.has(id)) {
          m.set(id, e);
        }
        return m;
      }, new Map())
      .values()
  );
}
