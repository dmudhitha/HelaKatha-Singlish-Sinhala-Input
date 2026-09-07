/**
 * HelaKatha WebExtension Transliteration Core
 * High-performance Singlish to Sinhala Transliteration Engine in JavaScript
 */

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SINHALA_SPELLING_CORRECTIONS = {
  "කරුනා": "කරුණා",
  "කරුනාව": "කරුණාව",
  "ප්‍රස්නය": "ප්‍රශ්නය",
  "පිලිතුර": "පිළිතුර",
  "පිලිතුරු": "පිළිතුරු",
  "ස්තූති": "ස්තුතියි",
  "බොහෝම": "බොහොම",
  "විසේස": "විශේෂ",
  "ප්‍රර්තනා": "ප්‍රාර්ථනා",
  "ප්‍රර්ථනා": "ප්‍රාර්ථනා",
  "උදව්": "උදවු"
};

const EMOJI_DICTIONARY = {
  "smi": [
    "😊",
    "😄",
    "😀",
    "🙂"
  ],
  "hea": [
    "❤️",
    "💖",
    "💙",
    "💔"
  ],
  "lk": [
    "🇱🇰",
    " সিংহ",
    "ලංකාව"
  ],
  "ok": [
    "👍",
    "👌",
    "✅"
  ],
  "no": [
    "❌",
    "👎",
    "🚫"
  ],
  "con": [
    "🎉",
    "🎊",
    "🎈"
  ],
  "wav": [
    "👋",
    "✋",
    "🤚"
  ],
  "laa": [
    "😂",
    "🤣",
    "😆"
  ],
  "sad": [
    "😢",
    "😭",
    "😞",
    "😔"
  ],
  "fir": [
    "🔥",
    "💥",
    "⚡"
  ],
  "cop": [
    "💻",
    "🖥️",
    "⌨️"
  ],
  "pho": [
    "📱",
    "📞",
    "☎️"
  ]
};

const DEFAULT_DICTIONARY = {
  "amma": [
    "අම්මා",
    "අම්ම",
    "අම්මලා"
  ],
  "oyaa": [
    "ඔයා",
    "ඔයාලා",
    "ඔයාට"
  ],
  "oya": [
    "ඔයා",
    "ඔයාලා",
    "ඔයාට"
  ],
  "lanka": [
    "ලංකා",
    "ලංකාව",
    "ලංකාවේ"
  ],
  "srilanka": [
    "ශ්‍රී ලංකා",
    "ශ්‍රී ලංකාව"
  ],
  "gama": [
    "ගම",
    "ගමක්",
    "ගම්"
  ],
  "maga": [
    "මග",
    "මඟ",
    "මඟක්"
  ],
  "sthuthi": [
    "ස්තූතියි",
    "ස්තූති"
  ],
  "isthuthi": [
    "ස්තූතියි",
    "ස්තූති"
  ],
  "subha": [
    "සුබ",
    "සුභ",
    "සුබපැතුම්"
  ],
  "suwada": [
    "සුවඳ",
    "සුවඳක්"
  ],
  "karuna": [
    "කරුණාකර",
    "කරුණාව"
  ],
  "oba": [
    "ඔබ",
    "ඔබට",
    "ඔබගේ",
    "ඔබ සැමට"
  ],
  "mage": [
    "මගේ",
    "මගෙන්"
  ],
  "weda": [
    "වැඩ",
    "වැඩක්",
    "වැඩ කරනවා"
  ],
  "honda": [
    "හොඳ",
    "හොඳයි",
    "හොඳින්"
  ],
  "hoda": [
    "හොඳ",
    "හොඳයි",
    "හොඳින්"
  ],
  "hodin": [
    "හොඳින්",
    "හොඳ"
  ],
  "hondin": [
    "හොඳින්",
    "හොඳ"
  ],
  "kohomada": [
    "කොහොමද"
  ],
  "sathutu": [
    "සතුටු",
    "සතුටුයි"
  ],
  "subhapathum": [
    "සුබ පැතුම්",
    "සුභ පැතුම්"
  ],
  "sinhala": [
    "සිංහල",
    "සිංහලෙන්"
  ],
  "singlish": [
    "සිංග්ලිෂ්",
    "සිංග්ලිශ්"
  ],
  "dawas": [
    "දවස",
    "දවස්",
    "දින"
  ],
  "yana": [
    "යන",
    "යන්න",
    "යනවා"
  ],
  "karanna": [
    "කරන්න",
    "කරනවා",
    "කරමු"
  ],
  "wenna": [
    "වෙන්න",
    "වෙනවා",
    "වුණා"
  ],
  "epaa": [
    "එපා"
  ],
  "epa": [
    "එපා"
  ],
  "hari": [
    "හරි",
    "හරියට",
    "හරිම"
  ],
  "eka": [
    "එක",
    "එකක්",
    "එකඟයි"
  ],
  "mokada": [
    "මොකද",
    "මොකක්ද"
  ],
  "monada": [
    "මොනවාද",
    "මොනවා",
    "මොකද"
  ],
  "naha": [
    "නැහැ",
    "නෑ"
  ],
  "na": [
    "නෑ",
    "නැහැ"
  ],
  "api": [
    "අපි",
    "අපිට",
    "අපේ"
  ],
  "heki": [
    "හැකි",
    "හැකියාව"
  ],
  "hema": [
    "හැම",
    "හැමෝම",
    "හැමදාම"
  ],
  "kala": [
    "කාලය",
    "කළා",
    "කරලා"
  ],
  "puluwan": [
    "පුළුවන්",
    "පුළුවනි"
  ]
};

