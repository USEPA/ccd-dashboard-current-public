/* eslint-disable no-console */
export default class ChemicalTranslator {
  translate = (chemicals, page) => chemicals.map((chem, idx) => ({
    ...chem,
    uuId: page + idx,
    displayName: chem.preferredName || chem.iupacName,
    dtxsid: this.dtxsid(chem),
  }))

  dtxsid = chem => ((chem.dsstoxSubstanceId) ?
    chem.dsstoxSubstanceId :
    chem.dtxsid)
}
