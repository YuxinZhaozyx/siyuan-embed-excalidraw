<p align="center">
<img alt="Excalidraw" src="./icon.png" width="160px">
<br>

<p align="center">
    <strong>思源插件「嵌入式系列」</strong>
    <br>
    使用Excalidraw在思源笔记中直接绘制高质量矢量图。
    <br>
    无需外部依赖 · 自由编辑 · 自由分享
</p>

<p align="center">
    <a href="https://github.com/YuxinZhaozyx/siyuan-embed-excalidraw/blob/main/README_zh_CN.md">中文</a> | <a href="https://github.com/YuxinZhaozyx/siyuan-embed-excalidraw/blob/main/README.md">English</a>
</p>

---

## 嵌入式系列

本插件为第四个「嵌入式系列」插件，旨在为思源笔记提供更加完善且自由的Excalidraw使用体验。

**嵌入式系列插件的宗旨**：仅作为思源笔记的辅助编辑插件，将所有信息嵌入思源笔记和markdown所支持的数据格式中，使得插件所创造的所有内容在脱离插件甚至脱离思源笔记（导出为markdown/分享到第三方平台）后仍然可以正常显示。

## PC端使用效果

![preview.png](https://b3logfile.com/file/2025/11/preview-7d3AmQw.png)

## 移动端使用效果

![image.png](https://b3logfile.com/file/2025/11/image-TiiCPFg.png)

## 功能

- [x] 无网络离线使用
- [x] Excalidraw图像以SVG/PNG格式存储
- [x] Excalidraw图像可编辑
- [x] 支持导出PDF
- [x] 支持移动端编辑
- [x] 图像支持暗黑模式
- [x] 全屏编辑
- [x] 明暗模式
- [x] Tab/Dialog窗口编辑
- [ ] 支持Excalidraw中显示思源文档内容

> 如有更多需求/建议欢迎[在GitHub仓库中提issue](https://github.com/YuxinZhaozyx/siyuan-embed-excalidraw/issues)或[在思源笔记社区中发帖](https://ld246.com/article/1763408501738)

## 使用指南

**设置Excalidraw图像存储格式：** 在插件设置中修改Excalidraw图像存储格式（只影响新创建的图像），可以选择 SVG/PNG。

**创建Excalidraw图像：** 在编辑器中输入 `/excalidraw` 命令即可创建新Excalidraw图像。

**编辑Excalidraw图像：** 右键/点击图像右上角的菜单按钮，当图像被识别为合法的Excalidraw图像时，菜单中会显示 `编辑Excalidraw` 的选项，点击即可打开编辑窗口。

**Excalidraw图像块标签：** 可在插件设置中修改Excalidraw图像块的标签显示模式。

**从其他来源迁移：** 

+ 方案1：只需要在任意Excalidraw平台导出SVG/PNG图像时勾选 `包含画布数据` 选项，再把SVG图像拖入思源笔记中即可，不用担心以后没法再迁移，这个SVG/PNG图像也是可以导入到任意Excalidraw平台再次编辑的。
+ 方案2：在任意Excalidraw平台内复制全部内容，在思源笔记中输入 `/excalidraw` 命令创建新Excalidraw图像，然后将复制的内容粘贴进弹出Excalidraw窗口中即可。

## 更新日志

+ v0.3.0
    + 新增功能：支持设置Dialog/Tab窗口编辑
    + 新增功能：支持设置明暗主题
+ v0.2.0
    + 新增功能：在配置中选择以SVG还是PNG存储图像
    + 新增功能：全屏编辑
    + 优化：简化菜单
+ v0.1.2
    + 优化：素材库的在线导入
+ v0.1.1
    + 优化：修改配置后重载编辑器
+ v0.1.0
    + 新增功能：Excalidraw图像以SVG格式存储
    + 新增功能：Excalidraw图像可编辑

