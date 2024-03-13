export interface ISlackRepository {
  notify: (text: string) => Promise<any>;
}
