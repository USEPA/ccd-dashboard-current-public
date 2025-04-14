/* eslint-disable import/extensions */
import {createPinia} from 'pinia';
import {useSettingsStore} from '~/stores/settings.ts';
import createRepository from '~/api/Repository';
import ChemicalDetailsRepository from '~/api/ChemicalDetailsRepository';
import ChemicalListsRepository from '~/api/ChemicalListsRepository';
import AssayRepository from '~/api/AssayRepository';
import ActorRepository from '~/api/ActorRepository';
import ChemicalSearchRepository from '~/api/ChemicalSearchRepository';
import ProductSearchRepository from '~/api/ProductSearchRepository';
import SimilarCompoundsRepository from '~/api/SimilarCompoundsRepository';
import ExposureRepository from '~/api/ExposureRepository';
import NavTabsRepository from '~/api/NavTabsRepository';
import TotalChemicalCountRepository from '~/api/TotalChemicalCountRepository';
import BioactivityRepository from '~/api/BioactivityRepository';
import BatchSearchRepository from '~/api/BatchSearchRepository';
import HttrRepository from '../api/HttrRepository';
import HtppRepository from '../api/HtppRepository';

const pinia = createPinia();
const settingsStore = useSettingsStore(pinia);
const settings = settingsStore.getSettings;

export default (ctx, inject) => {
  const repositoryWithAxios = createRepository(ctx.$axios, settings);

  const repositories = {
    admeIvive: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.IVIVE_API}`),
    pubChem: repositoryWithAxios(`${process.env.APPLICATION_PUBCHEM_API_URL}`),
    aops: repositoryWithAxios(`${process.env.APPLICATION_AOPS_API}`),
    actor: new ActorRepository(ctx.$axios, settings).build(),
    httr: new HttrRepository(ctx.$axios, settings).build(),
    htpp: new HtppRepository(ctx.$axios, settings).build(),
    assay: new AssayRepository(ctx.$axios, settings).build(),
    batchSearch: new BatchSearchRepository(ctx.$axios, settings).build(),
    bioactivity: new BioactivityRepository(ctx.$axios, settings).build(),
    cancer: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.CANCER_API}`),
    chemicalDetails: new ChemicalDetailsRepository(ctx.$axios, settings).build(),
    chemicalImage: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.CHEMICAL_IMAGE_API}`),
    chemicalSearch: new ChemicalSearchRepository(ctx.$axios, settings).build(),
    chemicalList: new ChemicalListsRepository(ctx.$axios, settings).build(),
    chemicalProperties: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.CHEMICAL_PROPERTIES_API}`),
    comments: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.COMMENTS_API}`),
    commentsAll: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.COMMENTS_ALL_API}`),
    deepLinks: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.DEEPLINK_API}`),
    downloads: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.DOWNLOADS_API}`),
    execSumLinks: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.EXECUTIVE_SUMMARY_LINKS}`),
    exposure: new ExposureRepository(ctx.$axios, settings).build(),
    fateTransport: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.FATE_TRANSPORT_API}`),
    feedback: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.FEEDBACK_API}`),
    hazard: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.HAZARD_API}`),
    genoToxicitySummary: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.GENOTOXICITY_SUMMARY_API}`),
    genoToxicityDetails: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.GENOTOXICITY_DETAILS_API}`),
    helpTexts: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.HELPTEXT_API}`),
    links: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.LINKS_API}`),
    news: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.NEWS_API}`),
    opera: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.OPERA_MODEL_API}`),
    oralPod: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.EXECUTIVE_SUMMARY_ORAL_POD}`),
    physChem: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.EXECUTIVE_SUMMARY_PHYSCHEM_API}`),
    productSearch: new ProductSearchRepository(ctx.$axios, settings).build(),
    pubmedFetch: repositoryWithAxios(`${process.env.APPLICATION_PUBMED_BASE}/efetch.fcgi`),
    pubmedSearch: repositoryWithAxios(`${process.env.APPLICATION_PUBMED_BASE}/esearch.fcgi`),
    reCaptcha: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.RECAPTCHA_API}`),
    regionalScreening: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.EXECUTIVE_SUMMARY_REGIONAL_SCREENING_API}`),
    relatedSubstances: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.RELATED_SUBSTANCES_API}`),
    sameConnectivity: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.SAME_CONNECTIVITY_API}`),
    sameConnectivityCount: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.SAME_CONNECTIVITY_COUNT_API}`),
    similarCompounds: new SimilarCompoundsRepository(ctx.$axios, settings).build(),
    skinEye: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.SKIN_EYE_API}`),
    synonyms: repositoryWithAxios(`${process.env.APPLICATION_BASE_API}${settings.SYNONYMS_API}`),
    tabs: new NavTabsRepository(ctx.$axios, settings).build(),
    totalChemicalCount: new TotalChemicalCountRepository(ctx.$axios, settings).build(),
    toxCastPlot: repositoryWithAxios(`${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}`),
  };
  inject('repositories', repositories);
};