const FM_ABHAYA_RULES = [[",", "￦"], ["\\.", "�"], ["\\(", "￫"], ["\\)", "￩"], ["%", "ￕ"], ["–", "ￔ"], ["\\?", "ￓ"], ["!", "ￒ"], ["\\=", "ￏ"], ["\\'", "ￎ"], ["\\+", "ￍ"], ["\\:", "ￌ"], ["\\÷", "ￋ"], ["\\;", "ﾶ"], ["ත්‍රෛ", "ff;%"], ["ශෛ", "ffY"], ["චෛ", "ffp"], ["ජෛ", "ffc"], ["කෛ", "ffl"], ["මෛ", "ffu"], ["පෛ", "ffm"], ["දෛ", "ffo"], ["තෛ", "ff;"], ["නෛ", "ffk"], ["ධෛ", "ffO"], ["වෛ", "ffj"], ["ප්‍රෞ", "fm%!"], ["ෂ්‍යෝ", "fIHda"], ["ඡ්‍යෝ", "fPHda"], ["ඪ්‍යෝ", "fVHda"], ["ඝ්‍යෝ", "f>Hda"], ["ඛ්‍යෝ", "fLHda"], ["ළ්‍යෝ", "f<Hda"], ["ඵ්‍යෝ", "fMHda"], ["ඨ්‍යෝ", "fGHda"], ["ශ්‍යෝ", "fYHda"], ["ක්‍ෂ්‍යෝ", "fÌHda"], ["බ්‍යෝ", "fnHda"], ["ච්‍යෝ", "fpHda"], ["ඩ්‍යෝ", "fâHda"], ["ෆ්‍යෝ", "f*Hda"], ["ග්‍යෝ", "f.Hda"], ["ජ්‍යෝ", "fcHda"], ["ක්‍යෝ", "flHda"], ["ල්‍යෝ", "f,Hda"], ["ම්‍යෝ", "fuHda"], ["න්‍යෝ", "fkHda"], ["ප්‍යෝ", "fmHda"], ["ද්‍යෝ", "foHda"], ["ස්‍යෝ", "fiHda"], ["ට්‍යෝ", "fgHda"], ["ව්‍යෝ", "fjHda"], ["ත්‍යෝ", "f;Hda"], ["භ්‍යෝ", "fNHda"], ["ධ්‍යෝ", "fOHda"], ["ථ්‍යෝ", "f:Hda"], ["ෂ්‍යො", "fIHd"], ["ශ්‍යො", "fYHd"], ["ඛ්‍යො", "fLHd"], ["ක්‍ෂ්‍යො", "fÌHd"], ["බ්‍යො", "fnHd"], ["ව්‍යො", "fjHd"], ["ඩ්‍යො", "fvHd"], ["ෆ්‍යො", "f*Hd"], ["ග්‍යො", "f.Hd"], ["ජ්‍යො", "fcHd"], ["ක්‍යො", "flHd"], ["ම්‍යො", "fuHd"], ["ප්‍යො", "fmHd"], ["ද්‍යො", "foHd"], ["ස්‍යො", "fiHd"], ["ට්‍යො", "fgHd"], ["ව්‍යො", "fjHd"], ["ත්‍යො", "f;Hd"], ["ඛ්‍යෙ", "fLH"], ["ක්‍ෂ්යෙ", "fÌH"], ["බ්‍යෙ", "fnH"], ["ඩ්‍යෙ", "fvH"], ["ෆ්‍යෙ", "f*H"], ["ග්‍යෙ", "f.H"], ["ජ්‍යෙ", "fcH"], ["ක්‍යෙ", "flH"], ["ම්‍යෙ", "fuH"], ["ප්‍යෙ", "fmH"], ["ද්‍යෙ", "foH"], ["ස්‍යෙ", "fiH"], ["ට්‍යෙ", "fgH"], ["ව්‍යෙ", "fjH"], ["ත්‍යෙ", "f;H"], ["භ්‍යෙ", "fNH"], ["ධ්‍යෙ", "fOH"], ["ථ්‍යෙ", "f:H"], ["ෂ්‍රෝ", "fI%da"], ["ඝ්‍රෝ", "f>%da"], ["ශ්‍රෝ", "fY%da"], ["ක්‍ෂ්‍රෝ", "fÌ%da"], ["බ්‍රෝ", "fn%da"], ["ඩ්‍රෝ", "fv%da"], ["ෆ්‍රෝ", "f*%da"], ["ග්‍රෝ", "f.%da"], ["ක්‍රෝ", "fl%da"], ["ප්‍රෝ", "fm%da"], ["ද්‍රෝ", "føda"], ["ස්‍රෝ", "fi%da"], ["ට්‍රෝ", "fg%da"], ["ත්‍රෝ", "f;%da"], ["ශ්‍රො", "fY%d"], ["ඩ්‍රො", "fv%d"], ["ෆ්‍රො", "f*%d"], ["ග්‍රො", "f.%d"], ["ක්‍රො", "fl%d"], ["ප්‍රො", "fm%d"], ["ද්‍රො", "fød"], ["ස්‍රො", "fi%d"], ["ට්‍රො", "fg%d"], ["ත්‍රො", "f;%d"], ["ශ්‍රේ", "fYa%"], ["බ්‍රේ", "fí%"], ["ඩ්‍රේ", "fâ%"], ["ෆ්‍රේ", "f*a%"], ["ග්‍රේ", "f.a%"], ["ක්‍රේ", "fla%"], ["ප්‍රේ", "fma%"], ["ද්‍රේ", "føa"], ["ස්‍රේ", "fia%"], ["ත්‍රේ", "f;a%"], ["ධ්‍රේ", "fè%"], ["ෂ්‍රෙ", "fI%"], ["ශ්‍රෙ", "fY%"], ["බ්‍රෙ", "fn%"], ["ෆ්‍රෙ", "f*%"], ["ග්‍රෙ", "f.%"], ["ක්‍රෙ", "fl%"], ["ප්‍රෙ", "fm%"], ["ද්‍රෙ", "fø"], ["ස්‍රෙ", "fi%"], ["ත්‍රෙ", "f;%"], ["භ්‍රෙ", "fN%"], ["ධ්‍රෙ", "fO%"], ["්‍ය", "H"], ["්‍ර", "%"], ["ෂෞ", "fI!"], ["ඡෞ", "fP!"], ["ශෞ", "fY!"], ["බෞ", "fn!"], ["චෞ", "fp!"], ["ඩෞ", "fv!"], ["ෆෞ", "f*!"], ["ගෞ", "f.!"], ["ජෞ", "fc!"], ["කෞ", "fl!"], ["ලෞ", "f,!"], ["මෞ", "fu!"], ["නෞ", "fk!"], ["පෞ", "fm!"], ["දෞ", "fo!"], ["රෞ", "fr!"], ["සෞ", "fi!"], ["ටෞ", "fg!"], ["තෞ", "f;!"], ["භෞ", "fN!"], ["ඤෞ", "f[!"], ["ෂෝ", "fIda"], ["ඹෝ", "fUda"], ["ඡෝ", "fPda"], ["ඪෝ", "fVda"], ["ඝෝ", "f>da"], ["ඛෝ", "fLda"], ["ළෝ", "f<da"], ["ඟෝ", "fÛda"], ["ණෝ", "fKda"], ["ඵෝ", "fMda"], ["ඨෝ", "fGda"], ["ඬෝ", "fËda"], ["ශෝ", "fYda"], ["ඥෝ", "f{da"], ["ඳෝ", "f|da"], ["ක්‍ෂෝ", "fÌda"], ["බෝ", "fnda"], ["චෝ", "fpda"], ["ඩෝ", "fvda"], ["ෆෝ", "f*da"], ["ගෝ", "f.da"], ["හෝ", "fyda"], ["ජෝ", "fcda"], ["කෝ", "flda"], ["ලෝ", "f,da"], ["මෝ", "fuda"], ["නෝ", "fkda"], ["පෝ", "fmda"], ["දෝ", "foda"], ["රෝ", "frda"], ["සෝ", "fida"], ["ටෝ", "fgda"], ["වෝ", "fjda"], ["තෝ", "f;da"], ["භෝ", "fNda"], ["යෝ", "fhda"], ["ඤෝ", "f[da"], ["ධෝ", "fOda"], ["ථෝ", "f:da"], ["ෂො", "fId"], ["ඹො", "fUd"], ["ඡො", "fPd"], ["ඪො", "fVd"], ["ඝො", "f>d"], ["ඛො", "fLd"], ["ළො", "f<d"], ["ඟො", "fÕd"], ["ණො", "fKd"], ["ඵො", "fMd"], ["ඨො", "fGd"], ["ඬො", "fËd"], ["ශො", "fYd"], ["ඥො", "f{d"], ["ඳො", "f|d"], ["ක්‍ෂො", "fÌd"], ["බො", "fnd"], ["චො", "fpd"], ["ඩො", "fvd"], ["ෆො", "f*d"], ["ගො", "f.d"], ["හො", "fyd"], ["ජො", "fcd"], ["කො", "fld"], ["ලො", "f,d"], ["මො", "fud"], ["නො", "fkd"], ["පො", "fmd"], ["දො", "fod"], ["රො", "frd"], ["සො", "fid"], ["ටො", "fgd"], ["වො", "fjd"], ["තො", "f;d"], ["භො", "fNd"], ["යො", "fhd"], ["ඤො", "f[d"], ["ධො", "fOd"], ["ථො", "f:d"], ["ෂේ", "fIa"], ["ඹේ", "fò"], ["ඡේ", "fþ"], ["ඪේ", "f\\\\a"], ["ඝේ", "f>a"], ["ඛේ", "fÄ"], ["ළේ", "f<a"], ["ඟේ", "fÛa"], ["ණේ", "fKa"], ["ඵේ", "fMa"], ["ඨේ", "fGa"], ["ඬේ", "få"], ["ශේ", "fYa"], ["ඥේ", "f{a"], ["ඳේ", "f|a"], ["ක්‍ෂේ", "fÌa"], ["බේ", "fí"], ["චේ", "fÉ"], ["ඩේ", "fâ"], ["ෆේ", "f*"], ["ගේ", "f.a"], ["හේ", "fya"], ["පේ", "fma"], ["කේ", "fla"], ["ලේ", "f,a"], ["මේ", "fï"], ["නේ", "fka"], ["ජේ", "f–"], ["දේ", "foa"], ["රේ", "f¾"], ["සේ", "fia"], ["ටේ", "fÜ"], ["වේ", "fõ"], ["තේ", "f;a"], ["භේ", "fNa"], ["යේ", "fha"], ["ඤේ", "f[a"], ["ධේ", "fè"], ["ථේ", "f:a"], ["ෂෙ", "fI"], ["ඹෙ", "fU"], ["ඓ", "ft"], ["ඡෙ", "fP"], ["ඪෙ", "fV"], ["ඝෙ", "f>"], ["ඛෙ", "fn"], ["ළෙ", "f<"], ["ඟෙ", "fÛ"], ["ණෙ", "fK"], ["ඵෙ", "fM"], ["ඨෙ", "fG"], ["ඬෙ", "fË"], ["ශෙ", "fY"], ["ඥෙ", "f{"], ["ඳෙ", "fË"], ["ක්‍ෂෙ", "fÌ"], ["බෙ", "fn"], ["චෙ", "fp"], ["ඩෙ", "fv"], ["ෆෙ", "f*"], ["ගෙ", "f."], ["හෙ", "fy"], ["ජෙ", "fc"], ["කෙ", "fl"], ["ලෙ", "f,"], ["මෙ", "fu"], ["නෙ", "fk"], ["පෙ", "fm"], ["දෙ", "fo"], ["රෙ", "fr"], ["සෙ", "fi"], ["ටෙ", "fg"], ["වෙ", "fj"], ["තෙ", "f;"], ["භෙ", "fN"], ["යෙ", "fh"], ["ඤෙ", "f["], ["ධෙ", "fO"], ["ථෙ", "f:"], ["තු", ";="], ["ගු", ".="], ["කු", "l="], ["තූ", ";+"], ["ගූ", ".+"], ["කූ", "l+"], ["රු", "re"], ["රූ", "rE"], ["ආ", "wd"], ["ඇ", "we"], ["ඈ", "wE"], ["ඌ", "W!"], ["ඖ", "T!"], ["ඒ", "ta"], ["ඕ", "´"], ["ඳි", "¢"], ["ඳී", "£"], ["දූ", "¥"], ["දී", "§"], ["ලූ", "¨"], ["ර්‍ය", "©"], ["ඳූ", "ª"], ["ර්", "¾"], ["ඨි", "À"], ["ඨී", "Á"], ["ඡී", "Â"], ["ඛ්", "Ä"], ["ඛි", "Å"], ["ලු", "Æ"], ["ඛී", "Ç"], ["දි", "È"], ["ච්", "É"], ["ජ්", "Ê"], ["රී", "Í"], ["ඪී", "Î"], ["ඪී", "Ð,"], ["චි", "Ñ"], ["ථී", "Ò"], ["ථී", "Ó"], ["ජී", "Ô"], ["චී", "Ö"], ["ඞ්", "Ù"], ["ඵී", "Ú"], ["ට්", "Ü"], ["ඵි", "Ý"], ["රි", "ß"], ["ටී", "à"], ["ටි", "á"], ["ඩ්", "â"], ["ඩී", "ã"], ["ඩි", "ä"], ["ඬ්", "å"], ["ඬි", "ç"], ["ධ්", "è"], ["ඬී", "é"], ["ධි", "ê"], ["ධී", "ë"], ["බි", "ì"], ["බ්", "í"], ["බී", "î"], ["ම්", "ï"], ["ජි", "ð"], ["මි", "ñ"], ["ඹ්", "ò"], ["මී", "ó"], ["ඹි", "ô"], ["ව්", "õ"], ["ඹී", "ö"], ["ඳු", "÷"], ["ද්‍ර", "ø"], ["වී", "ù"], ["වි", "ú"], ["ඞ්", "û"], ["ඞී", "ü"], ["ඡි", "ý"], ["ඡ්", "þ"], ["දු", "ÿ"], ["ජ්", "–"], ["ර්‍ණ", "“"], ["ණී", "”"], ["ජී", "„"], ["ඡි", "‰"], ["ඩි", ""], ["ඤු", "™"], ["ග", "."], ["ළු", "¿"], ["ෂ", "I"], ["ං", "x"], ["ඃ", "#"], ["ඹ", "U"], ["ඡ", "P"], ["ඪ", "V"], ["ඝ", ">"], ["ඊ", "B"], ["ඣ", "CO"], ["ඛ", "L"], ["ළ", "<"], ["ඟ", "Û"], ["ණ", "K"], ["ඵ", "M"], ["ඨ", "G"], ["ඃ", "#"], ["\\\"", ","], ["\\)", "&"], [":", "("], ["-", ")"], ["ෆ", "*"], ["ල", ","], ["-", "-"], ["රැ", "/"], ["ථ", ":"], ["ත", ";"], ["ළ", "<"], ["ඝ", ">"], ["රෑ", "?"], ["ඊ", "B"], ["ක‍", "C"], ["‍ෘ", "D"], ["ෑ", "E"], ["ත‍", "F"], ["ඨ", "G"], ["්‍ය", "H"], ["ෂ", "I"], ["න‍", "J"], ["ණ", "K"], ["ඛ", "L"], ["ඵ", "M"], ["භ", "N"], ["ධ", "O"], ["ඡ", "P"], ["ඍ", "R"], ["ඔ", "T"], ["ඹ", "U"], ["ඪ", "V"], ["උ", "W"], ["ශ", "Y"], ["ඤ", "["], ["ඉ", "b"], ["ජ", "c"], ["ට", "g"], ["ය", "h"], ["ස", "i"], ["ව", "j"], ["න", "k"], ["ක", "l"], ["ප", "m"], ["බ", "n"], ["ද", "o"], ["ච", "p"], ["ර", "r"], ["එ", "t"], ["ම", "u"], ["ඩ", "v"], ["අ", "w"], ["හ", "y"], ["ඥ", "{"], ["ඳ", "|"], ["ක්‍ෂ", "Ì"], ["ැ", "e"], ["ෑ", "E"], ["ෙ", "f"], ["ු", "q"], ["ි", "s"], ["ූ", "Q"], ["ී", "S"], ["ෘ", "D"], ["ෲ", "DD"], ["ෟ", "!"], ["ා", "d"], ["්", "a"], ["�", "'"], ["￫", "^"], ["￩", "&"], ["ￔ", ")"], ["ￓ", "@"], ["ￒ", "`"], ["ￏ", "}"], ["ￎ", "~"], ["\\ￍ", "¤"], ["\\ￌ", "•"], ["\\ￊ", "›"], ["\\ﾶ", "∙"], ["ￕ", "]"]];

