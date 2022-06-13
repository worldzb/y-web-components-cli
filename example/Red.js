
const __template__ = `
<style>



</style>
  
`

class TestCom extends HTMLElement{
  constructor(){
    super("fff")
    this._rootShadow = this.attachShadow({mode:'open'})
    this._rootShadow.innerHTML = __template__
    }
}

customElements.define("test-com", TestCom)