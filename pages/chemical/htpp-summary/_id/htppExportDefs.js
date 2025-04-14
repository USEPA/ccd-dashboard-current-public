const genericValueGetter = value => (Number.isNaN(value) || value === '-' ? value : Number(value).toFixed(2));

const exportDefs = [
  {
    header: 'SAMPLE_ID',
    key: 'sampleId',
  },
  {
    header: 'CELL_TYPE',
    key: 'cellType',
  },
  {
    header: 'SEEDING_DENSITY',
    key: 'seedingDensity',
  },
  {
    header: 'EXPOSURE_DURATION',
    key: 'exposureDuration',
  },
  {
    header: 'ENDPOINT',
    key: 'endpoint',
  },
  {
    header: 'ENDPOINT_DESCRIPTION',
    key: 'categoryNameDescription',
  },
  {
    header: 'BMD',
    key: 'bmdOrig',
  },
  {
    header: 'HIT_CALL',
    key: 'hitCall',
  },
  {
    header: 'TOP_CUTOFF',
    key: 'topOverCutoff',
  },
  {
    header: 'TOP',
    key: 'topOrig',
  },
  {
    header: 'CUTOFF',
    key: 'cutOff',
  },
  {
    header: 'QC',
    key: 'qc',
  },
  {
    header: 'QC_FLAG',
    key: 'qcFlag',
  },
  {
    header: 'QC_DESCRIPTION',
    key: 'qcPopover',
  },
  {
    header: 'CHANNEL',
    key: 'channel',
  },
  {
    header: 'MODULE',
    key: 'module',
  },
  {
    header: 'COMPARTMENT',
    key: 'compartment',
  },
  {
    header: 'NUM_FEATURES',
    key: 'numberOfFeature',
  },
  {
    header: 'FIT_METHOD',
    key: 'fitMethod',
  },
  {
    header: 'CONCENTRATION',
    key: 'conc',
  },
  {
    header: 'RESPONSE',
    key: 'resp',
  },
  {
    header: 'PROFILE',
    key: 'profile',
  },
];

export default exportDefs;
