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

### 问题：既然在reducer中我们不能进行异步的处理（比如从服务端拉取数据），那么我们要在哪里去处理这个问题？这就要提出下面的异步action

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

主要就是使用thunkMiddleware中间件，还有很多可代替的以及可用的中间件，你可以去尝试。注意有的中间件是需要使用顺序的，使用之前最好查看一下中间件的使用文档。

### redux中主要的api

- createStore(reducer, [preloadedState], enhancer)

  创建一个 Redux store 来以存放应用中所有的 state。应用中应有且仅有一个 store。

  1. reducer：接收两个参数，第一个参数是接收当前的state状态树，第二个参数是接收action，返回一个新的state。
  2. preloadedState：初始时的state。
  3. enhancer：Store enhancer 是一个组合 store creator 的高阶函数，返回一个新的强化过的 store creator。这与 middleware 相似，它也允许你通过复合函数改变 store 接口。使用applyMiddleware()的地方。

  返回值是store：保存了应用所有 state 的对象。改变 state 的惟一方法是 dispatch action。

- store

  Store 就是用来维持应用所有的 state 树 的一个对象。 改变 store 内 state 的惟一途径是对它 dispatch 一个 action。下面对store中的方法进行解释：

  1. getState():返回应用当前的 state 树。
  2. dispatch(action):分发 action。这是触发 state 变化的惟一途径。
  3. subscribe(listener):添加一个变化监听器。每当 dispatch action 的时候就会执行，state 树中的一部分可能已经变化。你可以在回调函数里调用 getState() 来拿到当前 state。这是一个底层 API。多数情况下，你不会直接使用它，会使用一些 React（或其它库）的绑定。如果需要解绑这个变化监听器，执行 subscribe 返回的函数即可。参数listener (Function): 每当 dispatch action 的时候都会执行的回调。state 树中的一部分可能已经变化。你可以在回调函数里调用 getState() 来拿到当前 state。store 的 reducer 应该是纯函数，因此你可能需要对 state 树中的引用做深度比较来确定它的值是否有变化。
  4. replaceReducer(nextReducer):替换 store 当前用来计算 state 的 reducer。这是一个高级 API。只有在你需要实现代码分隔，而且需要立即加载一些 reducer 的时候才可能会用到它。在实现 Redux 热加载机制的时候也可能会用到。

- combineReducers(reducers):combineReducers 辅助函数的作用是，把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数，然后就可以对这个 reducer 调用 createStore 方法。

  注意：在 reducer 层级的任何一级都可以调用 combineReducers。并不是一定要在最外层。实际上，你可以把一些复杂的子 reducer 拆分成单独的孙子级 reducer，甚至更多层。

- applyMiddleware(...middlewares)：Middleware 最常见的使用场景是无需引用大量代码或依赖类似 Rx 的第三方库实现异步 actions。这种方式可以让你像 dispatch 一般的 actions 那样 dispatch 异步 actions。
- bindActionCreators(actionCreators, dispatch)：惟一会使用到 bindActionCreators 的场景是当你需要把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 dispatch 或 Redux store 传给它。为方便起见，你也可以传入一个函数作为第一个参数，它会返回一个函数。
  1. actionCreators (Function or Object): 一个 action creator，或者一个 value 是 action creator 的对象。
  2. dispatch (Function): 一个由 Store 实例提供的 dispatch 函数。

- compose(...functions)：从右到左来组合多个函数。

  1. (arguments): 需要合成的多个函数。预计每个函数都接收一个参数。它的返回值将作为一个参数提供给它左边的函数，以此类推。例外是最右边的参数可以接受多个参数，因为它将为由此产生的函数提供签名。（译者注：compose(funcA, funcB, funcC) 形象为 compose(funcA(funcB(funcC())))）

#### 这是基本的redux的使用方法，到目前为止，我认为redux还是比较好理解的，可能难点就是在state结构的设计上面，以及redux与react结合的组件层次划分上面，之后我会继续将react-redux的使用方法总结一下，再之后可能还有redux与react-router之间的配合使用的方式总结一下，可能总结的并不是很全面，也并不是条理很清晰，如果有什么意见或者建议非常感谢您的提出，我会努力加以改正。谢谢

