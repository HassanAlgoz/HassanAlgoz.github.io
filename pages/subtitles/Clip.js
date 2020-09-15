export default function(obj) {
    if (!obj) {
        obj = {};
    }

    if (!obj.name) obj.name = "";
    if (!obj.authors) obj.authors = [];
    if (!obj.tags) obj.tags = [];
    if (!obj.externalURL) obj.externalURL = "";
    if (!obj.internalURL) obj.internalURL = "";
    if (!obj.duration) obj.duration = 0;
    if (!obj.texts) obj.texts = {};
    if (!obj.times) obj.times = [];

    // Initialize Languages
    obj.languages = Object.keys(obj.texts);
    if (!obj.languages || obj.languages.length === 0) {
        obj.languages = ["en", "ar"]; // the default two languages
    }

    // Initialzie Regions
    obj.regions = [];
    let k = 0;
    for(let i = 0; i < obj.times.length; i += 2) {
        let data = {};
        for(const code in obj.texts) {
            data[code] = obj.texts[code][k];
        }
        k++;

        obj.regions.push({
            start: obj.times[i],
            end:   obj.times[i+1],
            data:  data,
        });
    }

    return {
        ...obj,

        authorsIDs: obj.authors.map(a => a._id),

        getTexts(lang) {
            if (lang) {
                return this.regions.reduce((x, y) => x.concat(y.data[lang]), []);
            }

            const texts = {};
            for(const langCode of this.languages) {
                texts[langCode] = this.regions.reduce((x, y) => x.concat(y.data[langCode]), []);
            }
            return texts;
        },

        setRegions(regions) {
            this.regions = regions;
            // const _regions = [];
            // for(const r of regions) {
            //     _regions.push({
            //         start: r.start,
            //         end:   r.end,
            //         data:  r.data,
            //         id:    r.id,
            //     });
            // }
            // this.regions = _regions;

            // Check that no two regions interleave
            // for(let i = 0; i < regions.length - 1; i++) {
            //     let [a, b] = [regions[i], regions[i+1]];
            //     if (a.end > b.start) {
            //         console.log(`error: regions interleave: [${a.start.toFixed(2)}, ${a.end.toFixed(2)}] and [${b.start.toFixed(2)}, ${b.end.toFixed(2)}]`);
            //     }
            // }
        },

        updateRegion(region) {
            // let oldIndex = this.regions.findIndex(r => r.id === region.id);

            // let newIndex = oldIndex;
            // // Find place forward
            // for(let i = oldIndex + 1; i < this.regions.length - 1; i++) {
            //     // Shifted forward
            //     if (region.start > this.regions[i].start) {
            //         newIndex = i;
            //     } else {
            //         break;
            //     }
            // }

            // // Find place backward, if no place forward is found
            // for(let i = oldIndex - 1; i >= 0; i--) {
            //     // Shifted forward
            //     if (region.start < this.regions[i].start) {
            //         newIndex = i;
            //     } else {
            //         break;
            //     }
            // }

            // if (newIndex === oldIndex) {
            //     // Just updated the text

            // }
        },

        getPercentComplete(code) {
            let count = 0;
            let percent = 0;
            if (code) {
                count = this.texts[code].length;
                percent = count / (this.times.length / 2);
            } else {
                for(const c of this.languages) {
                    if (this.texts[c]) {
                        count += this.texts[c].length;
                    }
                }
                percent = count / (this.times.length / 2 * this.languages.length);
            }
            if (count === 0) return 0.00;
            return 100 * percent;
        },

        getNumberOfWords() {
            let count  = 0;
            for(const c of this.languages) {
                if (this.texts[c]) {
                    for(const str of this.texts[c]) {
                        if (str) {
                            count += str.split(" ").length;
                        }
                    }
                }
            }
            return count;
        },

        getAuthors() {
            return this.authors;
        },

        toJSON() {

            // Prepare texts and times arrays
            const texts = {};
            const times = [];
            for(const lang of this.languages) {
                texts[lang] = this.regions.reduce((x, y) => x.concat(y.data[lang]), []);
            }
            for(const r of this.regions) {
                times.push(r.start);
                times.push(r.end);
            }
            return {
                texts,
                times,
                name:        this.name,
                externalURL: this.externalURL,
                internalURL: this.internalURL,
                duration:    this.duration,
                authors:     this.authors,
            };
        },
    };
}