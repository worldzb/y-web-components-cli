
const shadowDom = `<style>
.test{
  background: red;
}
</style>
<template>
  <div>
    sadfsdf
    <slot name="fasdf"></slot>
    <template>
      <div>发生的发v啊似懂非懂饭撒发生</div>
    </template>
  </div>
</template>`

class BlueBox extends HTMLElement{
  constructor(){
    super()
    this.init()
    this.createDom()
    this.eventBind()
  }
  connectedCallback(){
    this.eventBind()
  }
}

customElements.define('red-box', RedBox)