let styled = require('./index.css')


interface Ivideo {
    url: string
    elem: string | HTMLElement
    width?: string
    height?: string
    autoplay?: boolean
}

interface Icomponent {
  tempContainer: HTMLElement
  init: () => void
  template: () => void
  handle: () => void
}


class Video implements Icomponent{
  tempContainer
  constructor(private settings: Ivideo) {
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      aytuplay: false
    }, this.settings)
    this.init()
  }
  init() {
    this.template()
    this.handle()
  }
  template() {
    this.tempContainer = document.createElement('div')
    this.tempContainer.className = styled.default.video
    this.tempContainer.style.widht = this.settings.width
    this.tempContainer.style.height = this.settings.height
    this.tempContainer.innerHTML = `
      <video class="${styled.default['video-content']}" src="${this.settings.url}"></video>
      <div class="${styled.default['video-controls']}">
        <div class="${styled.default['video-progress']}">
          <div class="${styled.default['video-progress-now']}"></div>
          <div class="${styled.default['video-progress-suc']}"></div>
          <div class="${styled.default['video-progress-bar']}"></div>
        </div>
        <div class="${styled.default['video-play']}">
          <i class="iconfont icon-bofang"></i>
        </div>
        <div class="${styled.default['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div class="${styled.default['video-full']}">
          <i class="icon iconfont icon-quanping"></i>          
        </div>
        <div class="${styled.default['video-volume']}">
          <i class="icon iconfont icon-yinliang"></i>
          <div class="${styled.default['video-volprogress']}">
            <div class="${styled.default['video-volprogress-now']}"></div>
            <div class="${styled.default['video-volprogress-bar']}"></div>
          </div>
        </div>
      </div>
    `
    if (typeof this.settings.elem === 'object') {
      this.settings.elem.appendChild(this.tempContainer)
    } else {
      document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer)
    }
    
  }
  handle() {
    let videoContent: HTMLVideoElement = this.tempContainer.querySelector(`.${styled.default['video-content']}`)
    let videoControls = this.tempContainer.querySelector(`.${styled.default['video-controls']}`)
    let videoPlay = this.tempContainer.querySelector(`.${styled.default['video-controls']} i`)
    let videoTimes = this.tempContainer.querySelectorAll(`.${styled.default['video-time']} span`)
    let timer
    let videoFull = this.tempContainer.querySelector(`.${styled.default['video-full']} i`)
    let videoProgress = this.tempContainer.querySelectorAll(`.${styled.default['video-progress']} div`)
    let videoVolume = this.tempContainer.querySelectorAll(`.${styled.default['video-volprogress']} div`)

    videoContent.volume = 0.5

    if (this.settings.autoplay) {
      timer = setInterval(playing, 1000)
      videoContent.play()
    }

    this.tempContainer.addEventListener('mouseenter', function() {
      videoControls.style.bottom = 0
    })
    this.tempContainer.addEventListener('mouseleave', function () {
      videoControls.style.bottom = '-50px'
    })

    // 视频是否加载完毕
    videoContent.addEventListener('canplay',() => {
      videoTimes[1].innerHTML = formatTime(videoContent.duration)
    })
    videoContent.addEventListener('play', () => {
      videoPlay.className = 'icon iconfont icon-zantingtingzhi'
      timer = setInterval(playing, 1000)
    })
    videoContent.addEventListener('pause', () => {
      videoPlay.className = 'icon iconfont icon-bofang'
      clearInterval(timer)
    })
    // 播放暂停
    videoPlay.addEventListener('click', () => {
      if (videoContent.paused) {
        videoContent.play()
      } else {
        videoContent.pause()
      }
    })

    videoProgress[2].addEventListener('mousedown', function(event: MouseEvent) {
      let downX = event.pageX
      let downL = this.offsetLeft
      document.onmousemove = (event: MouseEvent) => {
        let scale = (event.pageX - downX + downL + 8) / this.parentNode.offsetWidth
        if (scale < 0) {
          scale = 0
        } else if (scale > 1) {
          scale = 1
        }
        videoProgress[0].style.width = scale * 100 + "%"
        videoProgress[1].style.width = scale * 100 + "%"
        this.style.left = scale * 100 + "%"
        videoContent.currentTime = scale * videoContent.duration
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      event.preventDefault()
    })
    
    // 全屏
    videoFull.addEventListener('click', () => {
      videoContent.requestFullscreen()
    })

    videoVolume[1].addEventListener('mousedown', function (event: MouseEvent) {
      let downX = event.pageX
      let downL = this.offsetLeft
      document.onmousemove = (event: MouseEvent) => {
        let scale = (event.pageX - downX + downL + 8) / this.parentNode.offsetWidth
        if (scale < 0) {
          scale = 0
        } else if (scale > 1) {
          scale = 1
        }
        videoVolume[0].style.width = scale * 100 + "%"
        this.style.left = scale * 100 + "%"
        videoContent.volume = scale
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
      event.preventDefault()
    })

    // 播放进度
    function playing() {
      let scale = videoContent.currentTime / videoContent.duration
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration
      videoTimes[0].innerHTML = formatTime(videoContent.currentTime)
      videoProgress[0].style.width = scale * 100 + "%"
      videoProgress[1].style.width = scaleSuc * 100 + "%"
      videoProgress[2].style.left = scale * 100 + "%"
    }
 

    function formatTime(time: number): string {
      time = Math.round(time)
      let min = Math.floor(time / 60)
      let sec = time % 60
      return setZero(min) + ":" + setZero(sec)
    }

    function setZero(time: number): string {
      if (time < 10) {
        return '0' + time
      }
      return String(time)
    }
  }

}


function video(options: Ivideo) {
  return new Video(options)
}

export default video