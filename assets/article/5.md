#### 之前的工作中很少用到before和after伪元素，不过后来遇到过几个问题，发现很多解决方案都使用了after伪元素，所以这里也是想对这两个伪元素进行比较全面的学习一下，理解为什么可以使用这个伪元素来解决某些问题，先来说说都能解决什么问题，之后在来对必要的属性进行总结。

- 问题1：after伪类清除浮动的高度塌陷影响。

```css
.row:after { 
	width:0;
	height:0;
	content:'';
	display: block;
	clear: both;
}
```

- 问题2：解决移动端的0.5px宽的边框问题

```css
.content{
    display:inline-block;
    width: 200px;
    height: 100px;
    position:relative;
}
.content::after{
    content: '';
    display:inline-block;
    position:absolute;
    width:200%;
    height:200%;
    border:1px solid black;
    left:0;
    top:0;
    transform-origin: 0 0;
    transform: scale(.5, .5);
}
```

#### 下面我们对几个重要的属性进行总结

- after元素默认是inline的，不过我们可以使用display属性来改变他的展示形式
- 我们可以使用content属性来指定after的展示内容，如果我们不指定content属性，那么伪元素不会起任何作用
- 插入到之前和之后，这个之前和之后到底是哪里的之前和之后，是目标元素的之前之后还是目标元素内容的之前之后？答案是后一种，是目标元素内容的之前之后。

```html
<p class="box">Other content.</p>
```

```css
p.box {
  width: 300px;
  border: solid 1px white;
  padding: 20px;
}

p.box:before {
  content: "#";
  border: solid 1px white;
  padding: 2px;
  margin: 0 10px 0 0;
}
```

![](http://www.w3cplus.com/sites/default/files/styles/print_image/public/blogs/2013/pseudo-element-3.jpg)

可以看到伪元素在目标元素的里面，在目标元素内容之前。

- width和height百分比值是相对于目标元素的

#### 对于after和before伪元素的使用情况先总结这些，之后遇到了更好的使用场景会继续增加该文档。上面的很多内容都是基于网上学习得来，图片也是盗了个图没有自己截取，如有侵权，马上删除。