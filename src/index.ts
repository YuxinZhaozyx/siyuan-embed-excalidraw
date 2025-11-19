import {
  Dialog,
  Plugin,
  getFrontend,
  fetchPost,
  IWebSocketData,
  getAllEditor
} from "siyuan";
import "@/index.scss";
import PluginInfoString from '@/../plugin.json';
import { HTMLToElement } from "./utils";
import defaultImageContent from "@/../default.svg?raw";

let PluginInfo = {
  version: '',
}
try {
  PluginInfo = PluginInfoString
} catch (err) {
  console.log('Plugin info parse error: ', err)
}
const {
  version,
} = PluginInfo

const STORAGE_NAME = "config.json";

export default class ExcalidrawPlugin extends Plugin {
  // Run as mobile
  public isMobile: boolean
  // Run in browser
  public isBrowser: boolean
  // Run as local
  public isLocal: boolean
  // Run in Electron
  public isElectron: boolean
  // Run in window
  public isInWindow: boolean
  public platform: SyFrontendTypes
  public readonly version = version

  private _mutationObserver;
  private _openMenuImageHandler;
  private _globalKeyDownHandler;

  private settingItems: SettingItem[];

  async onload() {
    this.initMetaInfo();
    this.initSetting();

    this._mutationObserver = this.setAddImageBlockMuatationObserver(document.body, (blockElement: HTMLElement) => {
      if (this.data[STORAGE_NAME].labelDisplay === "noLabel") return;

      const imageElement = blockElement.querySelector("img") as HTMLImageElement;
      if (imageElement) {
        const imageURL = imageElement.getAttribute("data-src");
        this.getExcalidrawImageInfo(imageURL, false).then((imageInfo) => {
          this.updateAttrLabel(imageInfo, blockElement);
        });
      }
    });

    this.protyleSlash = [{
      filter: ["excalidraw"],
      id: "excalidraw",
      html: `<div class="b3-list-item__first"><svg class="b3-list-item__graphic"><use xlink:href="#iconImage"></use></svg><span class="b3-list-item__text">Excalidraw</span></div>`,
      callback: (protyle, nodeElement) => {
        this.newExcalidrawImage(nodeElement.dataset.nodeId, (imageInfo) => {
          this.openEditDialog(imageInfo);
        });
      },
    }];

    this._openMenuImageHandler = this.openMenuImageHandler.bind(this);
    this.eventBus.on("open-menu-image", this._openMenuImageHandler);

    this._globalKeyDownHandler = this.globalKeyDownHandler.bind(this);
    document.documentElement.addEventListener("keydown", this._globalKeyDownHandler);

    this.reloadAllEditor();
  }

  onunload() {
    if (this._mutationObserver) this._mutationObserver.disconnect();
    if (this._openMenuImageHandler) this.eventBus.off("open-menu-image", this._openMenuImageHandler);
    if (this._globalKeyDownHandler) document.documentElement.removeEventListener("keydown", this._globalKeyDownHandler);
    this.reloadAllEditor();
  }

  uninstall() {
    this.removeData(STORAGE_NAME);
    this.removeData("library.excalidrawlib");
  }

