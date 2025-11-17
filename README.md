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
- [x] Save Excalidraw image as SVG format
- [x] Edit Excalidraw image
- [x] Support export to PDF
- [x] Support for mobile devices
- [x] Support dark mode
- [ ] Support SiYuan block in Excalidraw

> If you have additional feature requests or suggestions, feel free to [open an issue on GitHub](https://github.com/YuxinZhaozyx/siyuan-embed-excalidraw/issues) or [post in the SiYuan community](https://ld246.com/tag/siyuan) to request support for additional packages.

## Effects on PC

![preview.png](https://b3logfile.com/file/2025/11/preview-7d3AmQw.png)

## Effects on Mobile

![image.png](https://b3logfile.com/file/2025/11/image-TiiCPFg.png)


## Usage Guide

**Create an Excalidraw Image:**

Type `/excalidraw` in the editor to create a new Excalidraw image.

**Edit a Excalidraw Image:**

Click the menu button in the top-right corner of the image. If the block is recognized as a valid Excalidraw image, an `Edit Excalidraw` option will appear. Click it to open the editor.

**Excalidraw Image Block Label:**

The label of an Excalidraw image block can be configured in the plugin settings.

**Migrating from other sources:**

+ Method 1: Simply export your diagram as an SVG from any Excalidraw platform with the "Embed scene" option enabled, then drag the resulting SVG file into SiYuan.
+ Method 2: Copy all content from any Excalidraw platform, type `/excalidraw` in the editor, and paste the copied content into the pop-up Excalidraw window.


## Changelog

+ v0.1.1
    + Optimize: reload all editors when confirming settings change
+ v0.1.0
    + Feature: save Excalidraw image as SVG format
    + Feature: edit Excalidraw image