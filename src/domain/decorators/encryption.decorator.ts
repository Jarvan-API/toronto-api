export const ENCRYPTABLE_KEY = Symbol("encryptable");

export function Encryptable(): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(ENCRYPTABLE_KEY, true, target, propertyKey);
  };
}
