/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable max-classes-per-file */
export class PeriodicElement {
  constructor(name, checked, color, text = '') {
    this._name = name
    this._checked = checked
    this._color = color
    this._text = text
    this._disabled = false
  }

  get disabled() {
    return this._disabled
  }

  set disabled(value) {
    this._disabled = value
  }

  get name() {
    return this._name
  }

  get checked() {
    return this._checked
  }

  get color() {
    return this._color
  }

  get text() {
    return this._text
  }

  set name(value) {
    this._name = value
  }

  set checked(value) {
    this._checked = value
  }

  set color(value) {
    this._color = value
  }

  set text(value) {
    this._text = value
  }
}

export default class PeriodicTable {
  constructor() {
    this.periodicArray = [
      [
        new PeriodicElement('H', false, 'lightGray'),
        new PeriodicElement('', false, ''),
        new PeriodicElement('D', false, 'lightGray'),
        new PeriodicElement('T', false, 'lightGray'),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('He', false, 'yellow'),
      ],
      [
        new PeriodicElement('Li', false, 'pink'),
        new PeriodicElement('Be', false, 'pink'),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('B', false, 'lightGreen'),
        new PeriodicElement('C', false, 'blueGray'),
        new PeriodicElement('N', false, 'blueGray'),
        new PeriodicElement('O', false, 'blueGray'),
        new PeriodicElement('F', false, 'orange'),
        new PeriodicElement('Ne', false, 'yellow'),
      ],
      [
        new PeriodicElement('Na', false, 'pink'),
        new PeriodicElement('Mg', false, 'pink'),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('Al', false, 'gray'),
        new PeriodicElement('Si', false, 'lightGreen'),
        new PeriodicElement('P', false, 'blueGray'),
        new PeriodicElement('S', false, 'blueGray'),
        new PeriodicElement('Cl', false, 'orange'),
        new PeriodicElement('Ar', false, 'yellow'),
      ],
      [
        new PeriodicElement('K', false, 'pink'),
        new PeriodicElement('Ca', false, 'pink'),
        new PeriodicElement('Sc', false, 'blue'),
        new PeriodicElement('Ti', false, 'blue'),
        new PeriodicElement('V', false, 'blue'),
        new PeriodicElement('Cr', false, 'blue'),
        new PeriodicElement('Mn', false, 'blue'),
        new PeriodicElement('Fe', false, 'blue'),
        new PeriodicElement('Co', false, 'blue'),
        new PeriodicElement('Ni', false, 'blue'),
        new PeriodicElement('Cu', false, 'blue'),
        new PeriodicElement('Zn', false, 'blue'),
        new PeriodicElement('Ga', false, 'gray'),
        new PeriodicElement('Ge', false, 'lightGreen'),
        new PeriodicElement('As', false, 'lightGreen'),
        new PeriodicElement('Se', false, 'blueGray'),
        new PeriodicElement('Br', false, 'orange'),
        new PeriodicElement('Kr', false, 'yellow'),
      ],
      [
        new PeriodicElement('Rb', false, 'pink'),
        new PeriodicElement('Sr', false, 'pink'),
        new PeriodicElement('Y', false, 'blue'),
        new PeriodicElement('Zr', false, 'blue'),
        new PeriodicElement('Nb', false, 'blue'),
        new PeriodicElement('Mo', false, 'blue'),
        new PeriodicElement('Tc', false, 'blue'),
        new PeriodicElement('Ru', false, 'blue'),
        new PeriodicElement('Rh', false, 'blue'),
        new PeriodicElement('Pd', false, 'blue'),
        new PeriodicElement('Ag', false, 'blue'),
        new PeriodicElement('Cd', false, 'blue'),
        new PeriodicElement('In', false, 'gray'),
        new PeriodicElement('Sn', false, 'gray'),
        new PeriodicElement('Sb', false, 'lightGreen'),
        new PeriodicElement('Te', false, 'lightGreen'),
        new PeriodicElement('I', false, 'orange'),
        new PeriodicElement('Xe', false, 'yellow'),
      ],
      [
        new PeriodicElement('Cs', false, 'pink'),
        new PeriodicElement('Ba', false, 'pink'),
        new PeriodicElement('', false, 'lightBlue', '*'),
        new PeriodicElement('Hf', false, 'blue'),
        new PeriodicElement('Ta', false, 'blue'),
        new PeriodicElement('W', false, 'blue'),
        new PeriodicElement('Re', false, 'blue'),
        new PeriodicElement('Os', false, 'blue'),
        new PeriodicElement('Ir', false, 'blue'),
        new PeriodicElement('Pt', false, 'blue'),
        new PeriodicElement('Au', false, 'blue'),
        new PeriodicElement('Hg', false, 'blue'),
        new PeriodicElement('In', false, 'gray'),
        new PeriodicElement('Sn', false, 'gray'),
        new PeriodicElement('Sb', false, 'gray'),
        new PeriodicElement('Te', false, 'lightGreen'),
        new PeriodicElement('I', false, 'orange'),
        new PeriodicElement('Xe', false, 'yellow'),
      ],
      [
        new PeriodicElement('Fr', false, 'pink'),
        new PeriodicElement('Ra', false, 'pink'),
        new PeriodicElement('', false, 'green', '**'),
      ],
      [
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('La', false, 'lightBlue'),
        new PeriodicElement('Ce', false, 'lightBlue'),
        new PeriodicElement('Pr', false, 'lightBlue'),
        new PeriodicElement('Nd', false, 'lightBlue'),
        new PeriodicElement('Pm', false, 'lightBlue'),
        new PeriodicElement('Sm', false, 'lightBlue'),
        new PeriodicElement('Eu', false, 'lightBlue'),
        new PeriodicElement('Gd', false, 'lightBlue'),
        new PeriodicElement('Tb', false, 'lightBlue'),
        new PeriodicElement('Dy', false, 'lightBlue'),
        new PeriodicElement('Er', false, 'lightBlue'),
        new PeriodicElement('Tm', false, 'lightBlue'),
        new PeriodicElement('Yb', false, 'lightBlue'),
        new PeriodicElement('Ra', false, 'lightBlue'),
        new PeriodicElement('Lu', false, 'lightBlue'),
      ],
      [
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('', false, ''),
        new PeriodicElement('Ac', false, 'green'),
        new PeriodicElement('Th', false, 'green'),
        new PeriodicElement('Pa', false, 'green'),
        new PeriodicElement('U', false, 'green'),
        new PeriodicElement('Np', false, 'green'),
        new PeriodicElement('Pu', false, 'green'),
        new PeriodicElement('Am', false, 'green'),
        new PeriodicElement('Cm', false, 'green'),
        new PeriodicElement('Bk', false, 'green'),
        new PeriodicElement('Cf', false, 'green'),
        new PeriodicElement('Es', false, 'green'),
        new PeriodicElement('Fm', false, 'green'),
        new PeriodicElement('Md', false, 'green'),
        new PeriodicElement('No', false, 'green'),
        new PeriodicElement('Lr', false, 'green'),
      ],
    ]
  }

