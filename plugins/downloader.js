import Vue from 'vue'

Vue.mixin({methods: {
  fileDownloader(fileName, content) {
    // Internet Explorer
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(content, fileName)
    } else {
      // Other Browsers
      const element = document.createElement('a')
      const url1 = window.URL.createObjectURL(content)
      element.setAttribute('href', url1)
      element.setAttribute('download', fileName)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.dispatchEvent(new MouseEvent('click', {
        bubbles: false,
        cancelable: true,
        view: window,
      }))
      document.body.removeChild(element)
      window.setTimeout(() => {
        window.URL.revokeObjectURL(url1)
      }, 0)
    }
  },

}})


