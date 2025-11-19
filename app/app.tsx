import { debounce } from 'lodash';
import { createRoot } from 'react-dom/client';
import React from 'react';
import {
  Excalidraw,
  loadFromBlob,
  exportToSvg,
  parseLibraryTokensFromUrl,
  loadLibraryFromBlob,
  mergeLibraryItems,
  serializeLibraryAsJSON,
} from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

window.EXCALIDRAW_ASSET_PATH = '/plugins/siyuan-embed-excalidraw/app/';
window.EXCALIDRAW_LIBRARY_PATH = '/data/storage/petal/siyuan-embed-excalidraw/library.excalidrawlib';
const urlParams = new URLSearchParams(window.location.search);
let excalidrawAPI: any;

const postMessage = (message: any) => {
  window.parent.postMessage(JSON.stringify(message), '*');
};

const App = (props: { initialData: any }) => {
  // 300ms内没有修改才保存
  const debouncedSave = React.useCallback(
    debounce(async () => {
      const svg = await exportToSvg({
        elements: excalidrawAPI.getSceneElements(),
        appState: {
          ...excalidrawAPI.getAppState(),
          exportWithDarkMode: false,
          exportEmbedScene: true,
          exportBackground: false,
        },
        files: excalidrawAPI.getFiles(),
      });
      postMessage({
        event: 'autosave',
        data: svg.outerHTML,
      });
    }, 300),
    []
  );

  let changeInitStatus = true;
  const handleChange = async (elements: readonly any[], state: any) => {
    if (changeInitStatus) {
      // 忽略初始化导致的第一次变化
      changeInitStatus = false;
      return;
    }
    if (!excalidrawAPI) return;
    debouncedSave();
  };

  let libraryChangeInitStatus = true;
  const handleLibraryChange = async (libraryItems: any) => {
    if (libraryChangeInitStatus) {
      // 忽略初始化导致的第一次变化
      libraryChangeInitStatus = false;
      return;
    }
    await saveLibrary(libraryItems);
  };

  const setExcalidrawAPI = (api: any) => {
    excalidrawAPI = api;    
  };

  return (
    <Excalidraw
      initialData={props.initialData}
      langCode={urlParams.get('lang') || 'en'}
      onChange={handleChange}
      onLibraryChange={handleLibraryChange}
      excalidrawAPI={setExcalidrawAPI}
      UIOptions={{
        canvasActions: {
          loadScene: false,
          saveToActiveFile: false,
        },
      }}
    />
  );
};

const onLoad = async (message: any) => {
  const blob = new Blob([message.data], { type: 'image/svg+xml' });
  const contents = await loadFromBlob(blob, null, null);
  createRoot(document.getElementById('root')!).render(React.createElement(App, {
    initialData: {
      elements: contents.elements,
      appState: contents.appState,
      files: contents.files,
      scrollToContent: true,
      libraryItems: await loadLibary(),
    },
  }));
};

const messageHandler = (event: MessageEvent) => {
  if (event.data && event.data.length > 0) {
    try {
      var message = JSON.parse(event.data);
      if (message != null) {
        if (message.action == "load") {
          onLoad(message);
        }
      }
    }
    catch (err) {
      console.error(err);
    }
  }
}

const loadLibary = async () => {
  const response = await fetch('/api/file/getFile', {
    method: 'POST',
    body: JSON.stringify({
      path: window.EXCALIDRAW_LIBRARY_PATH,
    }),
  });
  let libraryItems: any = [];
  try {
    const blob = await response.blob();
    libraryItems = await loadLibraryFromBlob(blob);
  } catch (error) {}
  return libraryItems;
}

const saveLibrary = async (libraryItems: any) => {
  const newLibraryData = serializeLibraryAsJSON(libraryItems);
  const file = new File([newLibraryData], 'library.excalidraw', { type: 'application/json' });
  const formData = new FormData();
  formData.append('path', window.EXCALIDRAW_LIBRARY_PATH);
  formData.append('file', file);
  formData.append('isDir', 'false');
  await fetch('/api/file/putFile', {
    method: 'POST',
    body: formData,
  });
}

const addLibrary = async (libraryUrlTokens: { libraryUrl: string, idToken: string | null }) => {
  let ok = true;
  try {
    const libraryUrl = decodeURIComponent(libraryUrlTokens.libraryUrl);
    let request = await fetch(libraryUrl);
    let blob = await request.blob();
    const addedLibraryItems = await loadLibraryFromBlob(blob, "published");
    const localLibraryItems = await loadLibary();
    const mergedLibraryItems = mergeLibraryItems(localLibraryItems, addedLibraryItems);
    await saveLibrary(mergedLibraryItems);
    console.log('add library success');
  } catch (error) {
    ok = false;
    console.error(error);
    console.log('add library fail');
  }
  document.getElementById('root')!.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100vh;">${ok ? 'Add Library Success' : 'Add Library Fail'}</div>`;
}

const setupMutationObserver = () => {
  const mutationObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const addedElement = node as HTMLElement;
            addedElement.querySelectorAll(".library-menu-browse-button").forEach(element => {
              element.addEventListener('click', () => {
                postMessage({ event: 'browseLibrary' });
              });
            });
          }
        });
      }
    }
  });

  mutationObserver.observe(document, {
    childList: true,
    subtree: true
  });
}

const libraryUrlTokens = parseLibraryTokensFromUrl();
if (libraryUrlTokens) {
  addLibrary(libraryUrlTokens);
} else {
  window.addEventListener('message', messageHandler);
  postMessage({ event: 'init' });
  setupMutationObserver();
}