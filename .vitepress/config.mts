import { defineConfig, UserConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";
import { VitePressSidebarOptions } from "vitepress-sidebar/types";

const vitePressOptions: UserConfig = {
  srcDir: "./document",
  title: "个人记录Blog",
  description: "自我记录，自我学习",
  // head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    socialLinks: [
      { icon: "github", link: "" },
    ],
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
