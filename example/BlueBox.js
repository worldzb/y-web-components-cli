
const __template__ = `
<style>
.container {
  background: blue;
  width: 200px;
  height: 200px;
}
.container .test {
  display: flex;
}
</style>
  <div class="container">
    sadfsdf
    <slot></slot>
    <template>
      <div>发生的发v啊似懂非懂饭撒发生</div>
    </template>
  </div>
`

class BlueBox extends HTMLElement{
  constructor(){
    super("fff")
    this._rootShadow = this.attachShadow({mode:'open'})
    this._rootShadow.innerHTML = __template__
      this.bbb = 100
    this.aaa = 10
    // console.log('创建')
  }

  connectedCallback(){
    // console.log('元素插入', )
    setTimeout(() => {
      this.eventBind()
    }, 200);
  }
  eventBind(){
    console.log(this._rootShadow)
    // console.log(this.shadowRoot)
    // console.log(this.shadowRoot.querySelector('.container'))
    this._rootShadow.querySelector('.container').onclick = function(){
      console.log('aaa')
    }
  }
}

customElements.define("blue-box", BlueBox)