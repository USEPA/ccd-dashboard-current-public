<template>
  <mdb-modal data-cy="ccte-feedback" :show="visibility" info removeBackdrop @close="toggleVisibility">
    <form id="ccte-feedback" ref="feedbackForm" class="needs-validation" @submit.prevent="processFeedback">
      <mdb-modal-header class="primary-color lighten-1" :close="true">
        <h3 class="white-text "><i class="fas fa-envelope mr-4"></i>Feedback</h3>
      </mdb-modal-header>
      <mdb-modal-body>
        <!--Header-->
        <!--Body-->
        <input v-model="feedback.importantInfo" type="hidden" name="important-info" value="feedback.importantInfo">
        <mdb-input
          v-model="feedback.emailAddress"
          basic
          placeholder="Your email"
          class="grey-text  mt-3"
          type="email"
          aria-label="your email"
          aria-role="textbox"
          contenteditable="true"
          aria-placeholder="Your email"
          name="feedback-email"
          value="feedback.emailAddress"
          required
        >
          <span slot="prepend" class="input-group-text"><i class="fas fa-envelope" /></span>
          <div class="invalid-feedback">
            {{ emailError }}
          </div>
        </mdb-input>

        <div class="input-group mt-3">
          <div class="input-group-prepend">
            <span id="basic-addon" class="input-group-text">
              <i class="fas fa-edit fa-1x " />
            </span>
          </div>
          <textarea
            id="feedback-message"
            ref="textarea"
            v-model="feedback.message"
            class="form-control"
            placeholder="Message"
            aria-label="message"
            aria-role="textarea"
            contenteditable="true"
            aria-placeholder="message"
            name="feedback-message"
            rows="5"
            value="feedback.message"
            required
          />
          <div class="invalid-feedback">
            {{ messageError }}
          </div>
        </div>
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn color="primary" data-cy="feedback-send" :disabled="checkForm === false" type="submit" icon="paper-plane" iconRight iconClass="ml-1 white-text">Send</mdb-btn>
      </mdb-modal-footer>
    </form>
  </mdb-modal>
  <!--Form with header-->
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbInput,
  mdbTextarea,
  mdbBtn,
  mdbIcon,
  mdbModal,
  mdbModalHeader,
  mdbModalBody,
  mdbModalFooter,
} from 'mdbvue'

export default {
  name: 'CcteFeedback',
  components: {
    mdbInput,
    mdbBtn,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter,
  },
  props: {
    visibility: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      feedback: {
        emailAddress: '',
        importantInfo: '',
        message: '',
      },
      emailError: 'Please provide a valid email address.',
      messageError: 'Please enter a message longer than ten characters.',
    }
  },
  computed: {
    checkForm() {
      if (this.feedback.message.length > 9) {
        return true
      }
      return false
    },

  },
  methods: {
    toggleVisibility() {
      this.$emit('toggleVisibility')
    },
    processFeedback(evt) {
      if (this.feedback.importantInfo.length > 0) {
        this.$emit('toggleVisibility')
      } 
      // return this.feedback
      const params = {
        emailAddress: this.feedback.emailAddress,
        message: this.feedback.message,
      }
      if (this.$refs.feedbackForm.checkValidity()) {
        evt.target.classList.add('was-validated')
        if (this.feedback.importantInfo.length === 0 && this.feedback.message.length >= 10) {
          this.createFeedback(params)
        }
      }
    },
    async createFeedback(params) {
      try {
        const result = await this.$repositories.feedback.create({
          emailAddress: params.emailAddress,
          message: params.message,
        })
        this.$emit('toggleVisibility')
      } catch (errs) {
        const errorObject = this.getErrorMsg(errs)
        this.$notify.error({message: `${errorObject.message} - ${errorObject.statusText}`, position: 'top right', timeOut: 5000})
        
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .input-group.md-form.form-1 input{
    border: 1px solid #bdbdbd;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  .input-group-text {
   align-items: flex-start !important;
    }

a.close:not([href]):not([tabindex]), a.close:not([href]):not([tabindex]):focus, a.close:not([href]):not([tabindex]):hover {
    color: snow !important;
  }
.close {
    color: snow !important;
  }
</style>

