export default class DtxsidCustomFilter {
  init(params) {
    this.valueGetter = params.valueGetter
    this.filterText = null
    this.setupGui(params)
  }

  // not called by ag-Grid, just for us to help setup
  setupGui(params) {
    this.gui = document.createElement('div')
    this.gui.innerHTML =
      '<div style="padding: 4px; width: 200px;">' +
      '<div style="font-weight: bold;">Custom Athlete Filter</div>' +
      '<div><input style="margin: 4px 0px 4px 0px;" type="text" id="filterText" placeholder="Full name search..."/></div>' +
      '<div style="margin-top: 20px;">This filter does partial word search on multiple words, eg "mich phel" still brings back Michael Phelps.</div>' +
      '<div style="margin-top: 20px;">Just to iterate anything can go in here, here is an image!!</div>' +
      '<div><img src="https://www.ag-grid.com/images/ag-Grid2-200.png" style="width: 150px; text-align: center; padding: 10px; margin: 10px; border: 1px solid lightgrey;"/></div>' +
      '</div>'

    this.eFilterText = this.gui.querySelector('#filterText')
    this.eFilterText.addEventListener('changed', listener)
    this.eFilterText.addEventListener('paste', listener)
    this.eFilterText.addEventListener('input', listener)
    // IE doesn't fire changed for special keys (eg delete, backspace), so need to
    // listen for this further ones
    this.eFilterText.addEventListener('keydown', listener)
    this.eFilterText.addEventListener('keyup', listener)

    const that = this

    function listener(event) {
      that.filterText = event.target.value
      params.filterChangedCallback()
    }
  }

  getGui() { return this.gui }

  doesFilterPass(params) {
    // make sure each word passes separately, ie search for firstname, lastname
    let passed = true
    const {valueGetter} = this
    this.filterText.toLowerCase().split(' ').forEach((filterWord) => {
      const value = valueGetter(params)

      if (!value.toString().toLowerCase().includes(filterWord)) {
        passed = false
      }
    })

    return passed
  }

  isFilterActive() { return this.filterText != null && this.filterText !== '' }

  getModel() {
    console.log('filterText', this.filterText)
    return ({value: this.filterText.value})
  }

  setModel(model) {
    if (model) {
      this.eFilterText.value = model.value
    } else {
      this.eFilterText.value = 'ok'
    }
  }
}
