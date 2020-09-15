export function save(key, val) {
    if (typeof val === "object") {
        val = JSON.stringify(val);
    }
    localStorage.setItem(key, val);
}

export function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function remove(key) {
    localStorage.removeItem(key);
}

export function clear() {
    localStorage.clear();
}