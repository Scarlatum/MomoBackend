type AnonymousFunction = (...params: Array<any>) => any

declare type ParametersUnsafe<T> = T extends (...params: infer P) => any
  ? P
  : never

declare type Callable<O> = O extends AnonymousFunction
  ? O
  : never

declare type UnwrapPromise<T extends Promise<any>> = T extends Promise<infer V>
  ? V
  : never