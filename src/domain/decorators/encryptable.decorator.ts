export const ENCRYPTABLE_KEY = "encryptable";

export function Encryptable(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(ENCRYPTABLE_KEY, true, target, propertyKey);
  };
}
