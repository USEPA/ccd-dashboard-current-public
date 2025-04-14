<template>
  <div>
    <div :id="`${id}copy-div`" />
    <button @click="copyTextFn">
      <i class="far fa-copy" />
    </button>
  </div>
</template>
<script>
export default {
  name: 'CopyButton',
  // eslint-disable-next-line vue/require-prop-types
  props: ['id', 'copyData'],
  methods: {
    copyTextFn() {
      let copyText = ''
      let tmpLine = ''

      if (Array.isArray(this.copyData)) {
        this.copyData.forEach((c, columnIndex) => {
          tmpLine += ''
          const numberOfKeys = Object.keys(c).length
          Object.keys(c).forEach((k, keyIndex) => {
            if (keyIndex + 1 < numberOfKeys) {
              tmpLine += `${c[k]} `
            } else {
              tmpLine += `${c[k]}`
            }
          })
          copyText += `${tmpLine}\n`
          tmpLine = ''
        })
      } else {
        Object.keys(this.copyData).forEach((k, keyIndex) => {
          copyText += `${k} ${this.copyData[k]}\n`
        })
      }
      const tag = document.createElement('textarea')
      const text = document.createTextNode(copyText)
      tag.setAttribute('id', `${this.id}copy-textarea`)
      tag.append(text)
      const element = document.getElementById(`${this.id}copy-div`)
      // element.appendChild(tag)
      const textarea = document.getElementById(`${this.id}copy-textarea`)
      textarea.select()
      document.execCommand('copy')
      element.removeChild(tag)
    },
  },
}
</script>
<style lang="scss" scoped>
textarea {
  position: absolute;
  left: -1000px;
  top: -1000px;
}
</style>
