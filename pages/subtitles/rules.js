// Language Rules
// Note: rules are applied in-order from top to bottom
export default {

    // 'all' is not a language code, but it is the set of rules that is applied to all languages
    'all': [
        {
            flag:  true,
            label: 'Math operators (± ≠ ≥ ≤)',
            func:  (str) => {
                return str.replace(/\+-/gm, '±')
                    .replace(/-\+/gm, '∓')
                    .replace(/\/=/gm, '≠')
                    .replace(/!=/gm, '≠')
                    .replace(/>=/gm, '≥')
                    .replace(/<=/gm, '≤');
            },
        },
        {
            flag:  true,
            label: 'fractions (1/2 = ½)',
            func:  (str) => {
                return str
                    .replace(/1\/4/gm, '¼')
                    .replace(/1\/3/gm, '⅓')
                    .replace(/1\/2/gm, '½')
                    .replace(/2\/3/gm, '⅔')
                    .replace(/3\/4/gm, '¾')

                    .replace(/1\/5/gm, '⅕')
                    .replace(/2\/5/gm, '⅖')
                    .replace(/3\/5/gm, '⅗')
                    .replace(/4\/5/gm, '⅘')

                    .replace(/1\/6/gm, '⅙')
                    .replace(/5\/6/gm, '⅚')

                    .replace(/1\/7/gm, '⅐')

                    .replace(/1\/8/gm, '⅛')
                    .replace(/3\/8/gm, '⅜')
                    .replace(/5\/8/gm, '⅝')
                    .replace(/7\/8/gm, '⅞')

                    .replace(/1\/9/gm, '⅑')

                    .replace(/1\/10/gm, '⅒');
            },
        },
        {
            flag:  false,
            label: '* = ★',
            func:  (str) => {
                return str.replace(/\*/gm, '★');
            },
        },
    ],


    'ar': [
        {
            flag:  true,
            label: 'صلى الله عليه وسلم = ﷺ',
            func:  (str) => {
                return str.replace(new RegExp('صلى الله عليه وسلم', 'gm'), 'ﷺ')
                    .replace(new RegExp('صلى الله عليه و سلم', 'gm'), 'ﷺ');
            },
        },
        {
            flag:  true,
            label: 'جل جلاله = ﷻ',
            func:  (str) => {
                return str.replace(new RegExp('جل جلاله', 'gm'), 'ﷻ');
            },
        },
        {
            flag:  false,
            label: '﷽ = بسم الله الرحمن الرحيم',
            func:  (str) => {
                return str.replace(new RegExp('بسم الله الرحمن الرحيم', 'gm'), '﷽');
            },
        },
        {
            flag:  true,
            label: '« » = " "',
            func:  (str) => {
                return str.replace(/"(.*)"/gm, '«$1»')
                    .replace(/'(.*)'/gm, '‹$1›');

            },
        },
        {
            flag:  true,
            label: '123 = ١٢٣',
            func:  (str) => {
                return str.replace(/0/gm, '٠')
                    .replace(/1/gm, '١')
                    .replace(/2/gm, '٢')
                    .replace(/3/gm, '٣')
                    .replace(/4/gm, '٤')
                    .replace(/5/gm, '٥')
                    .replace(/6/gm, '٦')
                    .replace(/7/gm, '٧')
                    .replace(/8/gm, '٨')
                    .replace(/9/gm, '٩');

            },
        },
    ],
    // 'en': [
    //     {
    //         // flag:  true,
    //         // label: 'do not = don\'t',
    //         // func:  (str) => {
    //         //     return str.replace(new RegExp('do not', 'gm'), 'don\'t')
    //         //         .replace(new RegExp('could not', 'gm'), 'couldn\'t');
    //         // },
    //     },
    // ],
};