## 本文档适合于看了redux的官方文档，但是头有点蒙，没有搞懂，那么来这看看可以，也许你会学到一些东西。但是如果你没有看过官方的文档，直接来看这个文档，你会感觉不知道说的是啥的感觉。另外，如果你是大神也欢迎您来给我提提意见，指出错误与不足，本人会非常的感谢您。

### redux中有三个核心的概念：

#### state

单一数据源，整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。并且它是一个只读的对象，可以通过action和reducer来改变数据状态。比如说一个博客系统，要有文章列表数据，每篇文章的详细内容，评论数据等等。

state的组织方式：state的结构非常重要，结构不好会导致许多问题，比如数据的相互嵌套、数据的冗余、state结构树层级非常深等等。比较推荐的做法是将state看做数据库，以范式化的方式设计state的结构，相互之间通过id进行关联，这种形式的state结构比较简单，数据没有冗余，层级也不会太深。

#### action

即是动作，说的简单点就是你要干什么，是一个对象，比如说我想要添加一条评论：

```js
{type: 'addComment', content: '我要添加评论'}
```

type说明了我要干什么，这个字段一般是约定俗成的，content指示了评论的内容，这个字段你可以自己随意的指定，你也可以叫comment，都行。一般来讲我们可能会写action创建函数，用来创建aciton，比如：

```js
function addCommentActions(content){
    return {type: 'addComment', content: content};
}
```

我们可能对于type这个字段会单独的抽取出一个文件来进行存储，这样当你要用到某个type的时候就去引用对应得变量，不过这都不是必须的，只是一种推荐方式，当你的前端系统没那么复杂的时候不遵守也可以，不过最好还是养成习惯。

**尽量的遵守单一原则，去细化action所负责的任务，如果一个action所负责的任务多于一个，那么等应用复杂起来之后一旦需要拆分action将是很麻烦的一件事！！！**

#### reducer

reducer就是一个纯函数，说的简单点就是一个接收state和action的一个函数，并且返回更新后的state，比如添加一条评论：

```js
funciton addCommentReducer(state = [], action){
    if(action.type === 'addComment'){
        return state.concat([action.content]);
    }else {
        return state;
    }
}
```

不过一个应用一定会有很多的state字段，肯定会有不只一个reducer和action，一般都是将整个state进行拆分，每个reducer管理一部分的state。

reducer不会对传入的参数进行修改，返回的state是一个新的对象，不会对原来的state进行修改，如果数据不需要改动则将原state直接返回。在上面的例子中国我们看到，我们没有使用数组的push方法，因为这个方法会改变原数组，而在reducer中是禁止对传入的参数进行修改的。所以我们使用concat方法返回一个新的数组。

在第一次调用reducer的时候传进来的state有可能是undefined，所以我们要对state赋初值。

### 问题1：既然在reducer中我们不能进行异步的处理（比如从服务端拉取数据），那么我们要在哪里去处理这个问题？这就要提出下面的异步action

#### 异步action

在redux中采用中间件，这样action不仅可以返回一个对象，还可以返回一个函数，在这个函数中就可以使用服务器的拉取等请求，创建异步的action，比如拉取某篇文章的所有的评论，简单的例子：

```js
const getCommentById = id => (dispatch, getState) => {
    http.get(id).then(res => res.json()).then(res => dispatch({type: 'addComment', res})， err => {console.error('拉取出错')})
}
```

这里dispatch和getState都是函数，getState方法可以获取当前的state，dispatch可以传入action，从而调用reducer更新state。

注意上面的错误处理，类似于axios，它封装了http请求，返回一个promise，我们可以使用then进行正常逻辑的处理，在最后面使用catch来作为错误的处理，这是我们以前正常的处理方式，但是在这里我们不能像这样去处理错误情况，因为会捕获在 dispatch 和渲染中出现的任何错误，导致 'Unexpected batch number' 错误。https://github.com/facebook/react/issues/6895。所以要像上面那样用then的第二个参数来进行错误的捕获。不过这里同样可以使用then来继续进行调用。

那么我们使用异步action要增加哪些代码呢？

```js
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware // 允许我们 dispatch() 函数
  )
)
```

主要就是使用thunkMiddleware中间件，还有很多可代替的以及可用的中间件，你可以去尝试。

#### 这是基本的redux的使用方法，到目前为止，我认为redux还是比较好理解的，可能难点就是在state结构的设计上面，以及redux与react结合的组件层次划分上面，之后我会继续将react-redux的使用方法总结一下，再之后可能还有redux与react-router之间的配合使用的方式总结一下，可能总结的并不是很全面，也并不是条理很清晰，如果有什么意见或者建议非常感谢您的提出，我会努力加以改正。谢谢

