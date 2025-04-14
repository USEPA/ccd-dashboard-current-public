<template>
  <div>
    <div
      v-if="searchType === 'SIMILAR' || searchType === 'ADVANCED'"
      class="row mt-2"
    >
      <div class="col">
        <label>Min similarity: {{ minSimilarity }}</label>
        <b-form-input
          v-model="minSimilarity"
          :disabled="disableSimilarity"
          max="1"
          min="0.0"
          step="0.01"
          type="range"
        />
      </div>
      <div
        v-if=" searchType === 'ADVANCED'"
        class="col"
      >
        <label />
        <b-form-checkbox v-model="useSimilarity">
          Use similarity
        </b-form-checkbox>
      </div>
      <div class="col">
        <div class="form-group">
          <label>Similarity-type:</label>
          <select
            v-model="similarityType"
            :disabled="disableSimilarity"
            class="form-control"
          >
            <option value="tanimoto">
              Tanimoto
            </option>
          </select>
        </div>
      </div>
      <div
        v-if="searchType !== 'FORMULA'"
        class="row mt-1"
      >
        <div class="col form-group">
          <label>Elements must be included:</label>
          <div class="input-group">
            <input
              v-model="includeElements"
              class="form-control"
              placeholder="e.g. C,F,H"
              type="text"
            >
            <b-btn
              v-b-modal.modalPeriodElements
              class="ml-1 mt-0"
              size="sm"
              variant="primary"
              @click="showIncludeModal"
            >
              <img src="~/assets/img/ic_view_module_white_24px.svg">
            </b-btn>
          </div>
          <periodic-table
            :emit-event="'allowedChange'"
            :modal-id="'modalPeriodElements'"
            @allowedChange="changeAllowedElements"
          />
        </div>
        <div class="col form-group">
          <label>Elements must be excluded:</label>
          <div class="input-group">
            <input
              v-model="excludeElements"
              class="form-control"
              placeholder="e.g. C,F,H"
              type="text"
            >
            <b-btn
              v-b-modal.modalPeriodElementsExlud
              class="ml-1 mt-0"
              size="sm"
              variant="primary"
              @click="showExcludeModal"
            >
              <img
                src="~/assets/img/ic_view_module_white_24px.svg"
              >
            </b-btn>
          </div>
          <periodic-table
            :emit-event="'excludedChange'"
            :modal-id="'modalPeriodElementsExlud'"
            @excludedChange="changeExcludedElements"
          />
        </div>
      </div>
    </div>
  </div>
</template>
