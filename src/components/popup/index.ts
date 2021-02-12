
let styles = require('./index.css')
// import styled from './index.css'

interface Ipopup {
  width?: string
  height?: string
  title?: string
  position?: string
  mask?: boolean
  content?: (content: HTMLElement) => void
}

interface Icomponent {
  tempContainer: HTMLElement
  init: () => void
  template: () => void
  handle: () => void
}


class Popup implements Icomponent{
  tempContainer
  mask
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
    this.settings.mask && this.createMask()
    this.handle()
    this.contentCallback()
  }
  // 创建模板
  template() {
    this.tempContainer = document.createElement('div')
    this.tempContainer.className = styles.default.popup
    this.tempContainer.style.width = this.settings.width
    this.tempContainer.style.height = this.settings.height
    this.tempContainer.innerHTML = `
      <div class="${styles.default['popup-title']}">
        <h3>${this.settings.title}</h3>
        <i class="icon iconfont icon-guanbi"></i>
      </div>
      <div class="${styles.default['popup-content']}"></div>
    `
    document.body.appendChild(this.tempContainer)
    if (this.settings.position === 'left') {
      this.tempContainer.style.left = 0
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px'
    } else if (this.settings.position === 'right') {
      this.tempContainer.style.right = 0
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px'
    } else {
      this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px'
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px'
    }
  }
  // 时间操作
  handle() {
    let popupClose = this.tempContainer.querySelector(`.${styles.default['popup-title']} i`)
    popupClose.addEventListener('click', () => {
      document.body.removeChild(this.tempContainer)
      this.settings.mask && document.body.removeChild(this.mask)
    })
  }
  createMask() {
    this.mask = document.createElement('div')
    this.mask.className = styles.default.mask
    this.mask.style.width = '100%'
    this.mask.style.height = document.body.offsetHeight + 'px'
    document.body.appendChild(this.mask)
  }
  contentCallback() {
    let popupContent = this.tempContainer.querySelector(`.${styles.default['popup-content']}`)
    this.settings.content(popupContent)
  }
}

function popup(options: Ipopup) {
  return new Popup(options)
}

export default popup