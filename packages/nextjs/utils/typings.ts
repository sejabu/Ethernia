export interface EthereumProvider {
  request(args: RequestArguments): Promise<unknown>;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this;
}

export type RequestArguments = {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
};