class TransliterationEngine {
    constructor() {
        this.vowels = [
            ['oo', 'ඌ', 'ූ'],
            ['o)', 'ඕ', 'ෝ'],
            ['oe', 'ඕ', 'ෝ'],
            ['aa', 'ආ', 'ා'],
            ['a)', 'ආ', 'ා'],
            ['Aa', 'ඈ', 'ෑ'],
            ['A)', 'ඈ', 'ෑ'],
            ['ae', 'ඈ', 'ෑ'],
            ['ii', 'ඊ', 'ී'],
            ['i)', 'ඊ', 'ී'],
            ['ie', 'ඊ', 'ී'],
            ['ee', 'ඊ', 'ී'],
            ['ea', 'ඒ', 'ේ'],
            ['e)', 'ඒ', 'ේ'],
            ['ei', 'ඒ', 'ේ'],
            ['uu', 'ඌ', 'ූ'],
            ['u)', 'ඌ', 'ූ'],
            ['au', 'ඖ', 'ෞ'],
            ['/a', 'ඇ', 'ැ'],
            ['/\\a', 'ඇ', 'ැ'],
            ['a', 'අ', ''],
            ['A', 'ඇ', 'ැ'],
            ['i', 'ඉ', 'ි'],
            ['e', 'එ', 'ෙ'],
            ['u', 'උ', 'ු'],
            ['o', 'ඔ', 'ො'],
            ['I', 'ඓ', 'ෛ']
        ];

        this.special_consonants = [
            ['x', 'ං'],
            ['\\h', 'ඃ'],
            ['\\N', 'ඞ'],
            ['\\R', 'ඍ'],
            ['R', 'ර්\u200D'],
            ['\\r', 'ර්\u200D']
        ];

        this.consonants = [
            ['zd', 'ඬ'],
            ['zdh', 'ඳ'],
            ['zg', 'ඟ'],
            ['Th', 'ථ'],
            ['Dh', 'ධ'],
            ['gh', 'ඝ'],
            ['Ch', 'ඡ'],
            ['ph', 'ඵ'],
            ['bh', 'භ'],
            ['sh', 'ශ'],
            ['Sh', 'ෂ'],
            ['GN', 'ඥ'],
            ['KN', 'ඤ'],
            ['Lu', 'ළු'],
            ['dh', 'ද'],
            ['ch', 'ච'],
            ['kh', 'ඛ'],
            ['th', 'ත'],
            ['t', 'ට'],
            ['k', 'ක'],
            ['d', 'ඩ'],
            ['n', 'න'],
            ['p', 'ප'],
            ['b', 'බ'],
            ['m', 'ම'],
            ['\\y', '‍ය'],
            ['Y', '‍ය'],
            ['y', 'ය'],
            ['j', 'ජ'],
            ['l', 'ල'],
            ['v', 'ව'],
            ['w', 'ව'],
            ['s', 'ස'],
            ['h', 'හ'],
            ['N', 'ණ'],
            ['L', 'ළ'],
            ['K', 'ඛ'],
            ['G', 'ඝ'],
            ['T', 'ඨ'],
            ['D', 'ඪ'],
            ['P', 'ඵ'],
            ['B', 'ඹ'],
            ['f', 'ෆ'],
            ['q', 'ඣ'],
            ['g', 'ග'],
            ['r', 'ර']
        ];

        this.special_chars = [
            ['ruu', 'ෲ'],
            ['ru', 'ෘ']
        ];

        this.dictionary = Object.assign({}, DEFAULT_DICTIONARY);
        this.user_dictionary = {};
        this.bigram_dictionary = {};
        this.macros = {
            'brb': 'Be right back!',
            'omw': 'On my way!',
            'thx': 'ස්තූතියි!',
            'hwru': 'කොහොමද ඔයාට?',
            'gmg': 'සුබ උදෑසනක්!',
            'gn8': 'සුබ රාත්‍රියක්!'
        };

        this.loadUserData();
    }

