// !----------- MODULE ----------

export interface ReactorModuleConfig {
  name: string;
  slug: string;
  env: string[];
  loader?: {
    fragment: string;
    backgroundColor: string;
  };
}
