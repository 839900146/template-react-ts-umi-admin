---
title: React-Typescript开发手册
date: 2022-2-16
---

### 前言

当前前端项目采用 ts 进行开发已逐渐成为主流趋势, ts 入门及学习难度也基本不大, 但是实际在使用人家提供的脚手架如 create-react-app, vue-cli 中, 项目里都会有些眼花缭乱的写法和类型定义, 甚至人家都制定了一套固定的 ts 项目代码写法, 我们只能按照人家的规范来写, 否则无法正确编译

本文以 React 为例, 为大家介绍如何在项目中使用 ts, 以及在项目中如何正确书写 ts 的类型声明

### 创建项目

```bash
create-react-app 项目名 --template typescript
```

---

### 组件 props

> 提前声明, 在项目中, 我们不再使用 jsx, 我们的组件和页面文件应当使用 tsx 作为文件的后缀

在 ts 中, 组件中 **如果用到了** props, 那么我们需要给 props 做一个类型声明, 否则会出现报错

---

#### 类组件

创建类组件的方式与以往一样, 变化不大

```tsx
import React, { Component } from 'react';
// Demo组件的props类型
interface IDemoProps {
  name: string;
  age: number;
}

class Demo extends Component<IDemoProps> {
  render() {
    return <div>这是Demo组件</div>;
  }
}
```

---

#### 函数组件

函数组件写法稍有不同, 主要是可以有 2 种写法, 推荐使用第一种

**第一种: **

```tsx
// Demo组件的props类型
interface IDemoProps {
  name: string;
  age: number;
}

const Demo = (props: IDemoProps) => {
  return <div>这是Demo组件</div>;
};
```

**第二种: **

```tsx
import React from 'react';
// Demo组件的props类型
interface IDemoProps {
  name: string;
  age: number;
}

const Demo: React.FC<IDemoProps> = (props) => {
  return <div>这是Demo组件</div>;
};
```

---

### 组件 state

如果我们在组件中用到了 state, 特别是类组件, 一般我们都需要去定义好 state 的数据类型, 否则除了报错之外, 还 **没有办法正确的进行类型提示**

在写法上, 其实与 props 的类型定义差不多

#### 类组件

```tsx
import React, { Component } from 'react';
// Demo组件的state类型
interface IDemoState {
  name: string;
  age: number;
}

class Demo extends Component<any, IDemoState> {
  render() {
    return <div>这是Demo组件</div>;
  }
}
```

#### 函数组件

```tsx
import { useState } from 'react';
// Demo组件的props类型
interface IDemoState {
  name: string;
  age: number;
}

const Demo = (props: IDemoProps) => {
  let [userinfo, setUserinfo] = useState<IDemoState>({
    name: '',
    age: 0,
  });

  return <div>这是Demo组件</div>;
};
```

---

### dva

如果我们需要用到 dva 来做数据管理, 我们也需要遵循一定的开发规范和流程以下我们将给出一个 model 的写法格式, 并同时列举出新写法和旧写法两种模式

#### model 写法

首先我们得明确,怎么编写一个 model, 如何让 umi 识别我们写的是一个 model?

- src/models/xxx.ts
- src/pages/xxx/models/xxx.ts
- src/pages/xxx/xxx.model.ts

只要符合以上三种情况之一的 js 或 ts 文件, 就会被 umi 自动识别为一个 dva 的 model

**写法示例**

```javascript
import type { Effect, Reducer } from 'umi';
const namespace = 'modelName';

/**
 * state的类型
 */
export interface IndexModelState {
  zzz: string;
}

/**
 * model的类型接口
 */
export interface IndexModelType {
  namespace: typeof namespace;
  state: IndexModelState;
  effects: {
    xxx: Effect,
  };
  reducers: {
    yyy: Reducer<IndexModelState>,
  };
}

/**
 * model的实现
 */
const IndexModel: IndexModelType = {
  namespace,

  state: {
    zzz: '',
  },

  effects: {
    *xxx({ payload }, { put }) {
      console.log('effects yyy', payload);
      // 如果访问的是本文件里的reduces, 则不需要带上namespace
      yield put({ type: 'yyy', payload });
    },
  },

  reducers: {
    yyy(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default IndexModel;
```

