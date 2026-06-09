/// <reference types="vite/client" />

declare module "juice/client" {
  type JuiceOptions = {
    preserveMediaQueries?: boolean;
    removeStyleTags?: boolean;
  };

  export default function juice(html: string, options?: JuiceOptions): string;
}
