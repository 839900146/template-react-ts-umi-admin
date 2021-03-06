## 基于 UMI 的 React 后台管理模板

本项目主要做了以下优化

1. 剔除国际化
2. 剔除不必要的组件
3. 剔除不必要的文件和第三方依赖
4. 优化打包构建配置
5. 优化前端 proxy 写法
6. 封装 request 请求方法
7. 对 `@ant-design/charts`, `antv/g2系列`, `antv/g6系列`, `echarts` 可视化图表库的构建优化

---

## 安装依赖

```bash
yarn install
```

> 如果依赖无法下载, 可尝试翻墙, 或查看本地 nodejs 的版本是否符合要求, 或添加相关的.npmrc 国内镜像

## 启动方式

```bash
yarn start
```

## 打包构建

```bash
yarn build
```

---

## 开发规范

### 文件名

- 如果你的文件是`页面`或`组件`, 应使用 `大驼峰` 命名法, 如 `UserCenter`
- 如果你的文件是`页面`或`组件`, 其文件后缀应该使用 `.tsx` 或 `jsx`, **而不是.js**
- **任何页面都不允许使用 `Index` 作为文件名**

### 全局组件

如果你定义的组件是一个全局组件, 或有 2 个以上的路由页面都需要用到这个组件, 那么你应该将其放到 `src/components` 文件夹内

### 请求函数

项目中的所有请求函数都应当写在 `src/services` 文件夹内, 如果项目界面少, 模块少, 接口少等情况下, 所有的接口都应该写在 `api.js` 这一个文件中

如果项目模块多, 页面多, 接口也多, 项目结构复杂, 则应该以 **模块** 进行接口划分, 不同的接口放到不同的文件内

所有的接口都应当遵循下面这种写法

```js
export async function xxx() {
  // 这是一个示例
  return request.post('/xxx', { a: 1 });
}
```

在页面中导入接口时, 应当按照以下方式进行导入

```js
import * as services from '@/services/api';

// 发送请求
services.xxx();
```

### 样式规范

我们写的样式名都应该采用 `全小写, 中划线` 的格式, 如

```css
.my-page {
}
```

同时, 在导入样式时, 应当以如下的方式进行导入

```js
import Styles from './xxx.less';
```

### 样式覆盖

如果需要覆盖某些组件的默认样式, 如 antd, 不能直接去 global.less 写, 而应该采用如下写法

```js
import Styles from './xxx.less';
<Select className={Styles['my-select']}></Select>;
```

```less
// xxx.less
.my-select {
  :global {
    .ant-design-selection {
      width: 500px;
    }
  }
}
```

只有这样, 才不会污染到其它页面

### 页面路由

我们页面的路由路径应当采用 `大驼峰` 命名路径, 如下

```js
{
  path: '/Home',
  name: '首页',
  component: './Home/Home',
}
```

### Mock 规范

前端在开发时难免会出现后台接口没完成, 而前端需要自己模拟接口数据的情况, 这其中也存在一些规范

Mock 文件均写在 `config/mock` 文件夹内, 如果这个文件夹不存在, 就自己手动创建

如果需要 Mock 的文件较多, 可考虑将其放入二级目录中

**Mock 文件写法规范**

```js
module.exports = {
  '/api/register': async (req, res) => {},
  '/api/login': async (req, res) => {},
  '/api/queryInfo': async (req, res) => {},
};
```

必须采用上面这种 mock 接口写法, **禁止使用 ES6 Module 写法**

---

## 代码提交规范

提交代码要遵从如下规范

- 特性: 一个新的特性、新功能'
- 修复: 修复一个 Bug'
- 文档: 修改了某个文档'
- 格式: 代码格式化'
- 重构: 代码重构，注意和特性、修复区分开'
- 性能: 提升性能'
- 测试: 添加一个测试'
- 工具: 开发工具变动(构建、脚手架工具等)'
- 回滚: 代码回退'

下面是一个提交的演示

```bash
git add .
yarn commit
```

> 不可使用 `--no-verify` 跳过检查, 除非没得办法

同时, 我们在提交代码前, 应当先执行 `git pull` 检查更新, 然后再 `git push`

在拉取代码时, 我们仍需保证本地代码都已经`commit`或`stash`了才进行拉取

---

## 开发配置

- token
- 请求前缀
- proxy 代理服务器
- 网站二级目录
- 静态资源目录
- 静态资源路径

以上配置, 均可在 `config/server.js` 中进行配置,

> 非必要情况下, 不要去改动 `config/build.js` 的内容, 如确需做改动, 应事先声明, 告知相关人员

## 其它注意事项

### 动态路由

一般情况下, 禁止使用动态路由, 也就是下方这种 `:xx` 的形式

```js
/News/Today/:id
```

可使用 `querystring` 的形式替代动态路由, 动态路由在打包构建的时候, windows 系统下极有可能会失败

### 其它错误

不明原因的错误, 例如在 routes 里配置了导航的 icon 不生效的话等问题需要手动删除 `src/.umi` 文件夹, 然后再重新执行 `yarn start` 即可

---

## 建议

### 可视化类库

假如项目中需要用到可视化图表库, 首先建议选择以下几个:

- `@ant-design/charts`
- `antv/g2系列`
- `antv/g6系列`
- `antv/x6系列`
- `echarts`

因为本系统对上述 4 款可视化图表库做了一定的性能优化, 因而进行推荐

> 假如引入了其它可视化类库, 则在性能优化方面, 可自行在 `config/build.js` 中进行配置
