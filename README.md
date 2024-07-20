# RAD2-i18n

注意，此汉化为无授权汉化，不可用于商业用途。  
这篇教程会教你如何向RAD2汉化进行贡献。  
项目对应RAD2版本：v1.11

**敬告：**  
相当大部分汉化内容来自于[https://www.bilibili.com/read/cv21811913/](https://www.bilibili.com/read/cv21811913/)，请尊重原汉化作者。  
本项目翻译预览请见[https://mortarhq.github.io/rad2-i18n/](https://mortarhq.github.io/rad2-i18n/)。

## 使用的IDE

首先，需要你下载[VSCode](https://code.visualstudio.com/)，你可以选择下载user版本与system版本，推荐下载user版本。

## 推荐的插件配置

在完成[使用的IDE](#使用的ide)后，你需要安装[i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)插件来方便进行对比。

## 安装项目

首先，你的电脑需要具有node.js环境，你可以到[官网](https://nodejs.org/en)进行下载安装。
这边推荐使用第三方node管理工具来安装node.js，你可以在node.js官网找到推荐的[三方管理工具](https://nodejs.org/en/download/package-manager)，个人推荐使用[nvs](https://nodejs.org/en/download/package-manager/all#nvs)。

在你完成node环境安装后，你需要使用vscode创建并打开一个文件夹，然后输入

```sh
# 克隆项目文件
git clone https://github.com/landminehq/rad2-i18n.git
```

```sh
# 进入项目文件
cd rad2-i18n
```

```sh
# 安装软件包
npm install
```

此时已经完成了项目的安装，当然实际上你并不需要安装node.js和插件等任何环境。  
这里仅提供一种可行的方式，主要是借助vue的生态环境来快速进行本地化操作。

## 项目的几种启动模式

你可以选择一下的三种模式进行开发

+ **[翻译模式]**  

    ***翻译模式*** 能够以最高的效率运行并进行汉化翻译，如果你是为了贡献本地化，请选择此模式。

    ```sh
    # 编译并运行 翻译模式
    npm run start
    ```

+ **[预览模式]**  

    ***预览模式*** 能够预览到发布效果，如果你只是想看看项目最终部署到[github-pages](https://landminehq.github.io/rad2-i18n/)上的效果，请选择此模式。

    ```sh
    # 编译并运行 预览模式
    npm run preview
    ```

+ **[开发模式]**  

    ***开发模式*** 能够对web ui以及daemon进行实时更新，如果你需要修改web ui或者daemon逻辑，请选择此模式。

    ```sh
    # 编译并运行 开发模式
    npm run dev
    ```

## 如何贡献

你可以直接修改项目中的

```dir
src/ftbqkeys/kubejs/assets/kubejs/lang/zh_cn.json
```

语言文件，也可以启动项目的实时对比功能。  
更推荐你启动项目之后在网页上进行人工翻译。  

你所操作编辑的任何内容都会***实时更新***到语言文件中。  
这意味着你可以随时提交[PR](https://github.com/landmineHQ/rad2-i18n/pulls)，如何提交PR请**自行搜索**，这里不再赘述。

web ui与[RAD2-i18n](#rad2-i18n)中的web ui是一样的，不过非开发环境不允许进行词条更新。
