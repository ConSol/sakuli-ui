
export const fileName = (v: string, ps = '/') => v.split(ps).pop();
export const pathName = (v: string, ps = '/') => v.indexOf('.') > -1 ? v.split(ps).slice(0,-1).join(ps) : v;
