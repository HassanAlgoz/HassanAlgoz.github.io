console.log("script loaded");
// import * as sdk from "./sdk.js";
import * as fio from "./fio.js";
import * as storage from "./storage.js";
import Clip from "./Clip.js";
import allLanguages from "./languages.js";
import rules from "./rules.js";

const WaveSurfer = window.WaveSurfer;
let wavesurfer = window.wavesurfer;

let updateRegions = null;

window.addEventListener("error", (evt) => {
    console.log("catched this error:", evt.error);
});

const app = new Vue({
    el:   "#app",
    data: {
        clip: null,

        allLanguages: allLanguages,
        rules:        rules,

        searchBox: {
            A: {
                word:           "",
                lastWord:       "",
                i:              -1,
                regionsIndexes:  [],
                replace:        "",
            },

            B: {
                word:           "",
                lastWord:       "",
                i:              -1,
                regionsIndexes:  [],
                replace:        "",
            },
        },

        settings: {
            enableVideo:   true,
            selectedLang: "ar",

            // Auto Segmentation
            peaksLength:       512,
            silenceMinValue:   0.0015,
            silenceMinSeconds: 0.25,
        },

        mediaURL: "",

        langA: "en",
        langB: "ar",

        zoom:     100,
        zoomStep: 20,
        zoomMin:  20,
        zoomMax:  400,

        errors:       [],
        isSaved:      true,
        isSaving:     false,
        lastSaveTime: Date.now(),

        captionWindowSize: 1,
        captionCursor:     1,
        regionIndex:       0,

        selectedRegion: null,

        shortcuts: [
            { key: "End", desc: "forward" },
            { key: "Home", desc: "backward" },
            { key: "Page Down", desc: "next segment" },
            { key: "Page Up", desc: "previous segment" },
            { key: "Esc", desc: "play/pause" },
            // { key: 'shift+r', desc: 'repeat segment' },
            // { key: 'shift+m', desc: 'mute/unmute' },
        ],

        player:        null,
        tracks:        [],
        isPlayerReady: false,
        isWaveReady:   false,

        ctrlPressed:  false,
        shiftPressed: false,

        menuVisible: false,

        shiftAmount: 1,
    },

    watch: {

        zoom: function(val) {
            wavesurfer.zoom(val);
        },

        regionIndex: function(idx) {
            if (idx <= this.captionWindowSize) {
                this.captionCursor = this.captionWindowSize;
            } else if (idx >= this.clip.regions.length - 1) {
                this.captionCursor = this.clip.regions.length - 1 - this.captionWindowSize;
            } else {
                this.captionCursor = idx;
            }
        },

        langA: function(val) {
            this.updateLabels();
        },

    },

    async created() {

        // Fetch Clip Data and initialize
        this.clip = new Clip(storage.load("clip"));

        if (this.clip.languages.length > 0) {
            this.langA = this.clip.languages[0];
        }
        if (this.clip.languages.length > 1) {
            this.langB = this.clip.languages[1];
        }


        window.addEventListener("contextmenu", (evt) => {
            // console.log('contextmenu.target:', evt.target);
            // console.log('window, evt.defaultPrevented:', evt.defaultPrevented);
            // evt.preventDefault();
            // return false;
        });

        window.addEventListener("click", (evt) => {
            if (this.menuVisible) {
                document.getElementById("contextMenu").setAttribute("hidden", "");
                this.menuVisible = false;
            }
        });

        document.addEventListener("keyup", (evt) => {
            this.shiftPressed = evt.shiftKey;
            this.ctrlPressed = evt.ctrlKey;
        });
        // Bind keys to actions
        document.addEventListener("keydown", async (evt) => {
            this.shiftPressed = evt.shiftKey;
            this.ctrlPressed = evt.ctrlKey;

            let keyMap = {
                33: this.prevCaption, // Page-Up
                34: this.nextCaption, // Page-Down
                36: this.back, // Home
                35: this.forth, // End
                27: this.togglePlay, // esc
                // 77: this.toggleMute, // M
                // 82: this.play, // R
                // 46: this.remove, /* Delete */
            };
            // let ctrlMap = {
            //     83: this.save,
            // };

            let disabledKeys = [
                116, // F5
                9, // TAB
            ];
            let ctrlDisabledKeys = [
                82, // R
            ];


            if (keyMap[evt.keyCode]) {
                evt.preventDefault();
                keyMap[evt.keyCode]();
            } else if (disabledKeys.includes(evt.keyCode)) {
                evt.preventDefault();
                console.log("key:", evt.key, "is disabled");
            } else if (this.ctrlPressed && ctrlDisabledKeys.includes(evt.keyCode)) {
                evt.preventDefault();
            } else {
                console.log(`keyCode ${evt.keyCode} doesn't map`);
            }

            // Ctrl+S Saves
            if (evt.keyCode === 83 && this.ctrlPressed) {
                evt.preventDefault();
                await this.save();
            }

        });

        document.addEventListener("wheel", (evt) => {
            // wheel-up
            if (evt.shiftKey && evt.deltaY < 0) {
                this.zoom = Math.min(this.zoomMax, this.zoom + this.zoomStep);
            }

            // wheel-down
            if (evt.shiftKey && evt.deltaY > 0) {
                this.zoom = Math.max(this.zoomMin, this.zoom - this.zoomStep);
            }
        });

        // Init and load WaveSurfer
        document.addEventListener("DOMContentLoaded", () => {
            wavesurfer = WaveSurfer.create({
                container:     "#waveform",
                height:        192,
                pixelRatio:    1,
                // barWidth:      1,
                // barGap:        1,
                scrollParent:  true,
                normalize:     true,
                minimap:       true,
                autoCenter:    true,
                // responsive: false,
                waveColor:     "#ddd",
                progressColor: "#999",
                cursorColor:   "red",
                // hideScrollbar: true,
                // backend:      'MediaElement',
                plugins:       [
                    WaveSurfer.regions.create({
                        // Doesn't seem to work
                        // snapToGridInterval: 1,
                        // snapToGridOffset:   0,
                    }),
                    WaveSurfer.minimap.create({
                        height:        30,
                        waveColor:     "#ddd",
                        progressColor: "#999",
                        cursorColor:   "red",
                    }),
                    WaveSurfer.timeline.create({
                        container: "#wave-timeline",
                    }),

                ],
            });

            /* Regions */
            loadRegions(this.clip.regions);

            updateRegions = debounce(() => {
                this.isSaved = false;
                this.clip.setRegions(
                    Object.values(wavesurfer.regions.list).sort((a, b) => a.start - b.start)
                );
                this.clip.getTexts();
                this.updateLabels();
            }, 100);

            wavesurfer.once("ready", () => {
                console.log("Using wavesurfer.js " + WaveSurfer.VERSION);

                this.isWaveReady = true;
                this.clip.duration = wavesurfer.getDuration();
                wavesurfer.zoom(this.zoom);
                wavesurfer.enableDragSelection({});
                this.clip.getTexts();
                this.updateLabels();
            });

            wavesurfer.on("error", function(e) {
                console.warn("[WaveSurfer]:", e);
            });

            // When dragging or resizing is finished
            wavesurfer.on("region-update-end", updateRegions);
            // When the region's options are updated, including start and end
            wavesurfer.on("region-updated", () => updateRegions);

            wavesurfer.on("region-removed", updateRegions);

            wavesurfer.on("region-click", (region, evt) => {
                this.regionIndex = this.clip.regions.findIndex((r, i) => r.id === region.id);
            //     // console.log('region-click event:', evt);
            //     // evt.stopPropagation();
            //     // evt.preventDefault()
            //     // region.play();
            });


            wavesurfer.on("region-created", (region) => {
                region.color = randomColor();
                // Right Click
                region.element.addEventListener("contextmenu", (evt) => {
                    handleRegionContextMenu(evt, region);
                });
                updateRegions();
            });

            wavesurfer.on("region-play", (region) => {
                console.log("region-play");
                this.regionIndex = this.clip.regions.findIndex((r, i) => r.id === region.id);
                region.once("out", () => {
                    console.log("region out");
                // wavesurfer.pause();
                // wavesurfer.seekAndCenter(region.start / wavesurfer.getDuration());
                });
            });

            wavesurfer.on("region-in", (region) => {
                console.log("region-in");
                this.regionIndex = this.clip.regions.findIndex((r, i) => r.id === region.id);
                region.once("out", () => {
                    console.log("region out");
                // wavesurfer.pause();
                // wavesurfer.seekAndCenter(region.start / wavesurfer.getDuration());
                });
            });

            // sdk.fetchData('/api/getClip?id=' + sdk.query('id'))
            //     .then(data => {
            //         this.clip = new Clip(data);

            //         if (this.clip.languages.length > 0) {
            //             this.langA = this.clip.languages[0];
            //         }
            //         if (this.clip.languages.length > 1) {
            //             this.langB = this.clip.languages[1];
            //         }

        //         // Clip Regions
        //         loadRegions(this.clip.regions);
        //     });
        });
    },
    computed: {

        usedLanguages() {
            let result = {};
            for(const lang in this.clip.languages) {
                result[lang] = Object.assign(this.allLanguages[lang], {captionsURL: ""});
            }
            console.log(result);
            return result;
        },

        regions() {
            return this.clip.regions;
        },
        // captions() {
        //     return {
        //         [this.langA]: this.clip.regions.reduce((x, y) => x.concat(y.data[this.langA]), []),
        //         [this.langB]: this.clip.regions.reduce((x, y) => x.concat(y.data[this.langB]), []),
        //     };
        // },

        captionWindow() {
            let start = this.regionIndex - this.captionWindowSize;
            let end   = this.regionIndex + this.captionWindowSize + 1;
            let diff = this.regionIndex - this.captionCursor;
            if (diff !== 0) {
                if (diff > 0) {
                    start -= 1;
                } else {
                    end += 1;
                }
            }
            return this.clip.regions.slice(Math.max(0, start), Math.min(end, this.clip.regions.length));
        },
    },

    methods: {

        mergeLeft() {
            if (!this.selectedRegion) return;
            let idx = this.clip.regions.findIndex(r => this.selectedRegion.id === r.id);
            if (idx === 0) return;
            this.mergeRegions(idx-1, idx);
        },

        mergeRight() {
            if (!this.selectedRegion) return;
            let idx = this.clip.regions.findIndex(r => this.selectedRegion.id === r.id);
            if (idx === this.clip.regions.length - 1) return;
            this.mergeRegions(idx, idx+1);
        },

        mergeRegions(i, j) {
            const a = this.clip.regions[i];
            const b = this.clip.regions[j];
            a.end = b.end;
            for(const code in b.data) {
                if (!a.data[code]) {
                    a.data[code] = "";
                }
                if (a.data[code].length > 0) {
                    a.data[code] += " " + b.data[code];
                }
            }
            this.regionIndex = j;
            this.remove();
            wavesurfer.drawBuffer();
        },

        formatDayTime(t) {
            const str = new Date(t).toLocaleTimeString();
            return str.substr(0, 4) + str.substr(7, 3);
        },

        updateLabels() {
            for(const r of this.clip.regions) {
                if (r.data[this.langA]) {
                    r.element.setAttribute("data-region-label", r.data[this.langA]);
                }
            }
        },

        applyLanguageRules() {
            for(const code of this.clip.languages) {
                for(const lang in this.rules) {
                    let rs = this.rules[lang];
                    for(const r of rs) {
                        if ((lang === "all" || lang === code) && r.flag) {
                            for(const reg of this.clip.regions) {
                                reg.data[code] = reg.data[code] ? r.func(reg.data[code]) : "";
                            }
                        }
                    }
                }
            }
            // updateRegions();
        },

        findWord(lang) {
            const searchBox = lang === this.langA
                ? this.searchBox.A
                : this.searchBox.B;

            if (!searchBox.word) return;

            // move search cursor if still searching the same word
            if (searchBox.lastWord === searchBox.word) {

                if (!searchBox.regionsIndexes || searchBox.regionsIndexes.length === 0)  {
                    searchBox.lastWord = "";
                    this.findWord(lang);
                    return;
                }

                searchBox.i = (searchBox.i + 1) % searchBox.regionsIndexes.length;

                this.regionIndex = searchBox.regionsIndexes[searchBox.i];
                return;
            }

            // find word index if searching a new word
            searchBox.lastWord = searchBox.word;
            searchBox.i = 0;

            searchBox.regionsIndexes = this.clip.getTexts(lang).map((str, idx) => {
                if (str.toLocaleLowerCase().includes(searchBox.word.toLocaleLowerCase())) {
                    return idx;
                }
                return -1;
            }).filter(idx => idx !== -1);

            if (searchBox.regionsIndexes.length === 0) return;

            this.regionIndex = searchBox.regionsIndexes[searchBox.i];
        },

        replaceWord(lang) {
            const searchBox = lang === this.langA
                ? this.searchBox.A
                : this.searchBox.B;

            if (!searchBox.word || !searchBox.replace) return false;

            if (!searchBox.regionsIndexes || searchBox.regionsIndexes.length === 0) {
                this.findWord(lang);
            }

            const str = this.clip.regions[this.regionIndex].data[lang];
            const regex = new RegExp(searchBox.word, "gmi");
            if (regex.test(str)) {
                this.clip.regions[this.regionIndex].data[lang] = str.replace(regex, searchBox.replace);
                searchBox.regionsIndexes.splice(searchBox.i, 1);
                searchBox.i--;
                updateRegions();
                if (searchBox.regionsIndexes.length > 0) {
                    return true;
                }
            } else {
                this.findWord(lang);
                if (!searchBox.regionsIndexes || searchBox.regionsIndexes.length === 0) return false;
                this.replaceWord(lang);
            }
        },

        replaceAll(lang) {
            const searchBox = lang === this.langA
                ? this.searchBox.A
                : this.searchBox.B;

            if (!searchBox.word || !searchBox.replace) return;

            for(let cond = true; cond; cond = this.replaceWord(lang));
        },

        shiftAll() {
            if (!this.clip.regions || !this.clip.regions.length > 0) return;
            for(let i = 0; i < this.clip.regions.length; i++) {
                this.clip.regions[i].start += this.shiftAmount;
                this.clip.regions[i].end += this.shiftAmount;
            }
        },

        percentComplete(code) {
            if (!this.clip.regions || !this.clip.regions.length > 0) return 0;
            let count = 0;
            for(let i = 0; i < this.clip.regions.length; i++) {
                if (this.clip.regions[i].data[code]) count++;
            }
            return Number.parseInt(100 * count / this.clip.regions.length);
        },

        showContextMenu(region, evt) {
            document.getElementById("contextMenu").style.left = `${evt.pageX}px`;
            document.getElementById("contextMenu").style.top = `${evt.pageY}px`;
            document.getElementById("contextMenu").removeAttribute("hidden");
            this.menuVisible = true;
            this.selectedRegion = region;
            return false;
        },

        save () {
            // 1. Before
            this.isSaving = true;
            // 2. Save
            this.applyLanguageRules();
            storage.save("clip", this.clip.toJSON());
            // 3. After: successful save
            this.isSaving = false;
            this.isSaved = true;
            this.lastSaveTime = Date.now();

            // sdk.postJSON('/api/saveClip?id=' + this.clip._id, this.clip.toJSON())
            //     .then(() => {
            //         // 3. After: successful save
            //         this.isSaving = false;
            //         this.isSaved = true;
            //         this.lastSaveTime = Date.now();
            //         this.clip.regions = new Clip(this.clip).regions;
            //     })
            //     .catch((err) => {
            //         console.log('error while saving:', err);
            //     });
        },

        exportAsSRT() {
            for(const code of this.clip.languages) {
                const srt = fio.encodeSRT(this.clip.getTexts(code), this.clip.times);
                fio.downloadText(srt, `${this.clip.name}.${code}.srt`);
            }
        },

        exportAsVTT() {
            for(const code of this.clip.languages) {
                const vtt = fio.encodeVTT(this.clip.getTexts(code), this.clip.times);
                fio.downloadText(vtt, `${this.clip.name}.${code}.srt`);
            }
        },

        exportAsSBV() {
            for(const code of this.clip.languages) {
                const sbv = fio.encodeSBV(this.clip.getTexts(code), this.clip.times);
                fio.downloadText(sbv, `${this.clip.name}.${code}.sbv`);
            }
        },

        exportAsPlaintext() {
            const text = {};
            for(const code of this.clip.languages) {
                text[code] = this.clip.regions.reduce((x, y) => x.concat(y.data[code]), []);
                fio.downloadText(text[code].join(" "), `${this.clip.name}.${code}.txt`);
            }
        },

        autoSegment() {
            if (!this.mediaURL) {
                console.log("no file loaded yet to auto segment");
                return;
            }
            loadRegions(
                extractRegions(
                    wavesurfer.backend.getPeaks(this.settings.peaksLength),
                    wavesurfer.getDuration(),
                    this.settings.silenceMinValue,
                    this.settings.silenceMinSeconds,
                )
            );
            updateRegions();
        },

        resetSegmentSettings() {
            this.settings.peaksLength = 512;
            this.settings.silenceMinValue = 0.0015;
            this.settings.silenceMinSeconds = 0.25;
        },

        assignProjectFiles(files) {
            if (!files || !(files instanceof FileList)) {
                console.log("invalid project files assignment");
                return;
            }
            // Load one media file (so if many exists, only first one will be loaded)
            const fs = Object.values(files);
            const mediaFile = fs.find(f => f.type.startsWith("audio") || f.type.startsWith("video"));
            if (mediaFile) {
                loadMediaFile(mediaFile);
            }
            // Load caption files
            this.assignCaptionFiles(fs);
        },

        async assignCaptionFiles(files) {

            for(const file of files) {
                // Check file format
                if (file.name.endsWith("vtt") || file.name.endsWith("srt") || file.name.endsWith("sbv")) {
                    // Get language
                    const parts = file.name.split(".");
                    if (parts.length >= 2) {
                        const langCode = parts[parts.length - 2];
                        if (Object.keys(this.allLanguages).indexOf(langCode) >= 0) {

                            // Read vtt file and create regions with text
                            const text = await fio.loadText(file);
                            let blocks = null;
                            if (file.name.endsWith("vtt")) {
                                blocks = fio.decodeVTT(text);
                            }  else if (file.name.endsWith("srt")) {
                                blocks = fio.decodeSRT(text);
                            } else if (file.name.endsWith("sbv")) {
                                blocks = fio.decodeSBV(text);
                            }

                            const newRegions = [];
                            for(let i = 0; i < blocks.length; i++) {
                                let block = blocks[i];
                                newRegions.push({
                                    start: block.start,
                                    end:   block.end,
                                    data:  {
                                        [langCode]: block.text,
                                    },
                                });
                            }
                            loadRegions(newRegions);
                        } else {
                            console.log("invalid language code:", langCode);
                        }
                    } else {
                        console.log("invalid file name:", file.name);
                    }
                } else {
                    console.log("invalid file:", file);
                }
            }
            updateRegions();
        },

        togglePlay() {
            if (this.player) {
                if (this.player.paused()) {
                    this.player.play();
                } else {
                    this.player.pause();
                }
            } else {
                wavesurfer.playPause();
            }
        },

        play() {
            let region = this.clip.regions[this.regionIndex];
            region.play();
            // wavesurfer.play(region.start);
        },

        focus() {
            let region = this.clip.regions[this.regionIndex];
            wavesurfer.seekAndCenter(region.start / wavesurfer.getDuration());
        },

        back() {
            wavesurfer.skipBackward();
        },

        forth() {
            wavesurfer.skipForward();
        },

        jumpToAndPlay(time) {
            wavesurfer.seekAndCenter(time / wavesurfer.getDuration());
            wavesurfer.play();
        },

        toggleMute() {
            // console.log("toggleMute");
            // wavesurfer.toggleMute();
        },

        prevCaption() {
            if (!this.clip.regions || this.clip.regions.length === 0 || this.regionIndex === 0) return;

            if (this.clip.regions[this.clip.regions.length - 1].end <= wavesurfer.getCurrentTime()) {
                //
            } else {
                this.regionIndex--;
            }

            let region = this.clip.regions[this.regionIndex];
            if (this.isWaveReady) {
                wavesurfer.seekAndCenter(region.start / wavesurfer.getDuration());
            }
        },

        nextCaption() {
            if (!this.clip.regions || this.clip.regions.length === 0) return;

            this.regionIndex = Math.min(this.regionIndex + 1, this.clip.regions.length - 1);
            let region = this.clip.regions[this.regionIndex];

            if (!this.isWaveReady) return;
            if (wavesurfer.getCurrentTime() >= region.start) return;
            wavesurfer.seekAndCenter(region.start / wavesurfer.getDuration());
        },

        isActiveCaptionBox(i) {
            if (!this.isWaveReady) return -1;

            let region = this.clip.regions[this.regionIndex];
            if (wavesurfer.getCurrentTime() >= region.end) return false;

            let diff = this.regionIndex - this.captionCursor;

            if (diff === -1) {
                return i === 0;
            } else if (diff === 0) {
                return i === 1;
            } else if (diff === 1) {
                return i === 2;
            }
        },

        remove() {
            if (!this.clip.regions[this.regionIndex]) return;

            this.clip.regions[this.regionIndex].remove();
            this.clip.regions.splice(this.regionIndex, 1);
            if (!this.clip.regions[this.regionIndex]) {
                if (this.regionIndex > 0) {
                    this.regionIndex--;
                }
            }
        },

        removeAll() {
            wavesurfer.clearRegions();
            this.clip.regions = [];
            updateRegions();
        },
    },

    filters: {
        formatTime(t) {
            // return Number.parseInt(t.toFixed(0));
            return new Date(t * 1000).toISOString()
                .substr(12, 7);
        },

    },
});

