/* eslint-disable max-classes-per-file */
class AxiosBatchSearchRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
    this.dateString = Date.now().toString(36);
  }

  async getChemicalsByInputType(searchList) {
    const results = await this.axios.$post(`${process.env.APPLICATION_BASE_API}${this.settings.BATCH_SEARCH_API}?${this.dateString}`, searchList);
    const updated = results.map((chem, idx) => ({
      ...chem,
      uuId: chem.id,
      displayName: chem.preferredName || chem.iupacName,
    }));
    return updated;
  }

  async startBatchSearchExportJob(searchList) {
    const results = await this.axios.$post(`${process.env.APPLICATION_BASE_API}${this.settings.BATCH_SEARCH_EXPORT_API}?${this.dateString}`, searchList);
    return results;
  }

  async batchSearchExportJobStatus(jobId) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.BATCH_SEARCH_EXPORT_API}/${jobId}?${this.dateString}`);
    return results;
  }
}

export default class BatchSearchRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
  }

  build() {
    return new AxiosBatchSearchRepository(this.axios, this.settings);
  }
}