> 观察上面的例子,相信有点 umi 基础的都能看得懂, 这里就不多赘述了主要是提醒大家在使用 ts 编写时要注意的点, state, effect, reducers 都要从 umi 中导入相应的类型声明

到此, 我们就写好了一个 model, 那么, 我们在页面中如何使用呢? 在最新版 umi 或 dva 中, 我们有 2 种使用的方式, 如下:

#### connect 方式

connect 算是旧方式了, 也是现在不推荐的写法, 因为当页面多的话, 写起来会感觉很累赘

```typescript jsx
import { FC } from 'react';
import { connect, ConnectProps } from 'umi';
import type { IndexModelState } from 'xxx';

interface IPageProps extends ConnectProps {
  state: IndexModelState;
}

const Demo: FC<IPageProps> = (props) => {
  return <h1>{props.state.zzz}</h1>;
};

const mapStateToProps = (state) => {
  return {
    // 这里的modelName是我们定义的namespace
    state: state.modelName,
  };
};

export default connect(mapStateToProps)(Demo);
```

> 可以看到我们上面写的这个例子, 看上去有点繁琐

#### hooks 方式

```typescript jsx
import { useDispatch, useSelector } from 'umi';
import type { Dispatch } from 'umi';
import type { IndexModelState } from 'xxx';

const Demo = () => {
  // 获取dispatch
  const dispatch = useDispatch<Dispatch>();

  // 获取state
  const state = useSelector(({ homeModel }: { homeModel: IndexModelState }) => homeModel);

  return <h1>{state.zzz}</h1>;
};

export default Demo;
```

> 而用了 hooks 写法之后, 我们的代码看上去就清爽了很多

---

### Ref

如果我们在组件中用到了 `useRef` 或者 `createRef` , 可能我们也需要去指定其绑定元素的类型

#### 类组件

```tsx
import React, { Component } from 'react'

class Demo extends from Component {
    const ref = React.createRef<HTMLInputElement>(null)

    function handleClick() {
        let value = (ref.current as HTMLInputElement).value
        console.log(value)
    }

    return (
    	<div>
        	<input ref={ref} value='这是Demo组件' />
            <button onClick={() => handleClick()}>点我</button>
        </div>
    )
}
```

- `createRef<HTMLInputElement>` 代表我要绑定的元素是一个 input 元素, 除此之外还有其它如 `HTMLDivElement` 等
- `ref.current as HTMLInputElement` 代表我很确定 `ref.current` 就是一个 input 元素, 而不是其它的东西

#### 函数组件

```tsx
import { useRef } from 'react';

const Demo = () => {
  let ref = useRef<HTMLInputElement>(null);

  function handleClick() {
    let value = (ref.current as HTMLInputElement).value;
    console.log(value);
  }

  return (
    <div>
      <input ref={ref} value="这是Demo组件" />
      <button onClick={() => handleClick()}>点我</button>
    </div>
  );
};
```

---

### 路由 props

有时候我们的组件需要使用 `props.history.push` 之类的操作时, ts 可能会提示说不知道 props 身上有这些属性, 但是我们又很确定, props 身上肯定有

那么这个时候我们就需要来给 props 指定类型声明

> 在 ts 中, 类型声明除了可以自己写之外, 还可以导入人家已经写好了的声明
>
> 如果人家没有写, 那么可能就需要去寻找第三方类型声明模块, 或自己写, 比较麻烦

```tsx
import { RouteComponentProps } from 'react-router-dom'

const Demo = (props: RouteComponentProps) {
    return <button onClick={() => props.history.push('/')}>点我</button>
}
```

---

### 路由传参

有一种情况, 也就是 **路由跳转传参**, 比如下面这个

```tsx
props.history.push(`/Demo1/:newsId`);
```

如果我们 Demo1 页面这么来获取参数, **ts 会报错**, 因为 ts**不知道你的 params 里有什么**

```tsx
props.match.params.newsId;
```

这个时候我们就需要写个接口来约束下我们的 params

```tsx
import { RouteComponentProps } from 'react-router-dom'
interface IRouteParams {
    newsId: string
}
const Demo = (props: RouteComponentProps<IRouteParams>) {
    console.log(props.match.params.newsId)
    return <div>我是Demo1</div>
}
```

