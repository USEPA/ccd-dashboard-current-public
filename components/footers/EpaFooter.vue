<template>
  <footer class="main-footer clearfix" role="contentinfo" :style="style">
    <div class="main-footer__inner">
      <div class="region-footer">
        <div id="block-pane-epa-global-footer" class="block-pane-epa-global-footer">
          <div class="row cols-3">
            <div class="col size-1of3">
              <h2>
                Discover.
              </h2>
              <ul class="menu">
                <li class="menu__item">
                  <a href="https://www.epa.gov/accessibility/epa-accessibility-statement" class="menu__link">Accessibility Statement</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/planandbudget" class="menu__link">Budget &amp; Performance</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/contracts" class="menu__link">Contracting</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/utilities/wwwepagov-snapshots" class="menu__link">EPA www Web Snapshot</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/grants" class="menu__link">Grants</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/ocr/whistleblower-protections-epa-and-how-they-relate-non-disclosure-agreements-signed-epa" class="menu__link">No FEAR Act Data</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/web-policies-and-procedures/plain-writing" class="menu__link">Plain Writing</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/privacy" class="menu__link">Privacy</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/privacy/privacy-and-security-notice" class="menu__link">Privacy and Security Notice</a>
                </li>
              </ul>
            </div>
            <div class="col size-1of3">
              <h2>
                Connect.
              </h2>
              <ul class="menu">
                <li class="menu__item">
                  <a href="https://www.data.gov/" class="menu__link">Data.gov<span class="usa-tag external-link__tag" title="Exit EPA Website"><span aria-hidden="true">Exit</span><span class="u-visually-hidden"> Exit EPA Website</span></span></a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/office-inspector-general/about-epas-office-inspector-general" class="menu__link">Inspector General</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/careers" class="menu__link">Jobs</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/newsroom" class="menu__link">Newsroom</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/data" class="menu__link">Open Government</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.regulations.gov/" class="menu__link">Regulations.gov<span class="usa-tag external-link__tag" title="Exit EPA Website"><span aria-hidden="true">Exit</span><span class="u-visually-hidden"> Exit EPA Website</span></span></a>
                </li>
                <li class="menu__item">
                  <a href="https://www.epa.gov/newsroom/email-subscriptions-epa-news-releases" class="menu__link">Subscribe</a>
                </li>
                <li class="menu__item">
                  <a href="https://www.usa.gov/" class="menu__link">USA.gov<span class="usa-tag external-link__tag" title="Exit EPA Website"><span aria-hidden="true">Exit</span><span class="u-visually-hidden"> Exit EPA Website</span></span></a>
                </li>
                <li class="menu__item">
                  <a href="https://www.whitehouse.gov/" class="menu__link">White House<span class="usa-tag external-link__tag" title="Exit EPA Website"><span aria-hidden="true">Exit</span><span class="u-visually-hidden"> Exit EPA Website</span></span></a>
                </li>
              </ul>
            </div>
            <div class="col size-1of3">
              <h2>
                Ask.
              </h2>
              <ul class="menu">
                <li>
                  <a href="https://www.epa.gov/home/forms/contact-epa" class="menu__link">Contact EPA</a>
                </li>
                <li>
                  <a href="https://www.epa.gov/web-policies-and-procedures/epa-disclaimers" class="menu__link">EPA Disclaimers</a>
                </li>
                <li>
                  <a href="https://www.epa.gov/aboutepa/epa-hotlines" class="menu__link">Hotlines</a>
                </li>
                <li class="last_list">
                  <a href="https://www.epa.gov/foia" class="menu__link">FOIA Requests</a>
                </li>
                <li class="last_list">
                  <a href="https://www.epa.gov/home/frequent-questions-specific-epa-programstopics" class="menu__link">Frequent Questions</a>
                </li>
              </ul>
              <h2>
                Follow.
              </h2>
              <ul class="social-menu">
                <li><a class="menu-link social-facebook" href="https://www.facebook.com/EPA">EPA's Facebook</a></li>
                <li><a class="menu-link social-twitter" href="https://twitter.com/epa">EPA's Twitter</a></li>
                <li><a class="menu-link social-youtube" href="https://www.youtube.com/user/USEPAgov">EPA's YouTube</a></li>
                <li><a class="menu-link social-flickr" href="https://www.flickr.com/photos/usepagov">EPA's Flickr</a></li>
                <li><a class="menu-link social-instagram" href="https://www.instagram.com/epagov">EPA's Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex';

export default {
  computed: {
    style() {
      return `position:${this.pos};margin-top: 10px`;
    },
  },
};
</script>

<style scoped src="@/assets/styles/oneepastyle.css">
</style>