  openSetting() {
    const dialogHTML = `
<div class="b3-dialog__content"></div>
<div class="b3-dialog__action">
  <button class="b3-button b3-button--cancel" data-type="cancel">${window.siyuan.languages.cancel}</button>
  <div class="fn__space"></div>
  <button class="b3-button b3-button--text" data-type="confirm">${window.siyuan.languages.save}</button>
</div>
    `;

    const dialog = new Dialog({
      title: this.displayName,
      content: dialogHTML,
      width: this.isMobile ? "92vw" : "768px",
      height: "80vh",
      hideCloseIcon: this.isMobile,
    });

    // 配置的处理拷贝自思源源码
    const contentElement = dialog.element.querySelector(".b3-dialog__content");
    this.settingItems.forEach((item) => {
      let html = "";
      let actionElement = item.actionElement;
      if (!item.actionElement && item.createActionElement) {
        actionElement = item.createActionElement();
      }
      const tagName = actionElement?.classList.contains("b3-switch") ? "label" : "div";
      if (typeof item.direction === "undefined") {
        item.direction = (!actionElement || "TEXTAREA" === actionElement.tagName) ? "row" : "column";
      }
      if (item.direction === "row") {
        html = `<${tagName} class="b3-label">
    <div class="fn__block">
        ${item.title}
        ${item.description ? `<div class="b3-label__text">${item.description}</div>` : ""}
        <div class="fn__hr"></div>
    </div>
</${tagName}>`;
      } else {
        html = `<${tagName} class="fn__flex b3-label config__item">
    <div class="fn__flex-1">
        ${item.title}
        ${item.description ? `<div class="b3-label__text">${item.description}</div>` : ""}
    </div>
    <span class="fn__space${actionElement ? "" : " fn__none"}"></span>
</${tagName}>`;
      }
      contentElement.insertAdjacentHTML("beforeend", html);
      if (actionElement) {
        if (["INPUT", "TEXTAREA"].includes(actionElement.tagName)) {
          dialog.bindInput(actionElement as HTMLInputElement, () => {
            (dialog.element.querySelector(".b3-dialog__action [data-type='confirm']") as HTMLElement).dispatchEvent(new CustomEvent("click"));
          });
        }
        if (item.direction === "row") {
          contentElement.lastElementChild.lastElementChild.insertAdjacentElement("beforeend", actionElement);
          actionElement.classList.add("fn__block");
        } else {
          actionElement.classList.remove("fn__block");
          actionElement.classList.add("fn__flex-center", "fn__size200");
          contentElement.lastElementChild.insertAdjacentElement("beforeend", actionElement);
        }
      }
    });

    (dialog.element.querySelector(".b3-dialog__action [data-type='cancel']") as HTMLElement).addEventListener("click", () => {
      dialog.destroy();
    });
    (dialog.element.querySelector(".b3-dialog__action [data-type='confirm']") as HTMLElement).addEventListener("click", () => {
      this.data[STORAGE_NAME].labelDisplay = (dialog.element.querySelector("[data-type='labelDisplay']") as HTMLSelectElement).value;
      this.saveData(STORAGE_NAME, this.data[STORAGE_NAME]);
      this.reloadAllEditor();
      dialog.destroy();
    });
  }

  private async initSetting() {
    await this.loadData(STORAGE_NAME);
    if (!this.data[STORAGE_NAME]) {
      this.data[STORAGE_NAME] = {
        labelDisplay: "showLabelOnHover",
      };
    }

    this.settingItems = [
      {
        title: "标签显示",
        direction: "column",
        description: "图像块右上角的标签显示（修改后需刷新文档生效）",
        createActionElement: () => {
          const options = ["noLabel", "showLabelAlways", "showLabelOnHover"];
          const optionsHTML = options.map(option => {
            const isSelected = String(option) === String(this.data[STORAGE_NAME].labelDisplay);
            return `<option value="${option}"${isSelected ? " selected" : ""}>${this.i18n[option]}</option>`;
          }).join("");
          return HTMLToElement(`<select class="b3-select fn__flex-center" data-type="labelDisplay">${optionsHTML}</select>`);
        },
      },
    ];
  }

  private initMetaInfo() {
    const frontEnd = getFrontend();
    this.platform = frontEnd as SyFrontendTypes
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
    this.isBrowser = frontEnd.includes('browser');
    this.isLocal = location.href.includes('127.0.0.1') || location.href.includes('localhost');
    this.isInWindow = location.href.includes('window.html');

    try {
      require("@electron/remote")
        .require("@electron/remote/main");
      this.isElectron = true;
    } catch (err) {
      this.isElectron = false;
    }
  }

