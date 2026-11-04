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

> 重要提示：为提升文档加载速度，本插件只识别以 `excalidraw-` 开头的图片，如果您发现原有的Excalidraw图片不显示编辑按钮，请重命名图片为 `excalidraw-` 开头的文件名。

> 「嵌入式系列」思源插件QQ交流群：1037356690
>
> 赞助: https://yuxinzhao.net/sponsor

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
- [x] 自定义代码片段
- [x] 支持Excalidraw中显示思源文档内容
- [x] Markdown (包括LaTeX公式、代码块、mermaid、graphviz、flowchart)

> 如有更多需求/建议欢迎[在GitHub仓库中提issue](https://github.com/YuxinZhaozyx/siyuan-embed-excalidraw/issues)或[在思源笔记社区中发帖](https://ld246.com/article/1763408501738)

## 使用指南

**设置Excalidraw图像存储格式：** 在插件设置中修改Excalidraw图像存储格式（只影响新创建的图像），可以选择 SVG/PNG。

**创建Excalidraw图像：** 在编辑器中输入 `/excalidraw` 命令即可创建新Excalidraw图像。

**编辑Excalidraw图像：** 右键/点击图像右上角的菜单按钮，当图像被识别为合法的Excalidraw图像时，菜单中会显示 `编辑Excalidraw` 的选项，点击即可打开编辑窗口。

**Excalidraw图像块标签：** 可在插件设置中修改Excalidraw图像块的标签显示模式。

**Excalidraw代码片段：** 在思源笔记的代码片段中创建CSS/JS代码片段（不必启用），然后在本插件设置中选择其中在Excalidraw中开启的代码片段，实现自定义的功能与样式。可也在[思源社区Excalidraw代码片段集市](https://ld246.com/article/1764004088153)中获取所需代码片段。

**嵌入思源内容：**

+ 方案1：按住思源块左侧按钮/文档树中的文档，拖拽到Excalidraw中，即可将思源内容嵌入到Excalidraw中。
+ 方案2：点击思源文档/思源块左侧按钮，点击 `复制 - 复制块超链接`，得到以 `siyuan://blocks/` 开头的超链接，在Excalidraw中点击 `嵌入网页`, 输入该超链接，即可将思源内容嵌入到Excalidraw中。

**从其他来源迁移：** 

+ 方案1：只需要在任意Excalidraw平台导出SVG/PNG图像时勾选 `包含画布数据` 选项，再把SVG图像拖入思源笔记中即可，不用担心以后没法再迁移，这个SVG/PNG图像也是可以导入到任意Excalidraw平台再次编辑的。
+ 方案2：在任意Excalidraw平台内复制全部内容，在思源笔记中输入 `/excalidraw` 命令创建新Excalidraw图像，然后将复制的内容粘贴进弹出Excalidraw窗口中即可。

<details>
<summary>如果你觉得有用，欢迎请我喝杯咖啡☕</summary>
<img src="https://b3logfile.com/file/2025/11/406da93ac6582784bc3e2863323d926a-OpXNyUO.jpg" width="400px">
</details> 

## 更新日志

+ v1.1.0
    + 新增功能：更新Excalidraw至0.18.0-4ce8305，支持箭头吸附、拖拽绘制形状、填充颜色、快捷键绘制流程图
+ v1.0.4
    + 优化：增加全屏切换快捷键
+ v1.0.3
    + 优化：允许将完全保存时间间隔调低至5秒内
+ v1.0.2
    + 新增功能：支持将思源块/文档拖入Excalidraw中
+ v1.0.1
    + 修复：图片存储于assets目录的子目录下不显示编辑按钮
    + 修复：非localhost环境无法进入excalidraw界面
+ v1.0.0
    + 新增功能：Markdown
    + 优化：重制思源块嵌入功能
    + 优化：重构保存机制，大幅提升嵌入思源块/Markdown情况下的流畅度
+ v0.8.0
    + 新增功能：可设置是否启动自动保存和自动保存时间间隔
+ v0.7.8
    + 优化：只有命名以 `excalidraw-` 开头的图片才会显示编辑按钮和标签以优化文档加载速度
+ v0.7.7
    + 新增功能：快捷键创建Excalidraw图像
+ v0.7.6
    + 修复：思源黑暗模式下与Excalidraw内黑暗模式下的颜色不一致
+ v0.7.5
    + 修复：图片右上角编辑按钮只能修改一次
+ v0.7.4
    + 修复：设置不显示标签时图片右上角编辑按钮也不显示
+ v0.7.3
    + 修复：所有图片右上角都被加上编辑按钮
+ v0.7.2
    + 新增功能：图片右上角编辑按钮
+ v0.7.1
    + 增加QQ交流群
+ v0.7.0
    + 新增功能：思源块链接支持弹出悬浮窗
+ v0.6.0
    + 新增功能：思源块&非跨域iframe可渲染为图片
+ v0.5.1
    + 修复：避免嵌入思源块时显示插件引入的内容
+ v0.5.0
    + 新增功能：嵌入网页支持思源超链接（嵌入思源块）
    + 新增功能：链接对象支持思源超链接
    + 修复：跳转到正常网页失败
+ v0.4.6
    + 新增功能：嵌入网页允许滚动条
+ v0.4.5
    + 修复：输入`/excalidraw`太快时文本覆盖图片
+ v0.4.4
    + 修复：MacOS端点击打开无响应
    + 优化：信息弹窗样式
+ v0.4.3
    + 修复：打开已有excalidraw文件
+ v0.4.2
    + 新增功能：打开已有excalidraw文件
+ v0.4.1
    + 修复：嵌入网页
+ v0.4.0
    + 新增功能：支持自定义代码片段 (JS/CSS)
+ v0.3.6
    + 新增功能：页签切换快捷键
    + 修复：网页中保存触发网页保存
+ v0.3.5
    + 修复缺陷：快捷键
+ v0.3.4
    + 新增功能：Tab支持快捷键全屏
    + 新增功能：支持快捷键手动保存且手动保存有保存完成信息提示
+ v0.3.3
    + 修复缺陷：内容过多时无法保存
+ v0.3.2
    + 优化：SVG/PNG占位图像的编辑界面为空
+ v0.3.1
    + 新增功能：以SVG为存储格式时创建的图像编辑界面为空
    + 新增功能：Excalidraw菜单增加保存按钮
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

