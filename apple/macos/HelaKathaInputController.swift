//
//  HelaKathaInputController.swift
//  HelaKatha - macOS Native InputMethodKit Controller (Zero Clipboard)
//

import Cocoa
import InputMethodKit

@objc(HelaKathaInputController)
public class HelaKathaInputController: IMKInputController {
    private var buffer: String = ""
    private let engine = SinglishEngine.shared
    
    public override func handle(_ event: NSEvent!, client sender: Any!) -> Bool {
        guard let event = event, let client = sender as? IMKTextInput else { return false }
        
        // Ignore modifier combinations (Command, Control, Option)
        let flags = event.modifierFlags.intersection(.deviceIndependentFlagsMask)
        if flags.contains(.command) || flags.contains(.control) || flags.contains(.option) {
            if !buffer.isEmpty {
                buffer = ""
                client.setMarkedText("", selectionRange: NSRange(location: 0, length: 0), replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
            }
            return false
        }
        
        guard let chars = event.characters, !chars.isEmpty else { return false }
        let keyCode = event.keyCode
        
        // Escape cancels pre-edit buffer
        if keyCode == 53 { // ESC
            if !buffer.isEmpty {
                buffer = ""
                client.setMarkedText("", selectionRange: NSRange(location: 0, length: 0), replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
                return true
            }
            return false
        }
        
        // Backspace
        if keyCode == 51 { // Backspace
            if !buffer.isEmpty {
                buffer.removeLast()
                updatePreedit(client: client)
                return true
            }
            return false
        }
        
        // Commit on Space (49) or Return (36)
        if keyCode == 49 || keyCode == 36 {
            if !buffer.isEmpty {
                let candidates = engine.getCandidates(buffer)
                let selected = candidates.first ?? buffer
                let commitStr = selected + (keyCode == 49 ? " " : "\n")
                
                // Native macOS direct text insertion (Zero Clipboard!)
                client.insertText(commitStr, replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
                buffer = ""
                client.setMarkedText("", selectionRange: NSRange(location: 0, length: 0), replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
                return true
            }
            return false
        }
        
        // Process standard typing characters & punctuation
        for char in chars {
            // Punctuation triggers (. , ? ! ;)
            if [".", ",", "?", "!", ";"].contains(char) && !buffer.isEmpty {
                let candidates = engine.getCandidates(buffer)
                let selected = candidates.first ?? buffer
                client.insertText(selected + String(char), replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
                buffer = ""
                client.setMarkedText("", selectionRange: NSRange(location: 0, length: 0), replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
                return true
            }

            if char.isLetter || char.isNumber || [")", "/", "\\", "-", ":"].contains(char) {
                // Direct numeric candidate selection (1-5)
                if !buffer.isEmpty, let num = Int(String(char)), num >= 1, num <= 5 {
                    let candidates = engine.getCandidates(buffer)
                    let index = num - 1
                    if index < candidates.count {
                        client.insertText(candidates[index] + " ", replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
                        buffer = ""
                        client.setMarkedText("", selectionRange: NSRange(location: 0, length: 0), replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
                        return true
                    }
                }
                
                buffer.append(char)
                updatePreedit(client: client)
                return true
            }
        }
        
        return false
    }
    
    private func updatePreedit(client: IMKTextInput) {
        if buffer.isEmpty {
            client.setMarkedText("", selectionRange: NSRange(location: 0, length: 0), replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
        } else {
            let candidates = engine.getCandidates(buffer)
            let displayString = candidates.first ?? buffer
            
            // Mark pre-edit text underlined at cursor
            let attrStr = NSAttributedString(string: displayString, attributes: [
                .underlineStyle: NSUnderlineStyle.single.rawValue
            ])
            client.setMarkedText(attrStr, selectionRange: NSRange(location: displayString.count, length: 0), replacementRange: NSRange(location: NSNotFound, length: NSNotFound))
        }
    }
}
