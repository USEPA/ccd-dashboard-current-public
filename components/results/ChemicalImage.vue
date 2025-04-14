<template>
  <div class="chemicalImage" :class="{level: !data.image}">
    <div v-if="!data.hasStructureImage && data.relatedStructureCount === null" class="relatedText">
      No image found for this structure.
    </div>
    <div v-else-if="!data.hasStructureImage && data.relatedStructureCount && data.relatedStructureCount !=0" class="relatedText">
      {{ data.relatedStructureCount }} related chemical structure{{ data.relatedStructureCount === 1 ? '' : 's' }} with this substance
    </div>
    <div v-else :class="{level: !data.image}">
      <div class="image">
        <img
          title=""
          class="image"
          :class="{border: border,
                   thumbnail: thumbnail,
                   small: small,
                   large: large,
                   full: full,
                   'img-fluid': fluid === true}"
          :src="imageUrl()"
        >
        <div
          v-if="!data.relatedStructureCount || data.relatedStructureCount !=0"
          class="magnify"
          data-cy="magnify"
          :class="{thumbnail: thumbnail, small: small, large: large, full: full}"
          @click.stop="magnify"
        >
          <i class="fas fa-search-plus" style="z-index:990" @click.stop="magnify" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex';

export default {
  name: 'ChemicalImage',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    border: {
      type: Boolean,
      default() {
        return false;
      },
    },
    fluid: {
      type: Boolean,
      default() {
        return false;
      },
    },
    height: {
      type: String,
      default() {
        return '160';
      },
    },
    thumbnail: {
      type: Boolean,
      default() {
        return false;
      },
    },
    small: {
      type: Boolean,
      default() {
        return false;
      },
    },
    large: {
      type: Boolean,
      default() {
        return false;
      },
    },
    full: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {
    ...mapState('results', ['selectedChemicals']),
    imageApi() {
      const path = this.apiSettings().CHEMICAL_IMAGE_API;
      return path;
    },
  },
  created() {
    if (this.data.genericSubstanceId) {
      this.data.name = this.data.preferredName;
      this.data.gsid = this.data.genericSubstanceId;
    }
  },
  methods: {
    ...mapMutations({
      setChemicalImage: 'results/setChemicalImage',
    }),
    magnify(item) {
      const id = this.data.dtxcid ? this.data.dtxcid : this.data.dtxsid;
      const imageBy = this.data.dtxcid ? 'by-dtxcid' : 'by-dtxsid';
      const chemicalInfo = {
        name: this.data.name,
        imageBy: imageBy,
        gsid: id,
        visible: true,
      };
      this.setChemicalImage(chemicalInfo);
    },
    imageUrl() {
      const imageBy = this.data.dtxcid ? 'by-dtxcid' : 'by-dtxsid';
      const id = this.data.dtxcid ? this.data.dtxcid : this.data.dtxsid;
      const url = `${process.env.APPLICATION_BASE_API}${this.imageApi}${imageBy}/${id}`;

      return url;
    },
  },
};

</script>

<style scoped lang="scss">

#chemicalImage.level {
  text-align: center;
  width: 100%;
}
.image {
  display: flex;
  max-width: 100%;

  &.related {
    margin-top: 1rem;
  }
}
.image.thumbnail {
  display: flex;
  max-width: 100%;
  width: 120px;
  height:120px;
  &.related {
    margin-top: 1rem;
  }
}
.image.small {
  display: flex;
  max-width: 100%;
  width: 200px;
  height: 200px;
  &.related {
    margin-top: 1rem;
  }
}
.image.large {
  display: flex;
  max-width: 100%;
  min-width: 300px;
  min-height: 300px;
  &.related {
    margin-top: 1rem;
  }
}
.image.full {
  display: flex;
  max-width: 100%;
  min-width: 95%;
  min-height: 95%;
  &.related {
    margin-top: 1rem;
  }
}
.border {
  border: 2px solid darkslategrey !important;
}

.magnify{
  position: relative;
  width:35px;
  bottom: -90%;
  left:-98%;
  align-content: flex-start;
  color:#bbb;
  font-size:16px;
  height:20px;
  cursor: pointer;
  z-index: 900;
  &.thumbnail {
    bottom: -95px;
    left:-75%;
  }
  &.small {
    bottom: -175px;
    left:-82%;
  }
  &.large {
    bottom: -280px;
    left:-92%;
  }
}
.relatedText{
  height:160px;
  font-size:16px;
  margin-top:24px;
  padding-top:40px;
}

@media print {
  #chemicalImage
  img {
  width: 100% !important;
  height: 100% !important;
  }
  .magnify, .btn {
    display: none !important;
  }
 /* styles here */
 .image.thumbnail {
  display: flex;
  max-width: 100%;
  width: 120px;
  height:120px;
  &.related {
    margin-top: 1rem;
  }
}
.image.small {
  display: flex;
  max-width: 100%;
  width: 500px;
  height: 500px;
  &.related {
    margin-top: 1rem;
  }
}
.image.large {
  display: flex;
  max-width: 100%;
  min-width: 500px;
  min-height: 500px;
  &.related {
    margin-top: 1rem;
  }
}
}
@media (max-width: 1200px) {
  .image.small {
    display: flex;
    max-width: 100%;
    width: 200px;
    height: 200px;
    &.related {
      margin-top: 1rem;
    }
}
  .image.large {
    display: flex;
    max-width: 100%;
    min-width: 300px;
    min-height: 00px;
    &.related {
      margin-top: 1rem;
    }
  }
}
</style>
