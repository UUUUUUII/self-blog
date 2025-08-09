import { defineConfig, UserConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";
import { VitePressSidebarOptions } from "vitepress-sidebar/types";

const vitePressOptions: UserConfig = {
  srcDir: "./document",
  title: "笔记-Notes",
  description: "自我记录",
  head: [["link", { rel: "shortcut icon", href: "/logo.svg" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      {
        text: "快速导航",
        items: [
          {
            text: "Front End",
            items: [
              {
                text: "面试题1",
                link: "/frontEnd/interviewQuestions/JavaScript_learn1",
              },
              {
                text: "面试题1",
                link: "/frontEnd/interviewQuestions/JavaScript_learn2",
              },
              {
                text: "面试题3",
                link: "/frontEnd/interviewQuestions/JavaScript_learn3",
              },
              {
                text: "工具函数",
                link: "/frontEnd/javascript/utils-fn",
              },
              {
                text: "算法",
                link: "/frontEnd/javascript/algorithm",
              },
            ],
          },
          {
            text: "Three.js",
            items: [{ text: "辅助函数", link: "/three/helperFuns/helper-fn" }],
          },
          {
            text: "个人记录",
            items: [
              { text: "自我", link: "/self/dailyJS/daily-lc" },
              { text: "日常", link: "/self/dailyJS/daily-record" },
              { text: "有趣的知识", link: "/self/dailyJS/interesting" },
            ],
          },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "" }],
    // logo: "/logo.svg",
    logo: { src: "/logo.svg", width: 24, height: 24 },
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
                  close: "关闭",
                },
              },
            },
          },
        },
      },
    },
    // 页脚
    // footer: {
    //   message: "xxx",
    //   copyright: "xxxxxxx",
    // },
  },
};

const vitePressSidebarOptions:
  | VitePressSidebarOptions
  | VitePressSidebarOptions[] = [
  {
    documentRootPath: "./document",
    collapsed: false,
    capitalizeFirst: true,
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
    scanStartPath: "frontEnd",
    resolvePath: "/frontEnd/",
  },
  {
    documentRootPath: "./document",
    collapsed: false,
    capitalizeFirst: true,
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
    scanStartPath: "three",
    resolvePath: "/three/",
  },
  {
    documentRootPath: "./document",
    collapsed: false,
    capitalizeFirst: true,
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
    scanStartPath: "self",
    resolvePath: "/self/",
  },
];
// console.log(withSidebar(vitePressOptions, vitePressSidebarOptions))
export default defineConfig(
  withSidebar(vitePressOptions, vitePressSidebarOptions)
);
