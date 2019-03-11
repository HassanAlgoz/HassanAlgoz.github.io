export default {

    // getLanguage tells what language the string 'str' is, based on the first
    // character that doesn't satisfy isBoth.
    getLanguage(str) {
        for(let i = 0; i < str.length; i++) {
            if (this.char.isBoth(str[i])) continue;

            if (this.char.isArabic(str[i])) {
                return "ar";
            } else if (this.char.isEnglish(str[i])) {
                return "en";
            }
        }
        return null;
    },


    // normalizeArabic removes tashkeel, tatweel, and removes punctuation from 'str'.
    normalizeArabic(str="") {
        return (
            str
            // Trim Whitespace
                .trim()
            // Remove tashkeel
                .replace(/ّ|َ|ً|ُ|ٌ|ِ|ٍ|ْ/g, "")
            // Remove tatweel
                .replace(/ـ/g, "")
        );
    },

    // normalizeEnglish does lowercase, and remove punctuation 'str'.
    normalizeEnglish(str="") {
        return (
            str
            // Trim Whitespace
                .trim()
            // Lowercase
                .toLowerCase()
            // Remove Punctuation
                .replace(/[^A-Za-z0-9_]/g, "")
        );
    },

    char: {
    // isEnglish returns true when 'char' is in the range of English unicode
    // characters as referenced here: https://unicode-table.com/en/#0021
    // excluding punctuations since they appear in other languages as well.
        isEnglish(char) {
            return (
                "\u0021" <= char && char <= "\u007E" ||
        char == "\u003F" /*?*/ ||
        "\u0041" <= char && char <= "\u005A" ||
        "\u0061" <= char && char <= "\u007A"
            );
        },

        // isArabic returns true when 'char' is in the range of Arabic unicode
        // characters as referenced here: https://unicode-table.com/en/#060C
        // including Arabic-only punctuations
        isArabic(char) {
            return "\u060C" <= char && char <= "\u066C";
        },

        // isBoth returns true when 'char' is backspace or a punctuation
        // that appears in English or Arabic.
        isBoth(char) {
            return (
                "\u020C" <= char && char <= "\u003E" ||
        char == "\u0040" /*@*/ ||
        "\u005B" <= char && char <= "\u0060" ||
        "\u007B" <= char && char <= "\u007E"
            );
        },

    },
};