const displayHitCall = (numericHitCall) => {
  switch (numericHitCall) {
  case 1:
    return 'Active'
  case 0:
    return 'Inactive'
  case -1:
    return 'Inconclusive'
  default:
    return numericHitCall
  }
}

export default displayHitCall
