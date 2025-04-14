const links = [
  {
    label: 'details',
    labelDisplay: 'Details',
    category: 'details',
    subCategory: null,
    url: 'chemical/details',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'synonyms',
    labelDisplay: 'Synonyms',
    category: 'details',
    subCategory: null,
    url: 'chemical/synonyms',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'related-substances',
    labelDisplay: 'Related Substances',
    category: 'details',
    subCategory: null,
    url: 'chemical/related-substances',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'similar-molecules',
    labelDisplay: 'Similar Compounds',
    category: 'details',
    subCategory: null,
    url: 'chemical/similar-molecules',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'exec_sum',
    labelDisplay: 'Executive Summary',
    category: null,
    subCategory: null,
    url: 'chemical/executive-summary',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'properties',
    labelDisplay: 'Physchem Prop.',
    category: null,
    subCategory: null,
    url: 'chemical/properties',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'env-fate-transport',
    labelDisplay: 'Env. Fate/Transport',
    category: null,
    subCategory: null,
    url: 'chemical/env-fate-transport',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'toxicity-values',
    labelDisplay: 'Hazard',
    category: null,
    subCategory: null,
    url: 'chemical/hazard',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'safety-ghs-data',
    labelDisplay: 'GHS Data',
    category: 'safety',
    subCategory: null,
    url: 'chemical/safety-ghs-data',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'adme-ivive-subtab',
    labelDisplay: 'IVIVE',
    category: 'adme',
    subCategory: null,
    url: 'chemical/adme-ivive-subtab',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'product-use-categories',
    labelDisplay: 'Product & Use Categories',
    category: 'exposure',
    subCategory: null,
    url: 'chemical/product-use-categories',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'chemical-weight-fraction',
    labelDisplay: 'Chemical Weight Fraction',
    category: 'exposure',
    subCategory: null,
    url: 'chemical/chemical-weight-fraction',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'chemical-functional-use',
    labelDisplay: 'Chemical Functional Use',
    category: 'exposure',
    subCategory: null,
    url: 'chemical/chemical-functional-use',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'toxics-release-inventory',
    labelDisplay: 'Toxics Release Inventory',
    category: 'exposure',
    subCategory: null,
    url: 'chemical/toxics-release-inventory',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'monitoring-data',
    labelDisplay: 'Monitoring Data',
    category: 'exposure',
    subCategory: null,
    url: 'chemical/monitoring-data',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'exposure-predictions',
    labelDisplay: 'Exposure Predictions',
    category: 'exposure',
    subCategory: null,
    url: 'chemical/exposure-predictions',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'production-volume',
    labelDisplay: 'Production Volume',
    category: 'exposure',
    subCategory: null,
    url: 'chemical/production-volume',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'invitrodb',
    labelDisplay: 'ToxCast: Summary',
    category: 'bioactivity',
    subCategory: null,
    url: 'chemical/invitrodb',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'invitrodb-bioassays-toxcast-data',
    labelDisplay: 'Toxcast Conc. Response Data',
    category: 'bioactivity',
    subCategory: null,
    url: 'chemical/concentration-response-data',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'httr-summary',
    labelDisplay: 'HTTr: Summary',
    category: 'bioactivity',
    subCategory: null,
    url: 'chemical/httr-summary',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'htpp-summary',
    labelDisplay: 'HTPP: Summary',
    category: 'bioactivity',
    subCategory: null,
    url: 'chemical/htpp-summary',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'bio-activity',
    labelDisplay: 'PubChem',
    category: 'bioactivity',
    subCategory: null,
    url: 'chemical/bio-activity',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'bioactivity-toxcast-models',
    labelDisplay: 'ToxCast: Models',
    category: 'bioactivity',
    subCategory: null,
    url: 'chemical/bioactivity-toxcast-models',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'genra',
    labelDisplay: 'GenRA',
    category: null,
    subCategory: null,
    url: 'chemical/genra',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'actor',
    labelDisplay: 'ACToR',
    category: null,
    subCategory: null,
    url: 'chemical/actor',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'google-scholar',
    labelDisplay: 'Google Scholar',
    category: 'literature',
    subCategory: null,
    url: 'chemical/google-scholar',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'pubmed-abstract-sifter',
    labelDisplay: 'PubMed Abstract Sifter',
    category: 'literature',
    subCategory: null,
    url: 'chemical/pubmed-abstract-sifter',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'pubchem-articles',
    labelDisplay: 'PubChem Articles',
    category: 'literature',
    subCategory: null,
    url: 'chemical/pubchem-articles',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'pubchem-patents',
    labelDisplay: 'PubChem Patents',
    category: 'literature',
    subCategory: null,
    url: 'chemical/pubchem-patents',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'literature-pprtv',
    labelDisplay: 'PPRTV',
    category: 'literature',
    subCategory: null,
    url: 'chemical/literature-pprtv',
    disable: true,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'literature-iris',
    labelDisplay: 'IRIS',
    category: 'literature',
    subCategory: null,
    url: 'chemical/literature-iris',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'links',
    labelDisplay: 'Links',
    category: null,
    subCategory: null,
    url: 'chemical/links',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  },
  {
    label: 'comments',
    labelDisplay: 'Comments',
    category: null,
    subCategory: null,
    url: 'chemical/comments',
    disable: false,
    listName: 'STANDARD',
    dtxsid: 'DTXSID7020182'
  }
]