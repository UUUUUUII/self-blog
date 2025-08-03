import { defineConfig, UserConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";
import { VitePressSidebarOptions } from "vitepress-sidebar/types";

const vitePressOptions: UserConfig = {
  srcDir: "./document",
  title: "笔记-Notes",
  description: "自我记录",
  // head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      {
        text: "总览",
        link: "/document-markdown",
      },
      {
        text: "快速导航",
        items: [
          {
            text: "面试题",
            items: [
              { text: "1-100", link: "/javascript/JavaScript_learn1" },
              { text: "100-200", link: "/javascript/JavaScript_learn2" },
              { text: "200-201", link: "/javascript/JavaScript_learn3" },
            ],
          },
          {
            text: "个人记录",
            items: [
              { text: "日常", link: "/self/lc" },
              { text: "自我", link: "/self/js-record" },
            ],
          },
          {
            text: "Three.js",
            items: [
              { text: "日常", link: "/three/helper-fn" },
            ],
          },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "" }],
    logo: "/public/logo.svg",
    // lastUpdated: {
    //   text: "Updated at",
    //   formatOptions: {
    //     dateStyle: "full",
    //     timeStyle: "medium",
    //   },
    // },
    // 文章右侧大纲目录
    outline: {
      level: [2, 6],
      label: "目录",
    },
    //自定义上下页名
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    // 主题
    darkModeSwitchLabel: "深浅模式",
    // 返回顶部label
    returnToTopLabel: "返回顶部",
    // 搜索
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  close:"关闭"
                },
              },
            },
          },
        },
      },
    },
    // 页脚
    footer: {
      message: "xxx",
      copyright: "xxxxxxx",
    },
  },
};

const vitePressSidebarOptions:
  | VitePressSidebarOptions
  | VitePressSidebarOptions[] = {
  // VitePress Sidebar's options here...
  documentRootPath: "./document",
  collapsed: false,
  capitalizeFirst: true,
  useTitleFromFrontmatter: true,
  useFolderTitleFromIndexFile: true,
};
// console.log(withSidebar(vitePressOptions, vitePressSidebarOptions))
export default defineConfig(
  withSidebar(vitePressOptions, vitePressSidebarOptions)
);
