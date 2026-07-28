export const copyTextToClipboard = (str: string) => {
  // Note: navigator.clipboard works only secure contexts, i.e. when using https.
  // This will not work when developing locally with http
  try {
    navigator.clipboard.writeText(str).catch(() => {});
    return true;
  } catch {
    return false;
  }
};
