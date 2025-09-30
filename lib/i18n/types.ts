// Shared types for i18n system
// Can be imported by both server and client components

export interface Dictionary {
  common: {
    nav: {
      tools: string;
      blog: string;
      about: string;
      categories: string;
      lab: string;
      allTools: string;
      viewAllTools: string;
    };
    actions: {
      copy: string;
      download: string;
      clear: string;
      process: string;
      upload: string;
      paste: string;
      reset: string;
      share: string;
      save: string;
      load: string;
      export: string;
      import: string;
      format: string;
      validate: string;
      minify: string;
      beautify: string;
      encode: string;
      decode: string;
      encrypt: string;
      decrypt: string;
      generate: string;
      convert: string;
      analyze: string;
      compare: string;
    };
    messages: {
      success: string;
      error: string;
      copied: string;
      processing: string;
      noData: string;
      invalid: string;
      valid: string;
      loading: string;
      saved: string;
      deleted: string;
      updated: string;
      created: string;
      failed: string;
      warning: string;
      info: string;
    };
    labels: {
      input: string;
      output: string;
      options: string;
      settings: string;
      result: string;
      preview: string;
      source: string;
      target: string;
      from: string;
      to: string;
      file: string;
      text: string;
      code: string;
      data: string;
      format: string;
      type: string;
      mode: string;
      language: string;
      charset: string;
      encoding: string;
      tool: string;
      tools: string;
    };
    units: {
      bytes: string;
      kb: string;
      mb: string;
      gb: string;
      ms: string;
      seconds: string;
      minutes: string;
      hours: string;
      days: string;
      characters: string;
      words: string;
      lines: string;
    };
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    features: {
      title: string;
      fast: {
        title: string;
        description: string;
      };
      secure: {
        title: string;
        description: string;
      };
      free: {
        title: string;
        description: string;
      };
    };
    categories: {
      title: string;
      viewAll: string;
    };
    popular: {
      title: string;
      subtitle: string;
    };
    whyToolsLab: {
      title: string;
      subtitle: string;
      footer: string;
      benefits: {
        instantProcessing: {
          title: string;
          description: string;
        };
        zeroDataStorage: {
          title: string;
          description: string;
        };
        chainTools: {
          title: string;
          description: string;
        };
        darkMode: {
          title: string;
          description: string;
        };
        worksEverywhere: {
          title: string;
          description: string;
        };
        noSignup: {
          title: string;
          description: string;
        };
      };
    };
  };
  tools: Record<
    string,
    {
      title: string;
      description: string;
      placeholder?: string;
      instructions?: string;
      features?: string[];
      meta: {
        title: string;
        description: string;
      };
      labels?: Record<string, string>;
      messages?: Record<string, string>;
      options?: Record<string, string>;
    }
  >;
  categories: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
  footer: {
    about: string;
    privacy: string;
    terms: string;
    contact: string;
    copyright: string;
    madeWith: string;
  };
  seo: {
    suffix: string;
    defaultDescription: string;
  };
}
