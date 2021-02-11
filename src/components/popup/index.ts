
// let styles = require('./index.css')
import styled from './index.css'

interface Ipopup {
  width?: string
  height?: string
  title?: string
  position?: string
  mask?: boolean
  content?: () => void
}

interface Icomponent {
  tempContainer: HTMLElement
  init: () => void
  template: () => void
  handle: () => void
}


class Popup implements Icomponent{
  tempContainer
  constructor(private settings: Ipopup) {
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      title: '',
      position: 'center',
      mask: true,
      content: function() {}
    }, this.settings)
    this.init()
  }
  // 初始化
  init() {
    this.template()
  }
  // 创建模板
  template() {
    this.tempContainer = document.createElement('div')
    this.tempContainer.innerHTML = `
      <h1 class="${styled.popup}">Hello</h1>
    `
    document.body.appendChild(this.tempContainer)
    console.log(111)
  }
  // 时间操作
  handle() {

  }
}

function popup(options: Ipopup) {
  return new Popup(options)
}

export default popup