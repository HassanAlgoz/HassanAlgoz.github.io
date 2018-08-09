// Array.prototype.flatten = function () {
//   return this.reduce((A, B) => A.concat(B));
// }

// Initialize Data
let dict = [];
let subset = [];

// Limits the number of rows that render on the page.
const limit = 100;

// Sources
// https://www.arabeyes.org/Download_technical_dictionary
// http://www.arabicacademy.org.eg/%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%D8%A9/%D9%85%D8%B7%D8%A8%D9%88%D8%B9%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D8%AC%D9%85%D8%B9/ctl/FileViewer/mid/431/ItemID/1096
// http://www.arabterm.org/index.php?id=41&L=1&tx_3m5techdict_pi1[filterCategory]=47

async function populateDict(url) {
  let res = await fetch(url)
  let text = await res.text()
  let lines = text.split('\n')
  
  for(const line of lines) {
    let values = line.split(",")

    // Identify the English part and the Arabic part of the line.
    let english = '', arabic = '';
    for(let i = 1; i < values.length; i++) {
      if (unicode.getLanguage(values[i]) === 'ar') {
        english = values.slice(0, i).join(',');
        arabic = values.slice(i).join(',');
        break;
      }
    }
    
    if (!english || !arabic) {
      continue;
    }

    if (english && arabic) {
      
      dict.push({
        
        english: {
          text: english,
          // Search words (like tags)
          words: english.split(' ')
        },
        
        arabic: {
          text: arabic,
          // Search words (like tags)
          words: arabic.split(' ')
        },

      });

    }
  }
}

// Get DOM Elements
let $input;
let $table;
window.addEventListener('load', async () => {
  $input = document.getElementById("search");
  $table = document.getElementById("table");

  async function init() {
    populateDict('../data/data.csv')
    .then(() => {
      randomize()
      render()
      console.log('No. Entries:', Object.keys(dict).length)
    })
    .catch(console.error)
  }
  init()

  $input.onkeyup = update;
  
})

function randomize() {
  subset = [];
  // Generate 100 random integers
  for(let i = 0; i < limit; i++) {
    let idx = Math.floor(Math.random() * dict.length);
    subset.push(dict[idx])
  }
}

function update(evt) {
  let input = evt.target.value;

  if (!input || input.trim().length === 0) {
    evt.target.value = input.trim()
    randomize()
    render()
    return;
  }
    
  switch(unicode.getLanguage(input)) {
    
    // English Input
    case 'en': {
      const inputWords = input.split(' ').map(unicode.normalizeEnglish).filter(w => !!w)
      const matches = inputWords.map(inputWord => {
        // each input word would contribute a whole pass of finding matches
        return dict.filter(entry => {
          return entry.english.words.findIndex(word => word.startsWith(inputWord)) >= 0;
        })
      })
    
      // take the intersection of the matches
      subset = arraysIntersection(matches)
      // sort based on number of words in input
      subset.sort((A, B) => {
        const diff = (A.english.words.length - inputWords.length) - (B.english.words.length - inputWords.length);
        return diff;
      })
      render()
    } break;

    // Arabic Input
    case 'ar': {
      const inputWords = input.split(' ').map(unicode.normalizeArabic).filter(w => !!w)
      const matches = inputWords.map(inputWord => {
        // each input word would contribute a whole pass of finding matches
        return dict.filter(entry => {
          return entry.arabic.words.findIndex(word => word.startsWith(inputWord)) >= 0;
        })
      })

      // take the intersection of the matches
      subset = arraysIntersection(matches)
      // sort based on number of words in input
      subset.sort((A, B) => {
        const diff = (A.arabic.words.length - inputWords.length) - (B.arabic.words.length - inputWords.length);
        return diff;
      })
      render()
    } break;
  }
}

function render() {
  let headerRow = `
  <tr class="header">
    <th style="width: 45%; text-align: right;">عربي</th>
    <th style="width: 55%; text-align: left;">English</th>
  </tr>`

  let rows = subset.slice(0, limit)
  .map(entry => (!!entry) ? `
    <tr>
      <td style="text-align: right; direction: rtl;">${entry.arabic.text}</td>
      <td style="text-align: left;">${entry.english.text}</td>
    </tr>
  `: null)
  .filter(entry => !!entry)
  .join('');

  $table.innerHTML = headerRow + rows;
}

function wait(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value) {
        resolve(value)
      }
    }, 1)
  })
}

function arraysIntersection(arrays) {
  if (arrays.length === 1) {
    return arrays[0];
  }

  const result = [];
  for(let i = 0; i < arrays.length; i++) {
    for(let j = 0; j < arrays.length; j++) {
      if (i === j) continue;
      result.push(arrays[i].filter(value => arrays[j].indexOf(value) >= 0))
    }
  }

  // Flatten the arrays into one array
  return result.reduce((A, B) => A.concat(B));
}

const unicode = {
  
  // getLanguage tells what language the string 'str' is, based on the first
  // character that doesn't satisfy isBoth.
  getLanguage(str) {
    for(let i = 0; i < str.length; i++) {
      if (this.char.isBoth(str[i])) continue;
      
      if (this.char.isArabic(str[i])) {
        return 'ar'
      } else if (this.char.isEnglish(str[i])) {
        return 'en'
      }
    }
    return null;
  },


  // normalizeArabic removes tashkeel, tatweel, and removes punctuation from 'str'.
  normalizeArabic(str='') {
    return (
      str
      // Trim Whitespace
      .trim()
      // Remove tashkeel
      .replace(/ّ|َ|ً|ُ|ٌ|ِ|ٍ|ْ/g, '')
      // Remove tatweel
      .replace(/ـ/g, '')
    )
  },

  // normalizeEnglish does lowercase, and remove punctuation 'str'.
  normalizeEnglish(str='') {
    return (
      str
      // Trim Whitespace
      .trim()
      // Lowercase
      .toLowerCase()
      // Remove Punctuation
      .replace(/[^A-Za-z0-9_]/g, '')
    )
  },

  char: {
    // isEnglish returns true when 'char' is in the range of English unicode
    // characters as referenced here: https://unicode-table.com/en/#0021
    // excluding punctuations since they appear in other languages as well.
    isEnglish(char) {
      return (
        ('\u0021' <= char && char <= '\u007E') ||
        (char == '\u003F' /*?*/) ||
        ('\u0041' <= char && char <= '\u005A') ||
        ('\u0061' <= char && char <= '\u007A')
      )
    },
    
    // isArabic returns true when 'char' is in the range of Arabic unicode
    // characters as referenced here: https://unicode-table.com/en/#060C
    // including Arabic-only punctuations
    isArabic(char) {
      return '\u060C' <= char && char <= '\u066C'
    },
    
    // isBoth returns true when 'char' is backspace or a punctuation
    // that appears in English or Arabic.
    isBoth(char) {
      return (
        ('\u020C' <= char && char <= '\u003E') ||
        (char == '\u0040' /*@*/) ||
        ('\u005B' <= char && char <= '\u0060') ||
        ('\u007B' <= char && char <= '\u007E')
      )
    },
  
  },
}