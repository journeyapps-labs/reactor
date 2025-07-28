// !----------- MODULE ----------

export interface ReactorModulePWAConfig {
  serviceWorker: string;
  manifest: string;
  other: { [key: string]: string };
}

export interface ReactorModuleConfig {
  name: string;
  slug: string;
  env: string[];
  loader?: {
    fragment: string;
    backgroundColor: string;
  };
  pwa?: ReactorModulePWAConfig;
}
