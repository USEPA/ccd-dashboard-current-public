<template>
  <div id="socialLinks" class="pr-2" data-cy="socialLinks">
    <mdb-btn-group vertical>
      <mdb-btn
        title="Twitter"
        tag="a"
        :href="twitterLink()"
        target="_blank"
        floating
        class="btn-tw mr-0 mb-1"
        icon="twitter"
        fab
        size="sm"
      />
      <mdb-btn
        title="Facebook"
        tag="a"
        :href="facebookLink()"
        target="_blank"
        floating
        class="btn-tw mr-0"
        icon="facebook-f"
        fab
        size="sm"
      />
      <mdb-btn
        title="Email"
        tag="a"
        :href="mailLink()"
        floating
        class="btn-tw mr-0"
        icon="envelope"
        far
        size="sm"
      />
    </mdb-btn-group>
  </div>
</template>
<script>
import {
  mdbBtnGroup,
  mdbBtn,
  mdbIcon,
} from 'mdbvue';

export default {
  name: 'ShareLinks',
  components: {
    mdbBtnGroup,
    mdbBtn,
  },
  data() {
    return {
      isError: false,
      currentUrl: '',
      shareSites: [
        {
          name: 'Facebook',
          icon: 'fab fa-facebook',
          baseUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
        },
        {
          name: 'Twitter',
          icon: 'fab fa-twitter',
          baseUrl: 'https://twitter.com/home?status=',
        },
      ],
    };
  },
  methods: {
    capitalizer(str) {
      let retStr = str.split(' ');
      // eslint-disable-next-line no-plusplus
      for (let i = 0, x = retStr.length; i < x; i++) {
        retStr[i] = retStr[i][0].toUpperCase() + retStr[i].substr(1);
      }
      return retStr.join(' ');
    },
    getCurrentPageUrl() {
      const pageUrl = `${process.env.APPLICATION_EXTERNAL_LINK_URL}/dashboard${this.$route.path}${this.getQueryStr()}`;
      return pageUrl;
    },
    getQueryStr() {
      const qsVals = Object.values(this.$route.query) || [];
      const qsKeys = Object.keys(this.$route.query) || [];
      if (typeof qsKeys[0] !== 'undefined') {
        return `?${qsKeys[0]}=${qsVals[0]}&${qsKeys[1]}=${qsVals[1]}`;
      }
      return '';
    },
    twitterLink() {
      const tweetLink = `https://twitter.com/home?status=${this.getCurrentPageUrl()}`;
      return tweetLink;
    },
    facebookLink() {
      const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${this.getCurrentPageUrl()}`;
      return fbLink;
    },
    mailLink() {
      const locationInApp = this.getCurrentPageUrl();
      let locationText = 'Comptox Chemicals Dashboard';
      switch (locationInApp) {
      case 'news':
      case 'downloads':
        locationText = this.capitalizer(locationInApp);
        break;
      case 'chemical-lists':
        locationText = 'Lists of Chemicals';
        break;
      case 'assay-endpoints':
        locationText = 'Lists of Assays';
        break;
      case 'chemical/':
        locationText = 'Lists of Assays';
        break;
      default:
        locationText = 'Comptox Chemicals Dashboard';
      }

      const subject = `${process.env.APPLICATION_TITLE} - ${locationText}`;
      const emLink = `mailto:?subject=${subject}&body=${this.getCurrentPageUrl()}`;

      return emLink;
    },

  },
};
</script>

<style lang="scss" scoped>
@import "./assets/styles/custom-variables.scss";
#socialLinks {
  position: fixed;
  background-color: $toolbar-color;
  top: 30%;
  right: 2px;
  -webkit-border-radius: 4px 0 0 4px;
  border-radius: 8px 0 0 8px;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

/* Style the icon bar links */
.icon-bar a {
  display: block;
  text-align: center;
  padding: 16px;
  transition: all 0.3s ease;
  color: white;
  font-size: 20px;
}

/* Style the social media icons with color, if you want */
.icon-bar a:hover {
  background-color: #000;
}

.facebook {
  background: #3B5998;
  color: white;
}

.twitter {
  background: #55ACEE;
  color: white;
}

.google {
  background: #dd4b39;
  color: white;
}

.linkedin {
  background: #007bb5;
  color: white;
}

.youtube {
  background: #bb0000;
  color: white;
}
.btn-floating.btn-sm {
    width: 29px;
    height: 28px;
}
</style>
