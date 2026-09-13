---
title: NestJS
---

## 安装 Nest CLI

全局安装 NestJS CLI：

```bash
npm install -g @nestjs/cli
```

检查 CLI 是否安装成功：

```bash
nest --version
```

## 创建项目

创建一个新的 NestJS 项目：

```bash
nest new project-name
```

创建过程中可以选择 npm、yarn 或 pnpm 作为包管理器。进入项目后启动开发服务器：

```bash
cd project-name
npm run start:dev
```

## 生成资源

使用 `resource` 命令可以一次生成与某个业务资源相关的模块、控制器和服务：

```bash
nest generate resource users
```

也可以使用简写：

```bash
nest g resource users
```

执行命令后，CLI 会询问接口类型和是否生成 CRUD 入口。选择 REST API 后，通常会生成以下文件：

```text
src/users/
├── dto/
├── entities/
├── users.controller.ts
├── users.service.ts
└── users.module.ts
```

## 常用生成命令

```bash
# 生成模块
nest g module users

# 生成控制器
nest g controller users

# 生成服务
nest g service users

# 生成守卫
nest g guard auth

# 生成管道
nest g pipe validation
```

`nest g` 是 `nest generate` 的简写。生成文件时建议在项目根目录执行，这样 CLI 可以自动把模块注册到正确的位置。