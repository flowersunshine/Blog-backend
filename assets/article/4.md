#### 写这篇文章的动机：我之前作为调试使用console基本上一直在使用log方法，偶尔会使用error方法。但是其实console中有很多的方法供使用，不过我基本都不知道他们的使用方式，所以就想写一个文章来专门总结一下各个方法的使用方式。

- log：用于输出普通信息
- info：用于输出提示性信息
- error：用于输出错误信息
- warn：用于输出警示信息
- debug：用于输出调试信息
- dirxml：用于输出node节点的html代码

```js
console.dirxml(node)
```

- console.group和console.groupEnd这两个是配合使用的，用于给输出的信息进行分组，先用group指定分组的开始，在group中可以传入参数指定分组的名字，输出结束之后调用groupEnd方法。

```js
console.group('aaa');
console.log('我是分组aaa的信息');
console.groupEnd();
```

- assert：判断第一个参数是否为真，false的话抛出异常并且在控制台输出相应信息。

```js
console.assert(false, '我是assert断言输出的内容');
```

- count：以参数为标识记录调用的次数，调用时在控制台打印标识以及调用次数。

```js
function counter(){
    console.count('counter函数被执行的次数：');
}
counter();
counter();
counter();
```

- dir：打印一条以三角形符号开头的语句，可以点击三角展开查看对象的属性。
- console.time和console.timeEnd：用于对一段代码的执行时间进行计时，在两个方法中都可以传入参数来对这次的计时命名，不过两次传入的参数必须是相同的。

```js
console.time('a');
console.log(1);
console.timeEnd('a');
```

- console.profile和console.profileEnd：用于记录一段代码执行期间cpu的使用情况。不过我不知道这个是不是浏览器版本的问题，我没有在我的谷歌浏览器中看到这个东西在哪。

```js
console.profile('start');
console.log(1);
console.profileEnd('start');
```

- console.timeLine和console.timeLineEnd：配合一起记录一段时间轴。
- trace：堆栈跟踪相关的调试。
- table：将数据打印成表格。