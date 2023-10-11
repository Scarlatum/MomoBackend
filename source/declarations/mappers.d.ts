declare type OnlyFunc<O extends object> = Pick<O, {
  [ K in keyof O ]: O[K] extends AnonymousFunction ? K : never
}[keyof O]>

declare type DropFirst<A extends Array<any>> = A extends [ any, ...infer Rest ]
  ? Rest
  : A;