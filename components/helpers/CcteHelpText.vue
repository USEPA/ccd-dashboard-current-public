<script setup lang="ts">
import {mdbPopover, mdbIcon} from 'mdbvue';
import {
  ref, onMounted, watch, computed,
} from 'vue';
import {storeToRefs} from 'pinia';
import {useContext} from '@nuxtjs/composition-api';
import {useHelpTexts} from '~/stores/helpTexts';
import {HelpObj} from './types';


const helpTextsStore = useHelpTexts();

const helpText = ref < HelpObj | Record<string, never>>({});

const {getHelpTexts} = storeToRefs(helpTextsStore);

const props = defineProps({
  appendBody: {type: Boolean, default: true},
  labelType: {type: String, default: 'h1'},
  helpKey: {type: String, default: ''},
  headingText: {type: String, default: ''},
  size: {type: String, default: 'lg'},
  cyData: {type: String, default: 'helptext'},
});

const vueContext: any = useContext();
const getHelp = async(): Promise<HelpObj | Record<string, never>> => {
  let help = null;
  help = await helpTextsStore.getById(props.helpKey, vueContext.$sentry);
  if (help) {
    let icon;
    let trigger;
    let placement;
    switch (help.iconType) {
    case 'Video':
      icon = 'youtube-play';
      trigger = 'click';
      break;
    case 'Information':
      icon = 'info-circle';
      trigger = 'hover';
      break;
    case 'Help':
      icon = 'question-circle';
      trigger = 'hover';
      break;
    default:
      icon = 'info-circle';
      trigger = 'hover';
    }
    switch (help.helpPosition) {
    case 'right':
      placement = {placement: 'right'};
      break;
    case 'bottom':
      placement = {placement: 'bottom'};
      break;
    default:
      placement = {placement: 'right'};
    }

    const helpObj = {
      icon: icon,
      trigger: trigger,
      text: help.helpText,
      placement,
    };
    return helpObj;
  }
  return {};
};

watch(getHelpTexts, async(newVal, oldVal) => {
  if (newVal.length > oldVal.length) {
    helpText.value = await getHelp();
  }
});

onMounted(async() => {
  helpText.value = await getHelp();
});

const helpTextTrigger = computed(() => helpText.value?.trigger || 'hover');

const getLabelComponentType = computed(() => props.labelType);

</script>

<template>
  <client-only>
    <div>
      <div v-if="helpText.text?.length > 0">
        <mdbPopover
          v-show="helpText && helpText.trigger"
          data-cy="helpText"
          :append-to-body="appendBody"
          :trigger="helpTextTrigger"
          :options="helpText.placement"
        >
          <span
            slot="header"
            data-cy="helpTextHeader"
          >{{ headingText }}</span>
          <span slot="body" data-cy="helpTextBody" v-html="helpText.text" />
          <span slot="reference" class="d-flex align-content-start flex-wrap popoverLabel">
            <component :is="getLabelComponentType" :helptext-id="helpKey" class="popoverLabel">
              {{ headingText }}
            </component>
            <mdbIcon :class="'ml-2'" :icon="helpText.icon" />
          </span>
        </mdbPopover>
      </div>
      <span v-else>
        <component :is="getLabelComponentType" class="popoverLabel" data-cy="headerText">
          {{ headingText }}
        </component>
      </span>
    </div>
  </client-only>
</template>

<style scoped lang="scss">
@import "~/assets/styles/_custom-variables.scss";
@import "~/assets/styles/global-styles.scss";

.widen {
  max-width: 700px !important;
}

.popoverLabel {
  width: fit-content;
}

.fa-info-circle {
  color: rgb(33, 37, 41) !important;
}
</style>