document.addEventListener("DOMContentLoaded", function() {
    if (!window.AudioContext && !window.webkitAudioContext) {
        console.error("your browser doesn't support Web Audio which is necessary to run the app, consider using Chrome");
        return;
    }
});

function handleRegionContextMenu(evt, region) {
    evt.preventDefault();
    evt.stopPropagation();
    app.regionIndex = app.regions.findIndex((r, i) => r.id === region.id);
    app.showContextMenu(region, evt);
    return false;
}

function _loadRegions (regions) {
    for(const r of regions) {

        r.start = Number(r.start.toFixed(3));
        r.end = Number(r.end.toFixed(3));
        r.drag = true;
        r.resize = true;
        r.color = randomColor();

        // find reigon of same start time and end time, and replace it
        let regionX = Object.values(wavesurfer.regions.list).find(x => x.start === r.start && x.end === r.end);
        if (regionX) {
            for(const code in r.data) {
                if (!regionX.data[code]) {
                    regionX.data[code] = "";
                }
                if (regionX.data[code].length > 0) {
                    regionX.data[code] += " " + r.data[code];
                } else {
                    regionX.data[code] = r.data[code];
                }
            }
        } else {
            const reg = wavesurfer.addRegion(r);

            reg.element.addEventListener("contextmenu", (evt) => {
                handleRegionContextMenu(evt, reg);
            });
        }
    }
}