  getRows() {
    return this.periodicArray
  }

  getColumnsByRow(rowNumber = 0) {
    return this.periodicArray[rowNumber]
  }

  exportSelectedElementsToString() {
    let selectedElementString = ''
    for (const row in this.periodicArray) {
      for (const element in this.periodicArray[row]) {
        if (this.periodicArray[row][element].checked === true) {
          selectedElementString += `${this.periodicArray[row][element].name}, `
        }
      }
    }
    selectedElementString = selectedElementString.trim()
    if (selectedElementString.length > 0) {
      selectedElementString = selectedElementString.slice(0, selectedElementString.length - 1)
    }
    return selectedElementString
  }

  importElementsFromString(elementsString) {
    let arras = []
    arras = elementsString.split(',')

    for (const item of arras) {
      this.setElementCheckedByName(item)
    }
  }

  setElementCheckedByName(elementName) {
    for (const row in this.periodicArray) {
      for (const element in this.periodicArray[row]) {
        if (this.periodicArray[row][element].name.toLowerCase() === elementName.trim().toLowerCase()) {
          this.periodicArray[row][element].checked = true
        }
      }
    }
  }

  clearTable() {
    for (const row in this.periodicArray) {
      for (const element in this.periodicArray[row]) {
        this.periodicArray[row][element].checked = false
        this.periodicArray[row][element].disabled = false
      }
    }
  }

  importDisabledElementsFromString(elementsList) {
    let arras = []
    arras = elementsList.split(',')

    for (const item of arras) {
      this.setDisabledElementByName(item)
    }
  }

  setDisabledElementByName(elementName) {
    for (const row in this.periodicArray) {
      for (const element in this.periodicArray[row]) {
        if (this.periodicArray[row][element].name.toLowerCase() === elementName.trim().toLowerCase()) {
          this.periodicArray[row][element].disabled = true
        }
      }
    }
  }
}