如果你不想写接口来约束, 当然也可以用 **类型断言**, 只是下面这种方案 **不推荐使用**

```tsx
import { RouteComponentProps } from 'react-router-dom'
const Demo = (props: RouteComponentProps) {
    console.log((props.match.params as any).newsId)
    return <div>我是Demo1</div>
}
```

---

### 类型声明文件

类型声明文件就是用来存放我们写的 ts 数据类型的, 其文件是以 `.d.ts` 结尾, 这是强制性要求

我们写好类型声明文件后, 可以放在项目中的任意位置, 文件取名也没有啥太大的约束

一般来说, 如果类型声明文件是自己写的, 那么我们建议是放在项目目录下的 `types` 文件夹内

除此之外, 我们还可以去下载别人写好的类型声明文件

```bash
yarn add @types/xxx -D
```

> - `xxx`是依赖包名, 例如` @types/react`, 就代表下载`react`的类型声明文件
>
> - 为什么是 `@types` 开头? `@types`是`npm`官方的类型文件仓库
>
> - 通过这种方式下载后, 会自动被 vscode 等代码编辑器识别, 无需手动引入

> - 某些依赖包的类型声明文件在 `@types` 中不一定有, 这时候可能就需要自己去写, 或者忽略 ts 的警告

> - antd 组件的类型声明文件通常可以从 `antd/es/xxx` 中进行引入

---

### 全局声明文件

在 ts 中所有的类型声明文件都是以 `.d.ts` 结尾

如果我们写的某些类型声明需要放到全局下, 那么可以写在 `src` 目录下的 `global.d.ts` 或 `typings.d.ts` 或 `index.d.ts`

> 如果文件不存在, 则自己去手动创建
>
> 其实文件名叫什么都无所谓, 只是要规范一点, 不管你的类型声明文件取什么名字, 放在哪里, 都能够被 ts 编译器识别得到

然后在 `tsconfig.json` 的 `include` 中写入

```ts
"include": [
    "src/**/*",
]
```

书写全局类型的语法示例如下

```tsx
declare;
IApiCode = 200 | 400 | 401 | 403 | 500;
interface CurrentUser {
  user_id: string;
  name: string;
  phone: string;
  avatar: string;
  access: string;
  country?: string;
  email?: string;
  address?: string;
  [propName: string]: any;
}
```

---

### 局部声明文件

局部类型声明文件跟全局声明文件写法基本一致, 放在哪个位置也无所谓, 区别在于, 局部类似声明文件不需要在 tsconfig.json 中进行配置

其次, 局部类型声明文件中, 我们写的类型声明, 都应该使用 `export` 导出, 然后在需要使用的地方使用 `import type` 导入

```tsx
// demo.d.ts
export interface IUserInfo {
  id: string;
  name: string;
  age: number;
  phone: string;
}

export type AccountStatus = '正常' | '冻结';

export enum Roles {
  USER,
  ADMIN,
}
```

```tsx
// Demo.tsx
import type { IUserInfo, AccountStatus, Roles } from './demo.d.ts';
```

> **import type** 表示我要导入的东西是类型声明

---

### Antd 类型声明

#### TableColumn

在使用 Table 组件的时候, 我们需要定义表格的字段, 假如我们希望在编写字段的时候, 能够获得类型提示, 我们需要引入 `ColumnType` 类型

```tsx
import { Table } from 'antd';
import type { ColumnType } from 'antd/es/table';

interface ITableColumns {
  name: string;
  age: number;
  sex: '男' | '女' | '保密';
}

const Demo = () => {
  const columns: ColumnType<ITableColumns>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      align: 'center',
      render: (text, row, index) => text,
    },
  ];
};
```

---

#### FormRef

前面讲 ref 的时候已经说过了, 要用 ref 引用 Form 的话, 需要导入 `FormInstance` 类型

```tsx
import { useRef } from 'react';
import type { FormInstance } from 'antd/es/form';

const Demo = () => {
  let formRef = useRef<FormInstance>(null);

  return <Form ref={formRef}></Form>;
};
```
