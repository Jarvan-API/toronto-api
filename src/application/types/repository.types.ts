export interface ICreateDocument<T> {
  value: T;
  options?: ICreateDocumentOptions;
}

export interface ICreateDocumentOptions {
  encryption?: IEncryptionOptions;
}

export interface IEncryptionOptions {
  encryptKey?: string;
  includeFields?: string[];
}
