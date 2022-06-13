# web-components-cli
----
使用 Vue SFC 模式编写 Web Components

## 安装
```
npm i -g y-web-components-tools
or
yarn add -g y-web-components-tools
```

## 使用
### 创建 .wcp (web components 的缩写)文件
采用 vue 三段式书写方式
``` html
// test.wcp
<template>
  <div class="container">
    box
  </div>
</template>

<script lang="js">
class BlueBox extends HTMLElement{
  constructor(){
    super("fff")  // 必须要有的元素
  }

  connectedCallback(){
    setTimeout(() => {
      this.eventBind()
    }, 200);
  }
  eventBind(){
    this._rootShadow.querySelector('.container').onclick = function(){
      console.log('aaa')
    }
  }
}
</script>
<style>
.container{
  background: blue;
  width: 200px;
  height: 200px;
}
</style>
```

### 文件转译
``` shell
ywcp build test.wcp
```
改命令会在 wcp 文件下生成相同的 js 文件，内容如下

``` javascript
const __shadowDom__ = `
  <style>
.container{
  background: blue;
  width: 200px;
  height: 200px;
}
</style>
  <div class="container">
    box
  </div>
`
class BlueBox extends HTMLElement{
  constructor(){super("fff")
    this._rootShadow = this.attachShadow({mode:'open'})
    this._rootShadow.innerHTML = __shadowDom__
  }

  connectedCallback(){
    setTimeout(() => {
      this.eventBind()
    }, 200);
  }
  eventBind(){
    this._rootShadow.querySelector('.container').onclick = function(){
      console.log('aaa')
    }
  }
}
customElements.define("blue-box", BlueBox)
```

## scss
wcp 文件现已支持 scss 文件的转译，和 vue 中使用方法相同， 只需要添加 `lang="scss"` 即可使用。
> 关于 scoped 的问题    
> 由于 web components 天然支持 style 隔离， 所以无需添加 scoped



## 相关
[web components 开发](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements#%E6%A6%82%E8%BF%B0)

