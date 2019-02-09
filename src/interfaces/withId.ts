import { INamed } from '.';

export default function withId<T>(id: string, obj: T): INamed<T> {
  return {
    id,
    ...obj
  };
}