    loadUserData() {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['user_dict', 'bigram_dict', 'macros'], (res) => {
                if (res.user_dict) this.user_dictionary = res.user_dict;
                if (res.bigram_dict) this.bigram_dictionary = res.bigram_dict;
                if (res.macros) this.macros = Object.assign(this.macros, res.macros);
            });
        }
    }

    saveUserData() {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({
                user_dict: this.user_dictionary,
                bigram_dict: this.bigram_dictionary,
                macros: this.macros
            });
        }
    }

    learn_word(typed_text, chosen_word) {
        if (!typed_text || !chosen_word) return;
        const clean = typed_text.trim().toLowerCase();
        if (!this.user_dictionary[clean]) {
            this.user_dictionary[clean] = {};
        }
        this.user_dictionary[clean][chosen_word] = (this.user_dictionary[clean][chosen_word] || 0) + 1;
        this.saveUserData();
    }

    learn_bigram(prev_word, curr_word) {
        if (!prev_word || !curr_word) return;
        const p = prev_word.trim();
        const c = curr_word.trim();
        if (!this.bigram_dictionary[p]) {
            this.bigram_dictionary[p] = {};
        }
        this.bigram_dictionary[p][c] = (this.bigram_dictionary[p][c] || 0) + 1;
        this.saveUserData();
    }

    get_predictions(prev_word) {
        if (!prev_word) return [];
        const p = prev_word.trim();
        const matches = this.bigram_dictionary[p] || {};
        const sorted = Object.keys(matches).sort((a, b) => matches[b] - matches[a]);
        return sorted.slice(0, 5);
    }

    transliterate(text) {
        if (!text) return '';

        let result = text;

        // 1. Special characters
        for (const [pattern, repl] of this.special_chars) {
            const regex = new RegExp(escapeRegExp(pattern), 'g');
            result = result.replace(regex, repl);
        }

        // 2. Special consonants
        for (const [pattern, repl] of this.special_consonants) {
            const regex = new RegExp(escapeRegExp(pattern), 'g');
            result = result.replace(regex, repl);
        }

        // 3. Consonants + Vowels combination
        for (const [con, con_uni] of this.consonants) {
            for (const [vow, vow_uni, vow_mod] of this.vowels) {
                const pattern = con + vow;
                const repl = con_uni + vow_mod;
                const regex = new RegExp(escapeRegExp(pattern), 'g');
                result = result.replace(regex, repl);
            }
        }

        // 4. Standalone Consonants -> Add hal/virama (්)
        for (const [con, con_uni] of this.consonants) {
            const regex = new RegExp(escapeRegExp(con), 'g');
            result = result.replace(regex, con_uni + '්');
        }

        // 5. Standalone Vowels
        for (const [vow, vow_uni, vow_mod] of this.vowels) {
            const regex = new RegExp(escapeRegExp(vow), 'g');
            result = result.replace(regex, vow_uni);
        }

        // 6. Spelling Corrections
        for (const [wrong, right] of Object.entries(SINHALA_SPELLING_CORRECTIONS)) {
            if (result.includes(wrong)) {
                result = result.replace(new RegExp(escapeRegExp(wrong), 'g'), right);
            }
        }

        return result;
    }

    get_candidates(text, clipboard_text = '') {
        if (!text) return [];

        const candidates = [];
        const clean_text = text.trim().toLowerCase();

        // Macro expansion
        if (clean_text in this.macros) {
            let expanded = this.macros[clean_text];
            const now = new Date();
            expanded = expanded.replace(/\[date\]/g, now.toISOString().slice(0, 10));
            expanded = expanded.replace(/\[time\]/g, now.toTimeString().slice(0, 5));
            if (clipboard_text) expanded = expanded.replace(/\[clip\]/g, clipboard_text);
            candidates.push(expanded);
        }

        // Emoji lookup
        if (clean_text in EMOJI_DICTIONARY) {
            for (const emo of EMOJI_DICTIONARY[clean_text]) {
                if (!candidates.includes(emo)) candidates.push(emo);
            }
        }

        // Direct transliteration
        const direct_trans = this.transliterate(text);
        if (!candidates.includes(direct_trans)) {
            candidates.push(direct_trans);
        }

        // User learned matches
        const user_matches = this.user_dictionary[clean_text] || {};
        const sorted_user = Object.keys(user_matches).sort((a, b) => user_matches[b] - user_matches[a]);
        for (const m of sorted_user) {
            if (!candidates.includes(m)) candidates.push(m);
        }

        // Default dictionary matches
        const dict_matches = this.dictionary[clean_text] || [];
        for (const m of dict_matches) {
            if (!candidates.includes(m)) candidates.push(m);
        }

        // Prefix matches
        if (candidates.length < 4) {
            for (const [key, val] of Object.entries(this.dictionary)) {
                if (candidates.length >= 4) break;
                if (key.startsWith(clean_text) && key !== clean_text) {
                    for (const m of val) {
                        if (!candidates.includes(m) && candidates.length < 4) {
                            candidates.push(m);
                        }
                    }
                }
            }
        }

        // Raw text at index 4 if list is full
        if (!candidates.includes(text)) {
            if (candidates.length >= 5) {
                candidates[4] = text;
            } else {
                candidates.push(text);
            }
        }

        return candidates.slice(0, 5);
    }
}

function unicode_to_fm_abhaya(text) {
    if (!text) return '';
    let result = text;
    for (let i = 0; i < FM_ABHAYA_RULES.length; i++) {
        const pattern = FM_ABHAYA_RULES[i][0];
        const replacement = FM_ABHAYA_RULES[i][1];
        try {
            const regex = new RegExp(pattern, 'g');
            result = result.replace(regex, replacement);
        } catch (e) {
            result = result.split(pattern).join(replacement);
        }
    }
    return result;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TransliterationEngine, unicode_to_fm_abhaya };
}
