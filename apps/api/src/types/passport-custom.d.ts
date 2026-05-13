declare module 'passport-custom' {
  type DoneCallback = (err: unknown, user?: unknown, info?: unknown) => void;

  class Strategy {
    constructor(
      verify: (req: import('express').Request, done: DoneCallback) => void,
    );
  }

  export = Strategy;
}