  public setAddImageBlockMuatationObserver(element: HTMLElement, callback: (blockElement: HTMLElement) => void): MutationObserver {
    const mutationObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const addedElement = node as HTMLElement;
              if (addedElement.matches("div[data-type='NodeParagraph']")) {
                if (addedElement.querySelector(".img[data-type='img'] img")) {
                  callback(addedElement as HTMLElement);
                }
              } else {
                addedElement.querySelectorAll("div[data-type='NodeParagraph']").forEach((blockElement: HTMLElement) => {
                  if (blockElement.querySelector(".img[data-type='img'] img")) {
                    callback(blockElement);
                  }
                })
              }
            }
          });
        }
      }
    });

    mutationObserver.observe(element, {
      childList: true,
      subtree: true
    });

    return mutationObserver;
  }

  public async getExcalidrawImageInfo(imageURL: string, reload: boolean): Promise<ExcalidrawImageInfo | null> {
    const imageURLRegex = /^assets\/.+\.svg$/;
    if (!imageURLRegex.test(imageURL)) return null;

    const svgContent = await this.getExcalidrawImage(imageURL, reload);
    if (!svgContent) return null;

    if (!svgContent.includes("svg-source:excalidraw")) return null;

    const imageInfo: ExcalidrawImageInfo = {
      imageURL: imageURL,
      data: svgContent,
    }
    return imageInfo;
  }

  public getPlaceholderImageContent(): string {
    let imageContent = defaultImageContent;
    imageContent = imageContent + `\n<!-- updated="${new Date().toISOString()}" -->`;
    return imageContent;
  }

  public newExcalidrawImage(blockID: string, callback?: (imageInfo: ExcalidrawImageInfo) => void) {
    const imageName = 'excalidraw-image.svg';
    const placeholderImageContent = this.getPlaceholderImageContent();
    const blob = new Blob([placeholderImageContent], { type: 'image/svg+xml' });
    const file = new File([blob], imageName, { type: 'image/svg+xml' });
    const formData = new FormData();
    formData.append('file[]', file);
    fetchPost('/api/asset/upload', formData, (response) => {
      const imageURL = response.data.succMap[imageName];
      fetchPost('/api/block/updateBlock', {
        id: blockID,
        data: `![](${imageURL})`,
        dataType: "markdown",
      });
      const imageInfo: ExcalidrawImageInfo = {
        imageURL: imageURL,
        data: placeholderImageContent,
      };
      if (callback) {
        callback(imageInfo);
      }
    });
  }

  public async getExcalidrawImage(imageURL: string, reload: boolean): Promise<string> {
    const response = await fetch(imageURL, { cache: reload ? 'reload' : 'default' });
    if (!response.ok) return "";
    const svgContent = await response.text();
    return svgContent;
  }

  public updateExcalidrawImage(imageInfo: ExcalidrawImageInfo, callback?: (response: IWebSocketData) => void) {
    if (!imageInfo.data) {
      imageInfo.data = this.getPlaceholderImageContent();
    }
    const blob = new Blob([imageInfo.data], { type: 'image/svg+xml' });
    const file = new File([blob], imageInfo.imageURL.split('/').pop(), { type: 'image/svg+xml' });
    const formData = new FormData();
    formData.append("path", 'data/' + imageInfo.imageURL);
    formData.append("file", file);
    formData.append("isDir", "false");
    fetchPost("/api/file/putFile", formData, callback);
  }

  public updateAttrLabel(imageInfo: ExcalidrawImageInfo, blockElement: HTMLElement) {
    if (!imageInfo) return;

    if (this.data[STORAGE_NAME].labelDisplay === "noLabel") return;

    const attrElement = blockElement.querySelector(".protyle-attr") as HTMLDivElement;
    if (attrElement) {
      const labelHTML = `<span>Excalidraw</span>`;
      let labelElement = attrElement.querySelector(".label--embed-excalidraw") as HTMLDivElement;
      if (labelElement) {
        labelElement.innerHTML = labelHTML;
      } else {
        labelElement = document.createElement("div");
        labelElement.classList.add("label--embed-excalidraw");
        if (this.data[STORAGE_NAME].labelDisplay === "showLabelAlways") {
          labelElement.classList.add("label--embed-excalidraw--always");
        }
        labelElement.innerHTML = labelHTML;
        attrElement.prepend(labelElement);
      }
    }
  }

  private openMenuImageHandler({ detail }) {
    const selectedElement = detail.element;
    const imageElement = selectedElement.querySelector("img") as HTMLImageElement;
    const imageURL = imageElement.dataset.src;
    this.getExcalidrawImageInfo(imageURL, true).then((imageInfo: ExcalidrawImageInfo) => {
      if (imageInfo) {
        window.siyuan.menus.menu.addItem({
          id: "edit-excalidraw",
          icon: 'iconEdit',
          label: `${this.i18n.editExcalidraw}`,
          index: 1,
          click: () => {
            this.openEditDialog(imageInfo);
          }
        });
      }
    })
  }

  private globalKeyDownHandler = (event: KeyboardEvent) => {
    // 如果是在代码编辑器里使用快捷键，则阻止冒泡 https://github.com/YuxinZhaozyx/siyuan-embed-tikz/issues/1
    if (document.activeElement.closest(".b3-dialog--open .excalidraw-edit-dialog")) {
      event.stopPropagation();
    }
  };

  public openEditDialog(imageInfo: ExcalidrawImageInfo) {
    const editDialogHTML = `
<div class="excalidraw-edit-dialog">
    <div class="edit-dialog-header resize__move"></div>
    <div class="edit-dialog-container">
        <div class="edit-dialog-editor">
            <iframe src="/plugins/siyuan-embed-excalidraw/app/?lang=${window.siyuan.config.lang.replace('_', '-')}"></iframe>
        </div>
        <div class="fn__hr--b"></div>
    </div>
</div>
    `;

    const dialogDestroyCallbacks = [];

    const dialog = new Dialog({
      content: editDialogHTML,
      width: this.isMobile ? "92vw" : "90vw",
      height: "80vh",
      hideCloseIcon: this.isMobile,
      destroyCallback: () => {
        dialogDestroyCallbacks.forEach(callback => callback());
      },
    });

    const iframe = dialog.element.querySelector("iframe") as HTMLIFrameElement;
    iframe.focus();

    const postMessage = (message: any) => {
      if (!iframe.contentWindow) return;
      iframe.contentWindow.postMessage(JSON.stringify(message), '*');
    };

    const onInit = (message: any) => {
      postMessage({
        action: "load",
        data: imageInfo.data,
      });
    }

    const onSave = (message: any) => {
      imageInfo.data = message.data;
      this.updateExcalidrawImage(imageInfo, () => {
        fetch(imageInfo.imageURL, { cache: 'reload' }).then(() => {
          document.querySelectorAll(`img[data-src='${imageInfo.imageURL}']`).forEach(imageElement => {
            (imageElement as HTMLImageElement).src = imageInfo.imageURL;
          });
        });
      });
    }

    const onBrowseLibrary = (message: any) => {
      dialog.destroy();
    };

    const messageEventHandler = (event) => {
      if (event.data && event.data.length > 0) {
        try {
          var message = JSON.parse(event.data);
          if (message != null) {
            // console.log(message.event);
            if (message.event == "init") {
              onInit(message);
            }
            else if (message.event == "autosave") {
              onSave(message);
            }
            else if (message.event == "browseLibrary") {
              onBrowseLibrary(message);
            }
          }
        }
        catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener("message", messageEventHandler);
    dialogDestroyCallbacks.push(() => {
      window.removeEventListener("message", messageEventHandler);
    });
  }

  public reloadAllEditor() {
    getAllEditor().forEach((protyle) => { protyle.reload(false); });
  }

}
