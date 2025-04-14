
interface RawData {
  subs_id: string | null;
  source: string | null;
  subsource: string | null;
  toxvalType: string | null;
  toxvalSubtype: string | null;
  toxvalNumericQualifier: string | null;
  toxvalNumeric: number | null;
  toxvalUnits: string | null;
  studyType: string | null;
  riskAssessmentClass: string | null;
  exposureRoute: string | null;
  criticalEffect: string | null;
  speciesCommon: string | null;
  year: string | null;
  experimental: string | null;
  subsourceUrl: string | null;
  stored_source_record: string | null;
  qc_level: string | null;
  toxvalId: number | null;
  source_hash: string | null;
  studyDurationValue: number | null;
  studyDurationUnits: string | null;
  studyDurationClass: string | null;
  exposureMethod: string | null;
  exposureForm: string | null;
  media: string | null;
  sex: string | null;
  generation: string | null;
  lifestage: string | null;
  population: string | null;
  strain: string | null;
  strain_group: string | null;
  toxvalTypeOriginal: string | null;
  toxval_subtype_original: string | null;
  toxval_numeric_qualifier_original: string | null;
  toxvalNumericOriginal: string | null;
  toxvalUnitsOriginal: string | null;
  studyTypeOriginal: string | null;
  exposureRouteOriginal: string | null;
  criticalEffectOriginal: string | null;
  speciesOriginal: string | null;
  studyDurationValueOriginal: string | null;
  studyDurationUnitsOriginal: string | null;
  studyDurationClassOriginal: string | null;
  originalYear: string | null;
  mediaOriginal: string | null;
  sexOriginal: string | null;
  generation_original: string | null;
  lifestage_original: string | null;
  population_original: string | null;
  strainOriginal: string | null;
  latin_name: string | null;
  ecotox_group: string | null;
  humanEco: string | null;
  sourceUrl: string | null;
  longRef: string | null;
  url: string | null;
  title: string | null;
  author: string | null;
  journal: string | null;
  volume: string | null;
  issue: string | null;
  page: string | null;
  doi: string | null;
  pmid: number | null;
  study_group: string | null;
  guideline: string | null;
  glp: string | null;
  quality: string | null;
  recordSourceLevel: string | null;
  recordSourceType: string | null;
  clowder_doc_metadata: string | null;
  toxvalTypeCategory: string | null;
  speciesSupercategory: string | null;
  habitat: string | null;
  src_year: string | null;
  exposureMethodOriginal: string | null;
  exposureFormOriginal: string | null;
  qcStatus: string | null;
  recordSourceNote: string | null;
  documentName: string | null;
  chemicalId: string | null;
  qualityId: number | null;
  priorityId: number | null;
  sourceSourceId: number | null;
  speciesId: number | null;
  toxvalNumericConverted: number | null;
  toxvalUnitsConverted: string | null;
  supercategory: string | null;
  detailsText: string | null;
  definition: string | null;
  dtxsid: string | undefined | null;
}
export interface HumanEco {
  arrKey: string;
  name: string;
  rawData: RawData[];
}

export interface Hazard {
  casrn: string;
  dtxsid: string | undefined;
  preferredName: string;
  eco: HumanEco[];
  human: HumanEco[];
}

export interface UseHazardState {
  dtxsid: string,
  Hazard: Hazard;
  propertySelection: number;
}

export interface SelectValuesListItem {
  value: string;
  text: string;
}

