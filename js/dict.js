// Initialize Data
let dict = [];
let subset = [];

// Limits the number of rows that render on the page.
const limit = 100;

let links = [
  {
    url: '../data/arabeyes.org.csv',
    source: 'www.arabeyes.org',
    // https://www.arabeyes.org/Download_technical_dictionary
  },
  {
    url: '../data/arabicacademy.org.eg.csv',
    source: 'www.arabicacademy.org.eg',
    // http://www.arabicacademy.org.eg/%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%D8%A9/%D9%85%D8%B7%D8%A8%D9%88%D8%B9%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D8%AC%D9%85%D8%B9/ctl/FileViewer/mid/431/ItemID/1096
  },
  {
    url: '../data/arabterem.org.csv',
    source: 'www.arabterm.org',
    // http://www.arabterm.org/index.php?id=41&L=1&tx_3m5techdict_pi1[filterCategory]=47
  },
];

let ready = false;
async function init() {
  Promise.all(
    links.map((link, index) => {
      populateDict(link.url, index)
    })
  )
  .then(() => {
    ready = true;
  })
  .catch(console.error)
}
init()

async function populateDict(url, sourceIndex) {
  let res = await fetch(url)
  let text = await res.text()
  let lines = text.split('\n')
  for(const line of lines) {
    let [english, arabic] = line.split(",")
    if ((english && english.trim().length > 0) && (arabic && arabic.trim().length > 0)) {
      english = english.trim()
      arabic = arabic.trim()
      
      dict.push({
        
        english: {
          text: english,
          words: english.split(' ').map(unicode.normalizeEnglish).filter(word => !!word)
        },
        
        arabic: {
          text: arabic,
          words: arabic.split(' ').map(unicode.normalizeArabic).filter(word => !!word)
        },

        sourceIndex: sourceIndex,

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

  
  await wait(ready)
  randomize()
  render()

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
    <tr title="${links[entry.sourceIndex].source}">
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

  const intersection = [];
  for(let i = 0; i < arrays.length; i++) {
    let A = arrays[i];
    for(let j = 0; j < arrays.length; j++) {
      let B = arrays[j];
      if (i !== j) {
        intersection.push(A.filter(value => -1 !== B.indexOf(value)))
      }
    }
  }

  // Flatten the arrays into one array
  return intersection.reduce((A, B) => A.concat(B));
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