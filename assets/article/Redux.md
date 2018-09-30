## 本文档适合于看了redux的官方文档，但是头有点蒙，没有搞懂，那么来这看看可以，也许你会学到一些东西。但是如果你没有看过官方的文档，直接来看这个文档，你会感觉不知道说的是啥的感觉。另外，如果你是大神也欢迎您来给我提提意见，指出错误与不足，本人会非常的感谢您。

#### 首先先明确一下redux的作用，或者说是目的，我们为什么要用redux。下面的目的总结是结合了本人自己的理解以及和同事的交流得出的结论，如果您有其他的想法，非常感谢您说出您的想法。

- 使用redux的目的之一是解决组件之间数据通信的问题，现在的三大框架都在宣传组件式的开发方式，一个页面往往由多个组件构成，那么组件之间的数据通信就有可能出现问题。比如利用广播进行组件之间的通信，那么在多人协作的开发过程中就有可能造成广播的命名冲突，造成数据的错误改变。那么由于在redux中，数据都存储在store中，各个组件都是通过输入参数的方式展示数据，那么当我们改变某些值得时候，其实改变得是store中的数据，而各个组件又是从store中取数据进行渲染，从而实现了组件之间通信的目的。
- 第二个目的是我自己想的，但是和同事沟通后，同事说redux的初始目的并不是这个，不过我在这里也写出来，看看大家的见解。考虑这样一个场景，有一个个人博客系统，首页是这个人的文章列表，点击某个文章进入文章详情页。你点击了第一篇文章，加载了文章的详情，返回，点击第二篇文章，加载了第二篇文章的详情，返回重新点击第一篇文章，我认为此时可以不用在加载了，或者是有条件的加载，因为我们如果做了储存的话我们就可以不用再请求服务器了，但是对这个state数据结构的设计可能我还没有想好，以及条件加载更新的问题。不过后来我又想了一下，其实想做数据的缓存没必要在这做，可以对http请求进行封装，做数据的缓存，而且在redux这块做数据缓存的话只会增加设计的复杂度，而如果分开来做，数据缓存在http端来做，不仅可以实现需求，还可以简化系统的设计（主要就是简化redux层面的设计）。

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

