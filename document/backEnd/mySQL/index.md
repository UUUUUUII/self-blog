---
title: MySQL 学习记录
---

## MySQL 安装与启动

下载并安装社区版：[MySQL](https://dev.mysql.com/downloads/mysql/)

### 1. 确认 MySQL 服务名称

在启动数据库之前，先确认当前 MySQL 服务的实际名称，避免使用错误的服务名。

步骤：

1. 打开命令提示符（Win + R，输入 `cmd`）
2. 输入 `services.msc` 并按回车
3. 在服务列表中找到 MySQL 相关项
4. 查看实际服务名称，例如：`MySQL80`

> 注意：不同版本的 MySQL，服务名称可能不同，常见的有 `MySQL`、`MySQL80` 等。

### 2. 启动与连接数据库

```bash
# 启动 MySQL 服务
net start MySQL80

# 连接数据库
mysql -u root -p

# 之后输入密码，例如：admin / 123456
# 具体密码以你自己的安装配置为准
```

### 3. 停止 MySQL 服务

```bash
# 停止 MySQL 服务
net stop MySQL80
```

---

## 常用操作说明

### 1. 登录数据库

```bash
mysql -u root -p
```

登录后输入密码即可进入 MySQL 命令行界面。

### 2. 选择数据库

```sql
USE test_db;
```

在登录成功后，先选择要操作的数据库，后续的表和数据操作都会在这个数据库中进行。

### 3. 查看数据库

```sql
SHOW DATABASES;
```

用于查看当前 MySQL 实例中有哪些数据库。

### 4. 创建数据库

```sql
CREATE DATABASE test_db;
```

创建一个名为 `test_db` 的数据库。

### 5. 删除数据库

```sql
DROP DATABASE test_db;
```

删除指定数据库，使用时要特别注意，数据会丢失。

### 6. 切换数据库

```sql
USE test_db;
```

切换到指定数据库后，后续的表操作都会在这个数据库下执行。

### 7. 查看当前数据库

```sql
SELECT DATABASE();
```

查询当前正在使用的数据库名称。

### 8. 查看表

```sql
SHOW TABLES;
```

查看当前数据库中的所有表。

### 9. 查看表结构

```sql
DESC users;
```

查看表 `users` 的字段、类型、是否为空等信息。

### 10. 创建表

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    age INT,
    email VARCHAR(100)
);
```

创建一个简单的用户表。

### 11. 插入数据

```sql
INSERT INTO users (username, age, email)
VALUES ('Alice', 20, 'alice@example.com');
```

向表中插入一条记录。

### 12. 查询数据

```sql
SELECT * FROM users;
```

查询表中的所有数据。

### 13. 条件查询

```sql
SELECT * FROM users WHERE age > 18;
```

按条件筛选数据。

### 14. 更新数据

```sql
UPDATE users SET age = 21 WHERE username = 'Alice';
```

修改符合条件的数据。

### 15. 删除数据

```sql
DELETE FROM users WHERE id = 1;
```

删除指定记录。

### 16. 删除表

```sql
DROP TABLE users;
```

删除表及其所有数据。

### 17. 退出数据库

```sql
EXIT;
```

或者：

```sql
QUIT;
```

退出 MySQL 命令行。




