import { debounce } from 'lodash';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { Excalidraw, loadFromBlob, exportToSvg } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

window.EXCALIDRAW_ASSET_PATH = '/plugins/siyuan-embed-excalidraw/app/';
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

  const handleChange = async (elements: readonly any[], state: any) => {
    if (!excalidrawAPI) return;
    debouncedSave();
  };

  const setExcalidrawAPI = (api: any) => {
    excalidrawAPI = api;    
  };

  return (
    <Excalidraw
      initialData={props.initialData}
      langCode={urlParams.get('lang') || 'en'}
      onChange={handleChange}
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

window.addEventListener('message', messageHandler);
postMessage({ event: 'init' });