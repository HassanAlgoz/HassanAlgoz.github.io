import unicode from "./unicode.js";

// Initialize Data
let dict = [];
let subset = [];

// Limits the number of rows that render on the page.
const limit = 10;

async function populateDict(url) {
    let res = await fetch(url);
    let text = await res.text();
    let lines = text.split("\n");

    for(const line of lines) {
        let [english, arabic] = line.split(",");

        english = english ? english.trim() : null;
        arabic = arabic ? arabic.trim() : null;

        if (!english || !arabic) {
            continue;
        }

        if (english && arabic) {

            dict.push({

                english: {
                    text:  english,
                    // Search words (like tags)
                    words: english.split(" ").map(unicode.normalizeEnglish).filter(w => !!w),
                },

                arabic: {
                    text:  arabic,
                    // Search words (like tags)
                    words: arabic.split("،").map(unicode.normalizeArabic).filter(w => !!w),
                },

            });

        }
    }
}

// Get DOM Elements
let $input = null;
let $table = null;
window.addEventListener("load", async () => {
    $input = document.getElementById("search");
    $table = document.getElementById("table");

    // try {
    //   await populateDict('https://www.arabeyes.org/techdict/techdict.csv')
    //   console.log('Successfully fetched dictionary from www.arabeyes.org')
    // } catch (err) {
    //   console.warn(`Coudn't fetch dictionary from www.arabeyes.org :`, err)
    try {
        await populateDict("/data/techdict.csv");
        console.log("Successfully fetched the saved dictionary copy of www.arabeyes.org");
    } catch (err) {
        console.error("Coudn't fetch dictionary:", err);
    }
    // }

    randomize();
    render();
    console.log("# Terms:", Object.keys(dict).length);

    $input.onkeyup = update;

});

function randomize() {
    // Making the size of the array 'limit' at minimum
    subset[limit] = 0;
    subset = subset.slice(0, limit);
    // Generate 'limit' amount of random integers
    for(let i = 0; i < limit; i++) {
        let idx = Math.floor(Math.random() * dict.length);
        subset[i] = dict[idx];
    }
}

function update(evt) {
    let input = evt.target.value;

    if (!input || input.trim().length === 0) {
        evt.target.value = input.trim();
        randomize();
        render();
        return;
    }

    switch(unicode.getLanguage(input)) {

    // English Input
    case "en": {
        const inputWords = input.split(" ").map(unicode.normalizeEnglish).filter(w => !!w);
        const matches = inputWords.map(inputWord => {
        // each input word would contribute a whole pass of finding matches
            return dict.filter(entry => {
                return entry.english.words.findIndex(word => word.startsWith(inputWord)) >= 0;
            });
        });

        // take the intersection of the matches
        subset = arraysIntersection(matches);
        // sort based on number of words in input
        subset.sort((A, B) => {
            const diff = A.english.words.length - inputWords.length - (B.english.words.length - inputWords.length);
            return diff;
        });
        render();
    } break;

    // Arabic Input
    case "ar": {
        const inputWords = input.split(" ").map(unicode.normalizeArabic).filter(w => !!w);
        const matches = inputWords.map(inputWord => {
        // each input word would contribute a whole pass of finding matches
            return dict.filter(entry => {
                return entry.arabic.words.findIndex(word => word.startsWith(inputWord)) >= 0;
            });
        });

        // take the intersection of the matches
        subset = arraysIntersection(matches);
        // sort based on number of words in input
        subset.sort((A, B) => {
            const diff = A.arabic.words.length - inputWords.length - (B.arabic.words.length - inputWords.length);
            return diff;
        });
        render();
    } break;
    }
}

function render() {
    let headerRow = `
  <tr class="header">
    <th style="width: 45%; text-align: right;">عربي</th>
    <th style="width: 55%; text-align: left;">English</th>
  </tr>`;

    let rows = subset.slice(0, limit)
        .map(entry => entry ? `
    <tr>
      <td style="text-align: right; direction: rtl;">${entry.arabic.text}</td>
      <td style="text-align: left;">${entry.english.text}</td>
    </tr>
  `: null)
        .filter(entry => !!entry)
        .join("");

    $table.innerHTML = headerRow + rows;
}

function wait(value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (value) {
                resolve(value);
            }
        }, 1);
    });
}

function arraysIntersection(arrays) {
    if (arrays.length === 1) {
        return arrays[0];
    }

    const result = [];
    for(let i = 0; i < arrays.length; i++) {
        for(let j = 0; j < arrays.length; j++) {
            if (i === j) continue;
            result.push(arrays[i].filter(value => arrays[j].indexOf(value) >= 0));
        }
    }

    // Flatten the arrays into one array
    return result.reduce((A, B) => A.concat(B));
}

