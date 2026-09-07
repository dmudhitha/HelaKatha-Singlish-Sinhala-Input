import re
import json
from core.engine import TransliterationEngine, SINHALA_SPELLING_CORRECTIONS, EMOJI_DICTIONARY

def build_engine():
    with open('core/engine.py', 'r', encoding='utf-8') as f:
        core_content = f.read()

    match = re.search(r'rules = \[(.*?)\]\s+for pat, rep in rules:', core_content, re.DOTALL)
    if not match:
        raise ValueError('Could not match rules block')

    rules_block = match.group(1).strip()
    rule_lines = []
    for line in rules_block.split('\n'):
        line = line.strip()
        if line.startswith('(') and line.endswith('),'):
            rule_tuple = eval(line[:-1])
            rule_lines.append(rule_tuple)
        elif line.startswith('(') and line.endswith(')'):
            rule_tuple = eval(line)
            rule_lines.append(rule_tuple)

    print(f'Parsed {len(rule_lines)} FM Abhaya rules')

    engine = TransliterationEngine()

    js_template = '''/**
 * HelaKatha WebExtension Transliteration Core
 * High-performance Singlish to Sinhala Transliteration Engine in JavaScript
 */

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

const SINHALA_SPELLING_CORRECTIONS = ''' + json.dumps(SINHALA_SPELLING_CORRECTIONS, ensure_ascii=False, indent=2) + ''';

const EMOJI_DICTIONARY = ''' + json.dumps(EMOJI_DICTIONARY, ensure_ascii=False, indent=2) + ''';

const DEFAULT_DICTIONARY = ''' + json.dumps(engine.dictionary, ensure_ascii=False, indent=2) + ''';

const FM_ABHAYA_RULES = ''' + json.dumps(rule_lines, ensure_ascii=False) + ''';

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
            ['/\\\\a', 'ඇ', 'ැ'],
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
            ['\\\\h', 'ඃ'],
            ['\\\\N', 'ඞ'],
            ['\\\\R', 'ඍ'],
            ['R', 'ර්\\u200D'],
            ['\\\\r', 'ර්\\u200D']
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
            ['\\\\y', '‍ය'],
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
'''

    targets = ['extension-chrome/engine.js', 'extension-firefox/engine.js']
    for t in targets:
        with open(t, 'w', encoding='utf-8') as out:
            out.write(js_template)
        print(f'Generated {t} successfully')

if __name__ == '__main__':
    build_engine()
