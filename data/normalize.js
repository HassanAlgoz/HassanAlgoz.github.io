const fs = require('fs')

const unicode = require('./unicode')

let dict = new Map();

let data = fs.readFileSync('./arabeyes.org.csv', { encoding: 'utf8' });
let dir = fs.readdirSync('./', {encoding: 'utf8' });
dir.filter(fname => fname !== 'data.csv' && fname.match(/\.csv$/))
.forEach(dir => {
  fs.readFile('./' + dir, {encoding: 'utf8'}, (err, data) => {
    if (err) return console.error(err);
    getCSVData(data)
  })
})

// One English word may have many meanings

async function getCSVData(data) {
  let numDuplicateWords = 0;

  // Clean the csv file
  data = data
  // Replace :: with space
  .replace(/\:/g, '')
  // Replace Arabic comma with English comma
  .replace(/،/g, ',')
  // Replace multiple spaces with one
  .replace(/\s\s+/g, ' ')

  let lines = data.split('\n')

  for(const line of lines) {

    // Skip single-word lines. i.e, words without their meaning.
    let values = line.split(",")
    if (!values[1] || values[1].trim().length === 0) {
      continue;
    }
    
    // Identify the English part and the Arabic part of the line.
    let englishPart = [], arabicPart = [];
    for(let i = 1; i < values.length; i++) {
      if (unicode.getLanguage(values[i]) === 'ar') {
        englishPart = values.slice(0, i);
        arabicPart = values.slice(i);
        break;
      }
    }

    if (!englishPart || !arabicPart) {
      continue;
    }

    // For each English-Arabic word pairs, make a key-value pair.
    for(const english of englishPart) {
      if (!english.trim()) continue;
      const normEnglish = unicode.normalizeEnglish(english)

      for (const arabic of arabicPart) {
        if (!arabic.trim()) continue;
        
        const normArabic = unicode.normalizeArabic(arabic)

        // if word is new
        if (!dict.get(normEnglish)) {
          dict.set(normEnglish, {
            text: english.trim(),
            arabic: [normArabic],
          })
        } else {
          // word already exists
          // but the arabic translation is different
          if (dict.get(normEnglish).arabic.indexOf(normArabic) === -1) {
            dict.get(normEnglish).arabic.push(normArabic)
            numDuplicateWords++;
          }
        }
      }
    }
  }

  console.log(`size:`, dict.size)
  console.log(`numDuplicateWords:`, numDuplicateWords)
  
  // Write to data.csv
  const writeStream = fs.createWriteStream('./data.csv', {encoding: 'utf8' })
  for (const [key, val] of dict) {
    writeStream.write(val.text + ',' + val.arabic.join(',') + '\n')
  }

}