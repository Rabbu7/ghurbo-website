function generateRef() {
  const year = new Date().getFullYear()
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''

  for (let index = 0; index < 4; index += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return `GHB-${year}-${code}`
}

module.exports = generateRef
