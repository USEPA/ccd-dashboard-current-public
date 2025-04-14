/* eslint-disable consistent-return */
// console.log(process.env)
export const SERVER_URL = process.env.SERVER_URL || '/'
export const SEARCH_URL = process.env.SEARCH_URL || SERVER_URL
export const WEBTEST_URL = process.env.WEBTEST_URL || SERVER_URL

export const RESOLVER_URL = `${WEBTEST_URL}api/resolver/lookup`
export const LOOKUP_URL = `${RESOLVER_URL}?query=`
export const REPORTS_URL = `${WEBTEST_URL}api/webtest/report`

export const HAZARD_PREDICT_API = `${WEBTEST_URL}api/hazard/predict`

export const HAZARD_METADATA_URL = `${WEBTEST_URL}api/hazard/metadata`
export const SEARCH_METADATA_URL = `${SEARCH_URL}api/search/metadata`
export const SERVER_METADATA_URL = `${WEBTEST_URL}api/webtest/metadata`

export const SSS_URL = `${SEARCH_URL}api/search`
export const SSS_LOOKUP_URL = `${SSS_URL}/lookup`
export const DOWNLOAD_MOL = `${SSS_URL}/download/mol`
export const DOWNLOAD_URL = `${SSS_URL}/download`

export function getStructureImageUrl(structure, width, height) {
  if (structure) {
    if (typeof (structure) === 'string') {
      if (width) {
        return `${WEBTEST_URL}api/render/svg?query=${encodeURIComponent(structure)}&width=${width}&height=${height}`
      }
      return `${WEBTEST_URL}api/render/svg?query=${encodeURIComponent(structure)}`
    } if (typeof (structure) === 'object') {
      if (structure.sid) {
        if (width) {
          return `${WEBTEST_URL}api/render/svg?query=${encodeURIComponent(structure.sid)}&width=${width}&height=${height}`
        }
        return `${WEBTEST_URL}api/render/svg?query=${encodeURIComponent(structure.sid)}`
      } if (structure.smiles) {
        if (width) {
          return `${WEBTEST_URL}api/render/svg?query=${encodeURIComponent(structure.smiles)}&width=${width}&height=${height}`
        }
        return `${WEBTEST_URL}api/render/svg?query=${encodeURIComponent(structure.smiles)}`
      } if (structure.cid) {
        return getDashboardImageUrl(structure.cid)
      }
    }
  }
}

export function getDashboardUrl(sid) {
  return `https://comptox.epa.gov/dashboard/dsstoxdb/results?search=${sid}`
}

export function getDashboardImageUrl(cid) {
  return `https://comptox.epa.gov/dashboard/dsstoxdb/compound_image_file?source=${cid.substr(8)}`
}

export function getDatedFilename(prefix, ext) {
  const now = new Date()
  return `${prefix}-${now.toISOString().substr(0, 19)}.${ext}`
}

export function download(filename, data, format) {
  let opt
  if (format === 'xlsx') { opt = {type: 'application/vnd.ms-excel;charset=utf-8'} } else if (format === 'csv') { opt = {type: 'text/csv'} } else if (format === 'sdf') { opt = {type: 'chemical/x-mdl-sdfile'} } else { opt = {type: 'text/plain'} }

  const blob = new Blob([data], opt)
  // pass a useful mime type here
  const url = URL.createObjectURL(blob)

  const element = document.createElement('a')
  element.setAttribute('href', url)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}
