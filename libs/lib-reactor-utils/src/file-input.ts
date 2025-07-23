export enum MimeTypes {
  A_JSON = 'application/json',
  T_JSON = 'text/json',
  VSIX = 'application/vsix'
}

export interface FileSelectionParams {
  mimeTypes?: string[];
  single?: boolean;
}

export const selectFiles = (options: FileSelectionParams = {}): Promise<File[]> => {
  const element = document.createElement('input');
  element.setAttribute('type', 'file');
  element.setAttribute('name', 'file');
  if (!options.single) {
    element.setAttribute('multiple', 'multiple');
  }
  if (options.mimeTypes) {
    element.setAttribute('accept', options.mimeTypes.join(','));
  }
  return new Promise<File[]>((resolve, reject) => {
    element.onchange = (event) => {
      // user selected something
      if (element.files) {
        const files = [];
        for (let i = 0; i < element.files.length; i++) {
          files.push(element.files.item(i));
        }
        resolve(files);
      } else {
        resolve([]);
      }
    };

    element.style.display = 'none';
    document.body.querySelector('#application').appendChild(element);
    setTimeout(() => {
      element.click();
    }, 0);
  }).finally(() => {
    element.remove();
  });
};

export const selectFile = async (options: FileSelectionParams = {}): Promise<File | null> => {
  const files = await selectFiles({
    ...options,
    single: true
  });
  return files[0] || null;
};

export const saveFile = (content: BlobPart, fileName: string) => {
  const element = document.createElement('a');
  element.setAttribute('download', fileName);
  const blob = new Blob([content]);
  const url = URL.createObjectURL(blob);
  element.setAttribute('href', url);
  element.click();
  URL.revokeObjectURL(url);
  element.remove();
};

export const readFileAsText = (file: File): Promise<string | null> => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) => {
      const textFromFileLoaded: string = fileLoadedEvent.target.result as string;
      if (textFromFileLoaded) {
        return resolve(textFromFileLoaded);
      } else {
        resolve(null);
      }
    };
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onerror = (error) => reject(error);
  });
};

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (error) => reject(error);
  });
};
