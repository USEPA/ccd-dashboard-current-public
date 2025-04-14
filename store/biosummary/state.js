export default () => ({

  exportColDefs: [
    {
      header: 'ASSAY_ENDPOINT_NAME',
      key: 'assayComponentEndpNm',
    },
    {
      header: 'ASSAY_ENDPOINT_DESCRIPTION',
      key: 'assayComponentEndpDesc',
    },
    {
      header: 'ASSAY_NAME',
      key: 'assayName',
    },
    {
      header: 'ASSAY_DESCRIPTION',
      key: 'assayDesc',
    },
    {
      header: 'ASSAY_LISTS',
      key: 'assayList',
      derived: true,
      formatter: 'cellSingleFieldExtractor',
      formatterParams: {referenceKey: 'assay_list_nm', delimitChar: '|'},
    },
    {
      header: 'ASSAY_SOURCE',
      key: 'assaySourceName',
    },
    {
      header: 'ASSAY_SOURCE_DESCRIPTION',
      key: 'sourceDescription',
    },
    {
      header: 'ASSAY_FUNCTION_TYPE',
      key: 'assayFunctionType',
    },
    {
      header: 'SEQAPASS',
      key: 'seqAPASS',
    },
    {
      header: 'GENE_SYMBOLS',
      key: 'geneInfo',
      derived: true,
      formatter: 'cellSingleFieldExtractor',
      formatterParams: {referenceKey: 'gene_symbol', delimitChar: '|'},
    },
    {
      header: 'GENE_NAMES',
      derived: true,
      key: 'geneName',
      formatter: 'cellSingleFieldExtractor',
      formatterParams: {
        referenceKey: 'gene_name', delimitChar: ',',
      },
    },
    {
      header: 'GENE_URLS',
      derived: true,
      key: 'geneUrl',
      formatter: 'cellSingleFieldExtractor',
      formatterParams: {
        referenceKey: 'gene_url', delimitChar: ',',
      },
    },
    {
      header: 'AOP',
      key: 'aop',

    },
    {
      header: 'EVENT',
      key: 'event',

    },
    {
      header: 'HIT_CALL',
      key: 'hitCall',
      formatter: 'extractHitCall',
    },
    {
      header: 'CONTINUOUS_HITCALL',
      key: 'hitcallContinuous',
    },
    {
      header: 'TOP',
      key: 'top',
    },
    {
      header: 'SCALED_TOP',
      key: 'scaledTop',
    },
    {
      header: 'CUTOFF',
      key: 'cutoff',
    },
    {
      header: 'ACC',
      key: 'acc',
    },
    {
      header: 'AC10',
      key: 'ac10',
    },
    {
      header: 'AC50',
      key: 'ac50',
    },
    {
      header: 'LOGAC50',
      key: 'logac50',
    },
    {
      header: 'BMAD',
      key: 'bmad',
    },
    {
      header: 'BMD',
      key: 'bmd',
    },
    {
      header: 'BMR',
      key: 'bmr',
    },
    {
      header: 'MAX_MED_CONC',
      key: 'maxMedConc',
    },
    {
      header: 'NORMALIZED_DATA_TYPE',
      key: 'normalizedDataTypCd',
    },
    {
      header: 'MC6_FLAG',
      key: 'flag',
    },
    {
      header: 'ORGANISM',
      key: 'organism',
    },
    {
      header: 'CELL_LINE',
      key: 'cellShortName',
    },
    {
      header: 'CELL_FORMAT',
      key: 'cellFormat',
    },
    {
      header: 'CONC.',
      key: 'logcAgg',
    },
    {
      header: 'RESPONSE',
      key: 'respAgg',
    },
    {
      header: 'CYTOTOX_BURST',
      key: 'cytotoxBurst',
    },
    {
      header: 'INTENDED_TARGET_FAMILY',
      key: 'intendedTargetFamily',
    },
    {
      header: 'INTENDED_TARGET_TYPE',
      key: 'intendedTargetType',
    },
    {
      header: 'INTENDED_TARGET_TYPE_SUB',
      key: 'intendedTargetSubType',
    },
    {
      header: 'INTENDED_TARGET_FAMILY_SUB',
      key: 'intendedTargetFamSub',
    },
    {
      header: 'BIOLOGICAL_TARGET_FAMILY',
      key: 'biologicalProcessTarget',
    },
    {
      header: 'DETECTION_TECHNOLOGY_TYPE',
      key: 'detectionTechnologyType',
    },
    {
      header: 'TISSUE',
      key: 'tissue',
    },
    {
      header: 'STOCK_CONC',
      key: 'stockConcentration',
    },
    {
      header: 'STOCK_CONCENTRATION_UNITS',
      key: 'stockConcentrationUnits',
    },
    {
      header: 'SAMPLE_ID',
      key: 'sampleId',
    },
    {
      header: 'REP.',
      key: 'chidRep',
    },
  ],
  exportHttrColDefs: [
    {
      header: 'CELL_TYPE',
      key: 'cellType',
    },
    {
      header: 'SIGNATURE',
      key: 'signature',
    },
    {
      header: 'TARGET',
      key: 'superTarget',
    },
    {
      header: 'TARGET_CLASS',
      key: 'targetClass',
    },
    {
      header: 'TARGET_LEVEL',
      key: 'superTargetLevel',
    },
    {
      header: 'HIT_CALL',
      key: 'hitCall',
    },
    {
      header: 'BMD',
      key: 'bmd',

    },
    {
      header: 'TOP',
      key: 'top',
    },
    {
      header: 'TOP_CUTOFF',
      key: 'topOverCutoff',
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
      header: 'FIT_METHOD',
      key: 'fitMethod',
    },
    {
      header: 'DESCRIPTION',
      key: 'description',
    },
    {
      header: 'SOURCE',
      key: 'source',
    },
    {
      header: 'SUBSOURCE',
      key: 'subsource',
    },
    {
      header: 'DIRECTION',
      key: 'direction',
    },
    {
      header: 'TIME (HRS)',
      key: 'time',
    },
    {
      header: 'NUM_GENES',
      key: 'ngene',
    },
    {
      header: 'SAMPLE_ID',
      key: 'sampleId',
    },
    {
      header: 'CONCENTRATION',
      key: 'conc',
    },
    {
      header: 'RESPONSE',
      key: 'response',
    },
    {
      header: 'PROFILE',
      key: 'profile',
    },

  ],
});
