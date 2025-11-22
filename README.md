<p align="center">
<img alt="Excalidraw" src="./icon.png" width="160px">
<br>

<p align="center">
    <strong>SiYuan Plugin「Embed Series」</strong>
    <br>
    Draw high-quality vector graphics directly in SiYuan using Excalidraw.
    <br>
    No external dependencies · Full editability · Free to share
</p>

<p align="center">
    <a href="https://github.com/YuxinZhaozyx/siyuan-embed-excalidraw/blob/main/README_zh_CN.md">中文</a> | <a href="https://github.com/YuxinZhaozyx/siyuan-embed-excalidraw/blob/main/README.md">English</a>
</p>

---

## Embed Series

This plugin serves as the fourth plugin in the **Embed Series**, aiming to provide a more complete and flexible Excalidraw experience within SiYuan.

**The principle of Embed Series plugins**: They are designed solely as auxiliary editing tools for SiYuan, embedding all information directly into formats supported by SiYuan and Markdown. This ensures that all content created by the plugin remains fully visible and functional even after being separated from the plugin — or even from SiYuan itself — such as when exporting to Markdown or sharing on third-party platforms.

## Features

- [x] Offline usage (no internet required)
- [x] Save Excalidraw image as SVG/PNG format
- [x] Edit Excalidraw image
- [x] Support export to PDF
- [x] Support for mobile devices
- [x] Support dark mode for image display
- [x] Fullscreen edit
- [x] Light/Dark mode
- [x] Edit in Tab/Dialog
- [ ] Support SiYuan block in Excalidraw

> If you have additional feature requests or suggestions, feel free to [open an issue on GitHub](https://github.com/YuxinZhaozyx/siyuan-embed-excalidraw/issues) or [post in the SiYuan community](https://ld246.com/article/1763408501738) to request support for additional packages.

## Effects on PC

![preview.png](https://b3logfile.com/file/2025/11/preview-7d3AmQw.png)

## Effects on Mobile

![image.png](https://b3logfile.com/file/2025/11/image-TiiCPFg.png)


## Usage Guide

**Set Excalidraw image storage format:**

In the plugin settings, modify the Excalidraw image storage format (only affects newly created images). You can choose SVG/PNG.

**Create an Excalidraw Image:**

Type `/excalidraw` in the editor to create a new Excalidraw image.

**Edit a Excalidraw Image:**

Click the menu button in the top-right corner of the image. If the block is recognized as a valid Excalidraw image, an `Edit Excalidraw` option will appear. Click it to open the editor.

**Excalidraw Image Block Label:**

The label of an Excalidraw image block can be configured in the plugin settings.

**Migrating from other sources:**

+ Method 1: Simply export your diagram as an SVG/PNG from any Excalidraw platform with the "Embed scene" option enabled, then drag the resulting SVG/PNG file into SiYuan.
+ Method 2: Copy all content from any Excalidraw platform, type `/excalidraw` in the editor, and paste the copied content into the pop-up Excalidraw window.


## Changelog

+ v0.3.1
    + Feature: placeholder SVG image
    + Feature: save button in Excalidraw menu
+ v0.3.0
    + Feature: configuration of edit window: Tab / Dialog
    + Feature: configuration of theme: Light / Dark
+ v0.2.0
    + Feature: select SVG or PNG storage for Excalidraw image
    + Feature: fullscreen edit
    + Optimize: simplify the menu
+ v0.1.2
    + Optimize: import library
+ v0.1.1
    + Optimize: reload all editors when confirming settings change
+ v0.1.0
    + Feature: save Excalidraw image as SVG format
    + Feature: edit Excalidraw image