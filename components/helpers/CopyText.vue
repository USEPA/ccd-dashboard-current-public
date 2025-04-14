<template>
  <div>
    <mdb-btn
      v-if="copyType==='gridbutton'"
      size="sm"
      class="blue lighten-1 m-0"
      data-cy="copyUrlBtn"
      @click="doCopy"
    >
      <mdb-icon far icon="copy" @click="doCopy" class="white-text" />
      <span class="hide-responsive">Copy Url</span>
    </mdb-btn>
    <button v-else-if="copyType==='button'" type="button" class="btn blue lighten-1 btn-md" @click="doCopy">
      <mdb-icon far icon="copy" class="white-text" />
    </button>
    <mdb-btn
      v-else-if="copyType==='assayDetails'"
      color="primary"
      class="p-1 pl-2 pr-2 assayDetails"
      :title="tipText"
      :active="active"
      @click="doCopy"
    >
      <mdb-icon fa icon="copy" size="2x" class="white-text" />
    </mdb-btn>
    <mdb-btn
      v-else
      tag="a"
      class="mt-1"
      gradient="blue"
      floating
      size="sm"
      :title="tipText"
      @click="doCopy"
    >
      <mdb-icon fa icon="copy" class="white-text" />
    </mdb-btn>
  </div>
</template>

<script>
import {mdbIcon, mdbBtn} from 'mdbvue'

export default {
  name: 'CopyText',
  components: {
    mdbIcon,
    mdbBtn,
  },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    toCopy: {
      default: () => null,
    },
    // eslint-disable-next-line vue/require-prop-types
    copyData: {
      default: () => null,
    },
    tipText: {
      type: String,
      default: () => '',
    },
    copyType: {
      type: String,
      default: () => '',
    },
    id: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      copying: false,
      copied: false,
      defaultText: 'Copy to Clipboard',
      copyUrl: '',
      active: false,

    }
  },
  computed: {
    titleText() {
      return this.tipText ? this.tipText : this.defaultText
    },
  },
  methods: {
    doCopy(e) {
      const icon = e.$el.children[0] || ''
      if (this.copyData) {
        this.copyTextFn()
      } else {
        this.copyToClipboard()
      }
      this.toggleActiveState(icon)
    },
    copyToClipboard() {
      this.copying = true
      const textarea = document.createElement('textarea')
      textarea.value = this.toCopy
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        this.copying = false
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 1500)
      } catch (err) {
        console.log(`Cannot copy: ${err}`)
      }
      document.body.removeChild(textarea)
    },
    copyTextFn() {
      let textToCopy = ''
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
          textToCopy += `${tmpLine}\n`
          tmpLine = ''
        })
      } else {
        Object.keys(this.copyData).forEach((k, keyIndex) => {
          textToCopy += `${k} ${this.copyData[k]}\n`
        })
      }
      const tag = document.createElement('textarea')
      const text = document.createTextNode(textToCopy)
      tag.setAttribute('id', `${this.id}copy-textarea`)
      tag.append(text)
      const element = document.getElementById(`${this.id}copy-div`)
      document.body.appendChild(tag)
      const selectTextEl = document.getElementById(`${this.id}copy-textarea`)
      selectTextEl.select()
      document.execCommand('copy')
      document.body.removeChild(tag)
    },
    toggleActiveState(icon) {
      let hasFar = false
      icon.classList.remove('fa-copy')
      if (icon.classList.contains('far')) {
        hasFar = true
        icon.classList.remove('far')
        icon.classList.add('fas')
      }
      icon.classList.add('fa-check')
      this.active = !this.active
      setTimeout(() => {
        this.active = false
        icon.classList.remove('fa-check')
        icon.classList.add('fa-copy')
        if (hasFar) {
          icon.classList.remove('fas')
          icon.classList.add('far')
        }
      }, 2000)
    },
  },
}
</script>

<style scoped>
.icon {
  display: block;
}

.invisible {
  visibility: hidden;
}

.fa {
  width: 1em;
  transition: opacity .3s;
}

.fa-check {
  color: green;
}

.check-enter-active.fa-check {
  animation: bounce-in .5s;
}

.check-enter.fa-clipboard, .check-leave-to.fa-check {
  opacity: 0;
}
.assayDetails.btn {
  border-radius: 0.5rem !important;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
