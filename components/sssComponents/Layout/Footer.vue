<template>
  <footer class="main-footer clearfix" role="contentinfo" style="margin-top: 10px">
    <div class="main-footer__inner">
      <div class="region-footer">
        <div id="block-pane-epa-global-footer" class="block-pane-epa-global-footer">
          <div class="row cols-3">
            <div class="col size-1of3">
              <div class="col__title">
                Discover.
              </div>
              <ul class="menu">
                <li><a href="https://www.epa.gov/accessibility">Accessibility</a></li>
                <li><a href="https://www.epa.gov/aboutepa/epas-administrator">EPA Administrator</a></li>
                <li><a href="https://www.epa.gov/planandbudget">Budget &amp; Performance</a></li>
                <li><a href="https://www.epa.gov/contracts">Contracting</a></li>
                <li><a href="https://www.epa.gov/home/grants-and-other-funding-opportunities">Grants</a></li>
                <li><a href="https://19january2017snapshot.epa.gov">January 19, 2017 Web Snapshot</a></li>
                <li><a href="https://www.epa.gov/ocr/whistleblower-protections-epa-and-how-they-relate-non-disclosure-agreements-signed-epa-employees">No FEAR Act Data</a></li>
                <li><a href="https://www.epa.gov/privacy">Privacy</a></li>
              </ul>
            </div>
            <div class="col size-1of3">
              <div class="col__title">
                Connect.
              </div>
              <ul class="menu">
                <li><a href="https://www.data.gov/">Data.gov</a></li>
                <li><a href="https://www.epa.gov/office-inspector-general/about-epas-office-inspector-general">Inspector General</a></li>
                <li><a href="https://www.epa.gov/careers">Jobs</a></li>
                <li><a href="https://www.epa.gov/newsroom">Newsroom</a></li>
                <li><a href="https://www.epa.gov/open">Open Government</a></li>
                <li><a href="https://www.regulations.gov/">Regulations.gov</a></li>
                <li><a href="https://www.epa.gov/newsroom/email-subscriptions">Subscribe</a></li>
                <li><a href="https://www.usa.gov/">USA.gov</a></li>
                <li><a href="https://www.whitehouse.gov/">White House</a></li>
              </ul>
            </div>
            <div class="col size-1of3">
              <div class="col__title">
                Ask.
              </div>
              <ul class="menu">
                <li><a href="https://www.epa.gov/home/forms/contact-us">Contact EPA</a></li>
                <li><a href="https://www.epa.gov/home/epa-hotlines">Hotlines</a></li>
                <li><a href="https://www.epa.gov/foia">FOIA Requests</a></li>
                <li><a href="https://www.epa.gov/home/frequent-questions-specific-epa-programstopics">Frequent Questions</a></li>
              </ul>
              <div class="col__title">
                Follow.
              </div>
              <ul class="social-menu">
                <li><a class="menu-link social-facebook" href="https://www.facebook.com/EPA">EPA's Facebook</a></li>
                <li><a class="menu-link social-twitter" href="https://twitter.com/epa">EPA's Twitter</a></li>
                <li><a class="menu-link social-youtube" href="https://www.youtube.com/user/USEPAgov">EPA's YouTube</a></li>
                <li><a class="menu-link social-flickr" href="https://www.flickr.com/photos/usepagov">EPA's Flickr</a></li>
                <li><a class="menu-link social-instagram" href="https://www.instagram.com/epagov">EPA's Instagram</a></li>
              </ul>
              <p class="last-updated">
                Last updated on {Month day, YYYY}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters({
      currentStep: 'getStep',
    }),
    pos() {
      return this.currentStep < 3 ? 'fixed' : 'relative'
    },
  },
}
</script>

<style  scoped src="@/assets/styles/oneepa/oneepastyle.css">
</style>
