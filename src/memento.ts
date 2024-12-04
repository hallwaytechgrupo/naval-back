export class Memento {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private state: any;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  constructor(state: any) {
    this.state = state;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getState(): any {
    return this.state;
  }
}
