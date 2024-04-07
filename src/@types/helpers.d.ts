type Prettify<T> = { [K in keyof T]: T[K] } & {};

type NotUndefined<T> = T extends undefined ? never : T;
