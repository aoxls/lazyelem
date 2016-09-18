# Lazy Loader for html elements

lazyelem是一个基于jQuery的html内容懒加载组件，支持多种内容类型，包括前景图、背景图、DOM代码段，以及自定义操作。


## Getting started

首先确保先引入jquery，之后再引入lazyelem.min.js，它会产生一个名为`lazyelem`的全局对象，请避免重名。

### 加载前景图
```html
<img lazy-src="temp/1.jpg" alt="" />
```
lazyelem默认执行前景图懒加载，所以如果只需要懒加载图片，可以不用传入参数
```js
lazyelem.listen();
```
相当于
```js
lazyelem.listen('img[lazy-src]', 'img');
```
如果需要在图片触发加载条件后执行回调，可将回调函数作为第三个参数传入
```js
lazyelem.listen('img[lazy-src]', 'img', function(obj) {
	// obj 是当前触发加载条件的jQuery对象
});
```

### 加载背景图
```html
<div class="bg" lazy-bg="temp/bg.jpg"></div>
```

```js
lazyelem.listen('.bg', 'bg', function(obj) {
	// 回调是可选的
});
```

### 加载DOM
```html
<div class="dom">
    <script type="text/html">
    <h3>这是一整段DOM懒加载</h3>
    <ul class="image">
        <li><img src="temp/3.jpg" alt="" /></li>
        <li><img src="temp/3.jpg" alt="" /></li>
        <li><img src="temp/3.jpg" alt="" /></li>
    </ul>
    </script>
</div>
```

```js
lazyelem.listen('.dom', 'dom', function() {
	// 回调是可选的
});
```

### 执行自定义方法
```html
<ul class="fn">
    <li title="111"></li>
    <li title="222"></li>
    <li title="333"></li>
    <li title="444"></li>
</ul>
```

```js
lazyelem.listen('.fn li', 'fn', function(obj) {
	console.log(obj);
});
```

### 批量处理被加载对象
将类型设置为bat，回调函数中的参数为触发加载条件的元素的jQuery对象的数组
```js
lazyelem.listen('.fn-group li', 'bat', function(objs) {
    console.log(objs);
});
```


### 自定义监听对象
可直接将一组jQuery对象作为第一个参数传入
```js
lazyelem.listen($('.my-elements'), 'fn');
```

### Loading样式
lazyelem会给每个被监听的img元素加上一个class：`lazy-loading`，可以在项目的css中设置loading效果。


## Configuration
目前提供5个配置项，通过`config`方法设置,要在listen方法前调用。
```js
lazyelem.config({
    timeout: 10, // 每次滚动事件执行延迟
    buffer: 100, // 屏幕上下方缓冲区域高度
    loadingClass: 'lazy-loading',
    srcValue: 'lazy-src',
    bgValue: 'lazy-bg'
});
```

## Method

### detect

某些需要在特定事件中加载的内容，可以在各自的事件处理逻辑后调用此方法，以展示原本被隐藏的内容。
```js
lazyelem.detect();
```

### clear

清除对某个或全部对象的监听
```js
lazyelem.clear([DOM Object]);
```