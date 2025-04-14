<template>
  <div>
    <h1 v-if="sent">
      {{ successMessage }}
    </h1>
    <form v-else id="ccte-contact" ref="contactForm" class="needs-validation" @submit.prevent="processcontact">
      <article v-if="selectedObj.text.length" class="selectedInfo is-primary">
        <div class="selected-header">
          <p>Details to be submitted with your comment</p>
        </div>
        <div class="message-body">
          <strong>Text selected: </strong><span>{{ selectedObj.text }}</span>
          <br>
          <strong>Found On: </strong><span>{{ getDate() }}</span>
          <br>
          <strong>Original Query: </strong><span>{{ getUrl() }}</span>
          <br>
          <strong>Full Url: </strong><span>{{ getFullUrl() }}</span>
          <br>
          <strong>Browser: </strong><span>{{ formatBrowserInfo() }}</span>
        </div>
      </article>
      <input v-model="contact.importantInfo" type="hidden" name="important-info" value="contact.importantInfo">
      <mdb-input
        v-model="contact.emailAddress"
        basic
        placeholder="Your email"
        class="contact-email  mt-3"
        type="email"
        aria-label="your email"
        aria-role="textbox"
        contenteditable="true"
        aria-placeholder="Your email"
        name="contact-email"
        value="contact.emailAddress"
        required
      >
        <span slot="prepend" class="input-group-text"><i class="fas fa-envelope" /></span>
        <div class="invalid-feedback">
          {{ emailError }}
        </div>
      </mdb-input>
      <mdb-input
        v-model="contact.subject"
        basic
        placeholder="Subject"
        class="grey-text mt-3"
        type="text"
        aria-label="Subject"
        aria-role="textbox"
        contenteditable="true"
        aria-placeholder="Subject"
        name="contact-subject"
        value="contact.subject"
        :style="{ display: subjectFieldVisible }"
      >
        <span slot="prepend" class="input-group-text">
          <i class="far fa-file-alt" />
        </span>
      </mdb-input>
      <div class="input-group mt-3">
        <div class="input-group-prepend">
          <span id="basic-addon" class="input-group-text">
            <i class="fas fa-edit fa-1x" color="primary" />
          </span>
        </div>
        <textarea
          id="contact-message"
          ref="textarea"
          v-model="contact.message"
          class="form-control"
          type="textarea"
          placeholder="Message - please no email addresses"
          aria-label="message"
          aria-role="textarea"
          contenteditable="true"
          aria-placeholder="message"
          :is-valid="checkMessageForEmail"
          name="contact-message"
          rows="3"
          value="contact.message"
          required
        />
        <div class="invalid-feedback">
          {{ messageError }}
        </div>
      </div>
      <mdb-btn
        class="send-btn"
        color="primary"
        data-cy="contact-send"
        :disabled="checkForm === false"
        type="submit"
        icon="paper-plane"
        icon-right
        icon-class="ml-1 white-text"
      >
        Send
      </mdb-btn>
    </form>
  </div>
</template>
<script>
import {
  mapGetters,
} from 'vuex';
import {
  mdbInput,
  mdbBtn,
} from 'mdbvue';
import {format} from 'date-fns';