function loadRegions(regions) {
    if (!app.isWaveReady) {
        setTimeout(() => loadRegions(regions), 50);
        return;
    }
    _loadRegions(regions);
}

/**
* Extract regions separated by silence.
*/
function extractRegions(peaks, duration, silenceMinValue, silenceMinSeconds) {
    // eslint-disable-next-line no-shadow
    const length = peaks.length;
    const coef = duration / length;
    const minLen = silenceMinSeconds / coef;

    // Gather silence indices
    const silences = [];
    Array.prototype.forEach.call(peaks, function(val, index) {
        if (Math.abs(val) <= silenceMinValue) {
            silences.push(index);
        }
    });

    // Cluster silence values
    const clusters = [];
    silences.forEach(function(val, index) {
        if (clusters.length && val === silences[index - 1] + 1) {
            clusters[clusters.length - 1].push(val);
        } else {
            clusters.push([val]);
        }
    });

    // Filter silence clusters by minimum length
    const fClusters = clusters.filter(function(cluster) {
        return cluster.length >= minLen;
    });

    // Create regions on the edges of silences
    const regions = fClusters.map(function(cluster, index) {
        const next = fClusters[index + 1];
        return {
            start: cluster[cluster.length - 1],
            end:   next ? next[0] : length - 1,
        };
    });

    // Add an initial region if the audio doesn't start with silence
    const firstCluster = fClusters[0];
    if (firstCluster && firstCluster[0] !== 0) {
        regions.unshift({
            start: 0,
            end:   firstCluster[firstCluster.length - 1],
        });
    }

    // Filter regions by minimum length
    const fRegions = regions.filter(function(reg) {
        return reg.end - reg.start >= minLen;
    });

    // Return time-based regions
    return fRegions.map(function(reg) {
        return {
            start: Math.round(reg.start * coef * 10) / 10,
            end:   Math.round(reg.end * coef * 10) / 10,
        };
    });
}

