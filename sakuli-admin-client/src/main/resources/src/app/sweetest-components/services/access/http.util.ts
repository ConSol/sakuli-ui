import {Response} from "@angular/http";

export function jsonOrDefault<T>(defaultValue: T) {
  return (res: Response) => {
    return res.ok ? (res.json() as T) || defaultValue : defaultValue;
  }
}
