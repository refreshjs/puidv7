export declare function puidv7drizzle(prefix: string): {
  (): import("drizzle-orm/pg-core").PgCustomColumnBuilder<
    import("drizzle-orm/pg-core").ConvertCustomConfig<
      "",
      {
        data: string;
        driverData: string;
        notNull: true;
      }
    >
  >;
  <TConfig extends Record<string, any>>(
    fieldConfig?: TConfig | undefined,
  ): import("drizzle-orm/pg-core").PgCustomColumnBuilder<
    import("drizzle-orm/pg-core").ConvertCustomConfig<
      "",
      {
        data: string;
        driverData: string;
        notNull: true;
      }
    >
  >;
  <TName extends string>(
    dbName: TName,
    fieldConfig?: unknown,
  ): import("drizzle-orm/pg-core").PgCustomColumnBuilder<
    import("drizzle-orm/pg-core").ConvertCustomConfig<
      TName,
      {
        data: string;
        driverData: string;
        notNull: true;
      }
    >
  >;
};
