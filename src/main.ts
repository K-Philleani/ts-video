import './index.css'
import popup from './components/popup/index'
import video from './components/video/index'

let listItem: NodeListOf<Element> = document.querySelectorAll('#list li')

for (let i=0; i<listItem.length; i++) {
  listItem[i].addEventListener('click', function() {
    let url:string = this.dataset.url
    let title:string = this.dataset.title
    popup({
      width: '880px',
      height: '556px',
      title,
      position: 'center',
      mask: true,
      content: (elem) => {
        video({
          url,
          elem,
          autoplay: true
        })
      }
    })
  })
}