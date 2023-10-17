import { CancelablePromise } from "./types";

export function loadScriptTag(src: string) {
  let script: any;
  let canceled = false;
  let resolved = false;

  const scriptTagPromise: CancelablePromise<HTMLScriptElement> = new Promise(
    (resolve, reject) => {
      script = document.createElement('script');
      script.onload = () => {
        if (canceled) return;
        resolved = true;
        resolve(script);
      };
      script.onerror = () => {
        if (canceled) return;
        reject(new Error(`Failed to load script: ${JSON.stringify(src)}`));
      };
      script.src = src;
      document.body.appendChild(script);
    },
  ) as CancelablePromise<HTMLScriptElement>;

  scriptTagPromise.cancel = () => {
    if (resolved) return;
    script.src = '';
    canceled = true;
  };

  return scriptTagPromise;
}