export default {
  name: 'CcteContactForm',
  components: {
    mdbInput,
    mdbBtn,
  },
  props: {
    formTitle: {
      type: String,
      default: 'Contact',
    },
    formType: {
      type: String,
      default: 'feedback',
    },
    selected: {
      type: Object,
      default: () => ({
        text: '',
      }),
    },
  },
  data() {
    return {
      contact: {
        emailAddress: '',
        subject: '',
        importantInfo: '',
        message: '',
      },
      subjectFieldVisible: '',
      subjectFieldRequired: true,
      emailError: 'Please provide a valid email address.',
      messageError: 'Please enter a message longer than ten characters with no email addresses.',
      formTypeService: this.formType,
      recaptchResponse: '',
      selectedObj: this.selected,
      successMessage: '',
      sent: false,

    };
  },
  head() {
    return {
      title: 'Contact Form',
      meta: [],
    };
  },
  computed: {
    checkForm() {
      if (this.contact.message.length > 9) {
        return true;
      }
      return true;
    },
    ...mapGetters({
      getActive: 'results/getActive',
    }),
    chemical() {
      return this.getActive();
    },
  },
  created() {
    this.subjectFieldVisible = this.formType === 'comments' ? 'none' : '';
  },
  mounted() {
    this.selectedObj = this.selected;
  },
  methods: {
    processcontact(evt) {
      let params;
      if (this.formTypeService === 'feedback') {
        params = {
          email: this.contact.emailAddress,
          subject: this.contact.subject,
          message: this.contact.message,
        };
      }
      if (this.formTypeService === 'comments') {
        // only include dtxsid info on chemical specific pages
        if (this.$route.params.id && (this.$route.params.id.includes('DTXSID') || this.$route.params.id.includes('DTXCID'))) {
          params = {
            email: this.contact.emailAddress,
            comment: this.contact.message,
            gsId: this.chemical.gsid,
            chemName: this.chemical.preferredName,
            dtxsid: this.chemical.dtxsid,
            annotationText: this.selectedObj.text,
            annotationDtxsid: this.chemical.dtxsid,
            annotationLocationUrl: this.getUrl(),
            fullUrl: this.getFullUrl(),
            annotation_browser_info: this.formatBrowserInfo(),
          };
        } else {
          params = {
            email: this.contact.emailAddress,
            comment: this.contact.message,
            annotationText: this.selectedObj.text,
            fullUrl: this.getFullUrl(),
            annotationLocationUrl: this.getUrl(),
            annotation_browser_info: this.formatBrowserInfo(),
          };
        }
      }
      if (this.$refs.contactForm.checkValidity()) {
        let messageChecked = this.checkMessageForEmail(evt);
        if (messageChecked) {
          evt.target.classList.add('was-validated');
          if (this.contact.importantInfo.length === 0 && this.contact.message.length >= 10) {
            this.createcontact(params);
          }
        }
      }
    },
    checkMessageForEmail(evt) {
      // eslint-disable-next-line prefer-destructuring
      if (this.contact.message.length > 10) {
        let {message} = this.contact;
        let emailsArray = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (emailsArray != null && emailsArray.length) {
          this.$notify.error({
            message: `${this.messageError}`,
            position: 'top center',
            timeOut: 5000,
          });
          return false;
        }
        return true;
      }
      return false;
    },
    async createcontact(params) {
      try {
        const result = await this.$repositories[this.formTypeService].create(params);
        if (this.formTypeService === 'feedback') {
          this.$notify.success({message: 'Feedback sent successfully'});
          this.successMessage = 'Thank you for your feedback.';
        } else if (this.formTypeService === 'comments') {
          this.successMessage = 'Thank you for your comment. Someone will review and respond to your comment soon.';
          this.$notify.success({message: this.successMessage});
        }
        this.sent = true;
        this.$emit('closeModal');
      } catch (errs) {
        const errorObject = this.getErrorMsg(errs);
        this.$sentry.captureMessage(`Couldn't make a comment request in contact form - error :  ${errs}`);
        this.$notify.error({
          message: `${errorObject.message} - ${errorObject.statusText}`, position: 'top right', timeOut: 5000,
        });
      }
    },
    getDate() {
      return format(new Date(), 'MMMM dd yyyy, h:mm:ss a');
    },
    getUrl() {
      if (window) {
        return window.location.pathname;
      }
      return null;
    },
    getFullUrl() {
      if (window) {
        return window.location.href;
      }
      return null;
    },
    formatBrowserInfo() {
      if (navigator) {
        return `${navigator.appCodeName} on ${navigator.platform}`;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  form {
    background-color: white;
    padding: 10px;
  }
  .mdb-toast .mdb-warn .mdb-toast-message {
    font-weight: 600 !important;
    font-size: 1rem !important;
  }
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
  .send-btn {
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .contact-email {
      color: grey;
  }
  .selectedInfo{
      strong {
          font-size: .9rem;
      }
      span {
          font-size: .9rem;
      }
  }
  .selected-header {
      font-weight: bold;
  }
</style>
