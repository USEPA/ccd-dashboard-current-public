import displayHitCall from '../../assets/utils/hitCall'

export default class AssayTranslator {
  translate = (chemicals, page) => chemicals.map((chem, idx) => ({
    ...chem,
    uuId: page + idx,
    displayName: chem.preferredName || chem.iupacName,
    dtxsid: this.dtxsid(chem),
    hitCall: displayHitCall(chem.hitc),
  }))

  dtxsid = chem => ((chem.dsstoxSubstanceId) ?
    chem.dsstoxSubstanceId :
    chem.dtxsid)
}
