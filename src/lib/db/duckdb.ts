"use client";

import * as duckdb from "@duckdb/duckdb-wasm";

let db: duckdb.AsyncDuckDB | null = null;
let initializing: Promise<duckdb.AsyncDuckDB> | null = null;

export async function getDuckDb(): Promise<duckdb.AsyncDuckDB> {
  if (db) return db;
  if (initializing) return initializing;

  initializing = (async () => {
    const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

    const worker_url = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker!}");`], {
        type: "text/javascript",
      })
    );

    const worker = new Worker(worker_url);
    const logger = new duckdb.ConsoleLogger();
    const instance = new duckdb.AsyncDuckDB(logger, worker);
    await instance.instantiate(bundle.mainModule, bundle.pthreadWorker);

    URL.revokeObjectURL(worker_url);
    db = instance;
    return instance;
  })();

  return initializing;
}
