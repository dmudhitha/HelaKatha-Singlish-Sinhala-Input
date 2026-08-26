//
//  SinglishEngine.swift
//  HelaKatha - Swift Transliteration Core for Apple (macOS & iOS)
//

import Foundation

public class SinglishEngine {
    public static let shared = SinglishEngine()
    
    // Core Vowel Rules (Singlish -> Unicode Base, Modifier)
    private let vowels: [(pattern: String, unicode: String, modifier: String)] = [
        ("aai", "ආයි", "ායි"), ("aau", "ආවු", "ාවු"), ("aae", "ඈ", "ෑ"),
        ("aa", "ආ", "ා"), ("ae", "ඇ", "ැ"), ("a", "අ", ""),
        ("ii", "ඊ", "ී"), ("ie", "ඊ", "ී"), ("ee", "ඊ", "ී"), ("ea", "ඊ", "ී"), ("i", "ඉ", "ි"),
        ("uu", "ඌ", "ූ"), ("oo", "ඌ", "ූ"), ("u", "උ", "ු"),
        ("ei", "ඒ", "ේ"), ("ea", "ඒ", "ේ"), ("e", "එ", "ෙ"),
        ("oe", "ඕ", "ෝ"), ("ou", "ඖ", "ෞ"), ("au", "ඖ", "ෞ"), ("o", "ඔ", "ො")
    ]
    
    // Core Consonant Mappings
    private let consonants: [String: String] = [
        "th": "ත", "dh": "ද", "sh": "ශ", "ch": "ච", "jh": "ඣ",
        "ph": "ඵ", "bh": "භ", "kh": "ඛ", "gh": "ඝ", "kn": "ඤ",
        "gn": "ඥ", "ny": "ඤ", "nd": "ඳ", "mb": "ඹ", "ng": "ඟ",
        "k": "ක", "g": "ග", "c": "ච", "j": "ජ", "t": "ට",
        "d": "ඩ", "n": "න", "p": "ප", "b": "බ", "m": "ම",
        "y": "ය", "r": "ර", "l": "ල", "w": "ව", "v": "ව",
        "s": "ස", "h": "හ", "f": "ෆ",
        "K": "ඛ", "G": "ඝ", "T": "ඨ", "D": "ඪ", "N": "ණ",
        "P": "ඵ", "B": "භ", "M": "ම", "Y": "ය", "R": "ඍ",
        "L": "ළ", "W": "ව", "S": "ෂ", "H": "ඃ"
    ]
    
    // Phonetic Spelling Corrections
    private let spellingCorrections: [String: String] = [
        "කරුනා": "කරුණා", "කරුනාව": "කරුණාව", "ප්‍රස්නය": "ප්‍රශ්නය",
        "පිලිතුර": "පිළිතුර", "පිලිතුරු": "පිළිතුරු", "ස්තූති": "ස්තුතියි",
        "බොහෝම": "බොහොම", "විසේස": "විශේෂ", "ප්‍රර්තනා": "ප්‍රාර්ථනා",
        "ප්‍රර්ථනා": "ප්‍රාර්ථනා", "උදව්": "උදවු", "භාශාව": "භාෂාව"
    ]
    
    // Emoji Prefix Search
    private let emojiDictionary: [String: [String]] = [
        "smi": ["😊", "😄", "😀", "🙂"],
        "hea": ["❤️", "💖", "💙", "💔"],
        "lk": ["🇱🇰", "ලංකාව"],
        "ok": ["👍", "👌", "✅"],
        "no": ["❌", "👎", "🚫"],
        "con": ["🎉", "🎊", "🎈"],
        "fir": ["🔥", "💥", "⚡"]
    ]
    
    public init() {}
    
    /// Transliterates a phonetic Singlish word into Sinhala Unicode
    public func transliterate(_ input: String) -> String {
        guard !input.isEmpty else { return "" }
        
        var result = ""
        var idx = input.startIndex
        
        while idx < input.endIndex {
            var matchedConsonant: String? = nil
            var matchedConsonantLength = 0
            
            // Check 2-character consonants first, then 1-character
            for len in (1...2).reversed() {
                if let end = input.index(idx, offsetBy: len, limitedBy: input.endIndex) {
                    let sub = String(input[idx..<end])
                    if let sinhala = consonants[sub] {
                        matchedConsonant = sinhala
                        matchedConsonantLength = len
                        break
                    }
                }
            }
            
            if let cons = matchedConsonant {
                idx = input.index(idx, offsetBy: matchedConsonantLength)
                
                // Check following vowel modifier
                var matchedModifier = "්" // Default virama / hal
                var matchedVowelLength = 0
                
                for v in vowels {
                    if let end = input.index(idx, offsetBy: v.pattern.count, limitedBy: input.endIndex) {
                        let sub = String(input[idx..<end]).lowercased()
                        if sub == v.pattern {
                            matchedModifier = v.modifier
                            matchedVowelLength = v.pattern.count
                            break
                        }
                    }
                }
                
                if matchedVowelLength > 0 {
                    idx = input.index(idx, offsetBy: matchedVowelLength)
                }
                
                result += cons + matchedModifier
            } else {
                // Check standalone initial vowel
                var matchedVowel: String? = nil
                var matchedVowelLength = 0
                
                for v in vowels {
                    if let end = input.index(idx, offsetBy: v.pattern.count, limitedBy: input.endIndex) {
                        let sub = String(input[idx..<end]).lowercased()
                        if sub == v.pattern {
                            matchedVowel = v.unicode
                            matchedVowelLength = v.pattern.count
                            break
                        }
                    }
                }
                
                if let vow = matchedVowel {
                    result += vow
                    idx = input.index(idx, offsetBy: matchedVowelLength)
                } else {
                    // Pass-through unrecognized character
                    result.append(input[idx])
                    idx = input.index(after: idx)
                }
            }
        }
        
        return result
    }
    
    /// Returns candidate suggestions (up to 5) for a given typed Singlish token
    public func getCandidates(_ input: String) -> [String] {
        guard !input.isEmpty else { return [] }
        
        let clean = input.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Emoji Prefix Search (e.g. :smi, :hea, :lk)
        if clean.hasPrefix(":") {
            let term = String(clean.dropFirst())
            if term.isEmpty {
                return ["😊", "❤️", "👍", "🔥", "🎉"]
            }
            var emojis: [String] = []
            for (k, v) in emojiDictionary where k.hasPrefix(term) {
                emojis.append(contentsOf: v)
            }
            return emojis.isEmpty ? [input] : Array(emojis.prefix(5))
        }
        
        var candidates: [String] = []
        let direct = transliterate(input)
        
        // Check spelling auto-corrections
        if let corrected = spellingCorrections[direct] {
            candidates.append(corrected)
        }
        
        if !candidates.contains(direct) {
            candidates.append(direct)
        }
        
        return Array(candidates.prefix(5))
    }
}
