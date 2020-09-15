export function loadText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(evt) {
            resolve(evt.target.result);
        };
        reader.onerror = function(err) {
            reject(err);
        };
        reader.readAsText(file);
    });
}

export function downloadText(text, fname) {
    const blob = new Blob([text], { type: "text/plain" });
    if (window.saveAs) {
        window.saveAs(blob, fname);
    } else if (navigator.saveBlob) {
        navigator.saveBlob(blob, fname);
    } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href",url);
        link.setAttribute("download",fname);
        const evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(evt);
    }
}

export function decodeVTT(text) {
    let lines = text.trim().split("\n");

    // Find first block
    const firstTimestampIndex = lines.findIndex((l) => l.indexOf(" --> ") >= 0);
    lines = lines.slice(firstTimestampIndex);

    let s = 0;
    let array = [];
    for(let i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("-->") >= 0) {
            s = i;
        } else if (lines[i] === "") {
            array.push(lines.slice(s, i));
        }
    }
    array.push(lines.slice(s)); // last block
    // array[i][0] is: from --> to
    // array[i][1:] is the text
    for(let i = 0; i < array.length; i++) {
        const [start, end] = array[i][0].split(" --> ");
        array[i] = {
            start: decodeTime(start),
            end:   decodeTime(end),
            text:  array[i].slice(1).join("\n"),
        };
    }
    function decodeTime(time) {
        let [hh, mm, ssttt] = time.split(":");
        return Number(ssttt) + 60*Number(mm) + 60*60*Number(hh);
    }
    return array;
}

export function decodeSRT(text) {
    let lines = text.trim().split("\n");

    // Find first block
    const firstTimestampIndex = lines.findIndex((l) => l.indexOf(" --> ") >= 0);
    lines = lines.slice(firstTimestampIndex);

    let s = 0;
    let array = [];
    for(let i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("-->") >= 0) {
            s = i;
        } else if (lines[i] === "") {
            array.push(lines.slice(s, i));
        }
    }
    array.push(lines.slice(s)); // last block
    // array[i][0] is: from --> to
    // array[i][1:] is the text
    for(let i = 0; i < array.length; i++) {
        const [start, end] = array[i][0].split(" --> ");
        array[i] = {
            start: decodeTime(start),
            end:   decodeTime(end),
            text:  array[i].slice(1).join("\n"),
        };
    }
    function decodeTime(time) {
        let [hh, mm, ssttt] = time.split(":");
        return Number(ssttt.replace(",", ".")) + 60*Number(mm) + 60*60*Number(hh);
    }
    return array;
}

export function decodeSBV(text) {
    let i = 0;
    return decodeSRT(
        text.replace(/(^|\n\n|\r\n\r\n)/g, function() {
            return "\n\n" + ++i + "\n";
        })
            .replace (/([0-9]{1}):([0-9]{2}):([0-9]{2}).([0-9]{3}),([0-9]{1}):([0-9]{2}):([0-9]{2}).([0-9]{3})/g, "0$1:$2:$3,$4 --> 0$5:$6:$7,$8")
            .replace (/^\n\n/g,"")
    );
}

export function encodeVTT(captions, times) {

    function encodeTime(time) {
        const seconds = time;
        return new Date(seconds * 1000).toISOString()
            .substr(11, 12);
    }

    const blocks = [];
    let k = 0;
    for(let i = 0; i < times.length; i += 2) {
        let [start, end] = [times[i], times[i+1]];
        blocks.push(`${encodeTime(start) + " --> " + encodeTime(end)}\n${captions[k]}`);
        k++;
    }
    return "WEBVTT\n\n" + blocks.join("\n\n");
}

export function encodeSRT(captions, times) {

    function encodeTime(time) {
        const seconds = time;
        return new Date(seconds * 1000).toISOString()
            .substr(11, 12)
            .replace(".", ",");
    }

    const blocks = [];
    let k = 0;
    for(let i = 0; i < times.length; i += 2) {
        let [start, end] = [times[i], times[i+1]];
        blocks.push(`${k+1}\n${encodeTime(start) + " --> " + encodeTime(end)}\n${captions[k]}`);
        k++;
    }
    return blocks.join("\n\n");
}

export function encodeSBV(captions, times) {

    function encodeTime(time) {
        const seconds = time;
        return new Date(seconds * 1000).toISOString()
            .substr(12, 11);
    }

    const blocks = [];
    let k = 0;
    for(let i = 0; i < times.length; i += 2) {
        let [start, end] = [times[i], times[i+1]];
        blocks.push(`${encodeTime(start) + "," + encodeTime(end)}\n${captions[k]}`);
        k++;
    }
    return blocks.join("\n\n");
}