/**
* Random RGBA color.
*/
function randomColor() {
    let alpha = 0.1;
    return (
        "rgba(" +
        [
            ~~(Math.random() * 255),
            ~~(Math.random() * 255),
            ~~(Math.random() * 255),
            alpha || 1,
        ] +
        ")"
    );
}


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    let timeout = null;
    return function() {
        let context = this, args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


window.addEventListener("load", () => {

    $("[data-toggle=\"tooltip\"]").tooltip();

    for(const dropzone of document.getElementsByClassName("dropzone")) {
        // Drop file on document
        dropzone.addEventListener("drop", function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            app.assignProjectFiles(evt.dataTransfer.files);
            // dropzone.classList.remove('gray');
        }, false);

        dropzone.addEventListener("dragenter", function(evt) {
            // evt.preventDefault();
            // dropzone.classList.add('gray');
        });

        dropzone.addEventListener("dragleave", function(evt) {
            evt.preventDefault();
            // dropzone.classList.remove('gray');
        });
    }
});
window.addEventListener("dragenter", (evt) => evt.preventDefault());
window.addEventListener("dragover", (evt) => evt.preventDefault());
window.addEventListener("drop", (evt) => evt.preventDefault());


function loadMediaFile(file) {

    // Check file type
    if (!file.type.startsWith("audio") && !file.type.startsWith("video")) {
        console.log("error: file is neither audio nor video:", file);
        return;
    }

    const objectURL = URL.createObjectURL(file);
    app.mediaURL = objectURL;
    wavesurfer.load(app.mediaURL);
    app.clip.name = file.name;
}