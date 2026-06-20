function toTitleCase(value) {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function normalizeCity(name) {
  if (!name) return ''

  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[.'’]/g, '')
    .replace(/\s+/g, ' ')

  const aliases = {
    "coxs bazar": "Cox's Bazar",
    coxsbazar: "Cox's Bazar",
    "cox's bazar": "Cox's Bazar",
    "saint martin": 'Saint Martin Island',
    "st martin": 'Saint Martin Island',
    saintmartin: 'Saint Martin Island',
    dhaka: 'Dhaka',
    dacca: 'Dhaka',
    chittagong: 'Chattogram',
    chattogram: 'Chattogram',
    sylhet: 'Sylhet',
    rajshahi: 'Rajshahi',
    khulna: 'Khulna',
    barishal: 'Barishal',
    barisal: 'Barishal',
    rangpur: 'Rangpur',
    mymensingh: 'Mymensingh',
    comilla: 'Cumilla',
    cumilla: 'Cumilla',
    teknaf: 'Teknaf',
    sreemangal: 'Sreemangal',
    srimangal: 'Sreemangal',
    sundarbans: 'Sundarbans',
    sajek: 'Sajek Valley',
    bandarbans: 'Bandarban',
    bandarban: 'Bandarban',
    rangamati: 'Rangamati',
    'moulvibazar': 'Moulvibazar',
    'moulvi bazar': 'Moulvibazar',
  }

  return aliases[normalized] || toTitleCase(normalized)
}

module.exports = normalizeCity
