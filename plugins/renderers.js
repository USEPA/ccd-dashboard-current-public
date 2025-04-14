/* eslint-disable no-undefined */
/* eslint-disable no-undef */
import Vue from 'vue';

Vue.mixin({data() {
  return {
    comptoxBaseURL: 'https://comptox.epa.gov/dashboard/',
    testURL: 'https://s3.amazonaws.com/epa-comptox/test-reports/',
    downloadQmrfPdf: '/dsstoxdb/download_qmrf_pdf',
    calculationDetails: '/dsstoxdb/calculation_details',
  };
},
methods: {
  qmrfUrl(params) {
    let link = '';
    if (params.data.hasQmrfPdf) {
      link = `<a href="${process.env.APPLICATION_BASE_API}ccdapp1/qmrfdata/file/by-modelid/${params.data.modelId}" target=_blank" title="show QMRF pdf">Available</a>`;
    } else {
      link = 'Not Available';
    }
    return link;
  },

  numberFieldRenderer(params) {
    if (parseInt(params.data[params.fieldName]) > 0) {
      return params.data[params.fieldName];
    }
    return '-';
  },

  operaUrl(params, activeChemical) {
    let link = '';
    const {gsid} = activeChemical;
    const globalApplicability = (params.data.globalApplicability === 1) ? '[Inside AD]' : '[Outside AD]';
    const baseLink = (!params.data.link) ? params.data.details.link : params.data.link;
    const qstring = baseLink.split('?')[1];
    const applicationBase = `${process.env.APPLICATION_EXTERNAL_LINK_URL}${process.env.APPLICATION_ROUTER_BASE}calculation-details?${qstring}`;
    link = `<a target="_blank" href="${applicationBase}">OPERA Calculation Report ${globalApplicability}</a>`;

    return link;
  },
  testUrl(params, activeChemical) {
    const link = `<a target="_blank" href="${this.testURL}${activeChemical.dsstoxCompoundId}-TEST_MP.html">TEST Report</a>`;
    return link;
  },
  structureImage(params) {
    if (params.data.hasStructureImage === false && params.data.relatedStructureCount && params.data.relatedStructureCount >= 0) {
      return `<div class='related-cell'>${
        params.data.relatedStructureCount
      } related chemical structure${
        params.data.relatedStructureCount === 1 ? '' : 's'
      } with this substance</div>`;
    }
    if (params.data.hasStructureImage === false && params.data.relatedStructureCount == null) {
      return '<div class=\'related-cell\'> 0 related chemical structures with this substance</div>';
    }
    if (params.data.hasStructureImage === true && params.data.dtxsid == null && params.data.dtxcid !== null) {
      return `<div style="height:98px"><img height="97px" src="${process.env.APPLICATION_BASE_API}${this.apiSettings().CHEMICAL_IMAGE_API}by-dtxcid/${params.data.dtxcid}"></div>`;
    }
    if (params.data.hasStructureImage === false) {
      return '<div class=\'related-cell\'> No image found for this structure.</div>';
    }
    if (!params.data.hasStructureImage) {
      return '<div class=\'related-cell\'> No image found for this structure.</div>';
    }
    if (params.data.hasStructureImage) {
      try {
        return `<div style="height:98px"><img height="97px" src="${process.env.APPLICATION_BASE_API}${this.apiSettings().CHEMICAL_IMAGE_API}by-dtxsid/${params.data.dtxsid}"></div>`;
      } catch (err) {
        return '<div class=\'related-cell\'> No image found for this structure.</div>';
      }
    }
    return '<div class=\'related-cell\'> No image found for this structure.</div>';
  },
  toxvalDisplay(params) {
    return (params.value) ? `<a href="${process.env.APPLICATION_EXTERNAL_LINK_URL}/dashboard/chemical/hazard/${params.data.dtxsid}" target="_blank">available</a>` : '<div></div>';
  },
  toxCastPercent(params) {
    if (params.data.percentAssays) {
      return Math.round(params.data.percentAssays);
    }
  },
  toxCastActive(params) {
    if (params.data.activeAssays && params.data.totalAssays) {
      return `${params.data.activeAssays}/${params.data.totalAssays}`;
    }
    return '-';
  },
  whenEmpty(params) {
    return (params.value) ? params.value : '<div style=\'width:100%; text-align: left;\'> - </div>';
  },
  qcLevel(params) {
    return `Level ${params.value}` || 0;
  },
  percentFormatter(params) {
    if (params.value) {
      return `${Math.round(params.value)}%`;
    }
    return '-';
  },
  rangeStringFormat(params) {
    const data = params;
    let r = '-';
    if (data) {
      if (Array.isArray(data) && data.length === 2) {
        const from = $nuxt.ncctRound(data[0]);
        const to = $nuxt.ncctRound(data[1]);

        if (from === to) {
          r = from;
        } else {
          r = `${from} to ${to}`;
        }
      }
    }
    return r;
  },
  similarityValue(params) {
    if (params.data.similarity) {
      const f = parseFloat(params.data.similarity);
      return Number(f.toFixed(2));
    }
    return 0;
  },
  similarityDisplay(params) {
    return Math.round((params.value + Number.EPSILON) * 100) / 100;
  },
  roundTo2(params) {
    if (params.value) {
      const f = parseFloat(params.value);
      if (Number.isNaN(f)) {
        return params.value;
      }
      return `${f.toFixed(2)}`;
    }
    return '-';
  },
  roundTo6(params) {
    if (params.value === 0) { return 0; }
    if (params.value) {
      const f = parseFloat(params.value);
      return `${f.toFixed(6)}`;
    }
    return '-';
  },
  scComparator(sc1, sc2) {
    let scFraction1 = '';
    let scFraction2 = '';
    if (sc1.singleTotal != null && sc1.singleActive != null) {
      scFraction1 = ((sc1.singleActive / sc1.singleTotal) * 100);
    }
    if (sc2.singleTotal != null && sc2.singleActive != null) {
      scFraction2 = ((sc2.singleActive / sc2.singleTotal) * 100);
    }
    if (scFraction1 === null && scFraction2 === null) {
      return 0;
    }
    if (scFraction1 === null) {
      return -1;
    }
    if (scFraction2 === null) {
      return 1;
    }
    return scFraction1 - scFraction2;
  },
  mcComparator(mc1, mc2) {
    let mcFraction1 = '';
    let mcFraction2 = '';
    if (mc1.total != null && mc1.active != null) {
      mcFraction1 = ((mc1.active / mc1.total) * 100);
    }
    if (mc2.total != null && mc2.active != null) {
      mcFraction2 = ((mc2.active / mc2.total) * 100);
    }
    if (mcFraction1 === null && mcFraction2 === null) {
      return 0;
    }
    if (mcFraction1 === null) {
      return -1;
    }
    if (mcFraction2 === null) {
      return 1;
    }
    return mcFraction1 - mcFraction2;
  },
  ncctRound2(params) {
    if (params.value == null) {
      return '-';
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(params.value)) {
      return params.value;
    }
    const n = parseFloat(params.value);
    let converted = n;
    if (typeof n === 'number') {
      if ((n >= 0.1 && n < 1000) || (n <= -0.1 && n > -1000) || n === 0) {
        converted = params.format ? n.toFixed(2) : n.toPrecision(3);
      } else {
        converted = n.toExponential(2);
      }
    }
    return converted;
  },
  ncctNumericCommaSep(params) {
    return Number(params.value).toLocaleString();
  },

  formatPreferredName(params) {
    if (params.value == null) { return '-'; }
    const formatted = params.value.replace(/~(\d+)~/g, '<sup>$1</sup>').replace(/_(\d+)_/g, '<sub>$1</sub>');
    return formatted;
  },
  splitInchi(params) {
    return params.data.inchiString ? params.data.inchiString.split('\nAux')[0] : '';
  },
  splitPipeDelimtedField(params) {
    const symbols = params.data.criticalEffect.split('|');
    return symbols.join(' <br />');
  },
  displayHitCall(params) {
    const numericHitCall = params.data.hitCall;
    switch (numericHitCall) {
    case 1:
      return 'Active';
    case 0:
      return 'Inactive';
    case -1:
      return 'Inconclusive';
    default:
      return numericHitCall;
    }
  },
}});
