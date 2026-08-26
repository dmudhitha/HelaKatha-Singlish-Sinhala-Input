//
//  KeyboardViewController.swift
//  HelaKatha - iOS Custom Keyboard Extension (Zero Clipboard)
//

import UIKit

public class KeyboardViewController: UIInputViewController {
    private var buffer: String = ""
    private let engine = SinglishEngine.shared
    private var candidateButtons: [UIButton] = []
    private var candidateStackView: UIStackView!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor(red: 0.12, green: 0.12, blue: 0.18, alpha: 1.0)
        
        // 1. Candidate Suggestion Bar
        candidateStackView = UIStackView()
        candidateStackView.axis = .horizontal
        candidateStackView.distribution = .fillEqually
        candidateStackView.spacing = 8
        candidateStackView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(candidateStackView)
        
        for i in 0..<5 {
            let btn = UIButton(type: .system)
            btn.setTitle("", for: .normal)
            btn.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .medium)
            btn.setTitleColor(.white, for: .normal)
            btn.backgroundColor = UIColor(white: 1.0, alpha: 0.1)
            btn.layer.cornerRadius = 6
            btn.tag = i
            btn.addTarget(self, action: #selector(candidateTapped(_:)), for: .touchUpInside)
            candidateButtons.append(btn)
            candidateStackView.addArrangedSubview(btn)
        }
        
        NSLayoutConstraint.activate([
            candidateStackView.topAnchor.constraint(equalTo: view.topAnchor, constant: 6),
            candidateStackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 10),
            candidateStackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -10),
            candidateStackView.heightAnchor.constraint(equalToConstant: 40)
        ])
    }
    
    /// Handle key taps from the keyboard UI
    public func handleKeyInput(_ char: String) {
        if char == "⌫" { // Backspace
            if !buffer.isEmpty {
                buffer.removeLast()
                updateCandidates()
            } else {
                textDocumentProxy.deleteBackward()
            }
        } else if char == " " || char == "\n" { // Space or Return
            if !buffer.isEmpty {
                let candidates = engine.getCandidates(buffer)
                let selected = candidates.first ?? buffer
                // Commit to iOS text proxy with zero clipboard
                textDocumentProxy.insertText(selected + (char == " " ? " " : "\n"))
                buffer = ""
                updateCandidates()
            } else {
                textDocumentProxy.insertText(char)
                buffer = ""
                updateCandidates()
            }
        } else if [".", ",", "?", "!", ";"].contains(char) { // Punctuation Triggers
            if !buffer.isEmpty {
                let candidates = engine.getCandidates(buffer)
                let selected = candidates.first ?? buffer
                textDocumentProxy.insertText(selected + char)
                buffer = ""
                updateCandidates()
            } else {
                textDocumentProxy.insertText(char)
            }
        } else {
            buffer.append(char)
            updateCandidates()
        }
    }
    
    @objc private func candidateTapped(_ sender: UIButton) {
        guard let text = sender.title(for: .normal), !text.isEmpty else { return }
        
        // Native iOS text insertion (Zero Clipboard!)
        textDocumentProxy.insertText(text + " ")
        buffer = ""
        updateCandidates()
    }
    
    private func updateCandidates() {
        if buffer.isEmpty {
            for btn in candidateButtons {
                btn.setTitle("", for: .normal)
                btn.isHidden = true
            }
        } else {
            let candidates = engine.getCandidates(buffer)
            for (idx, btn) in candidateButtons.enumerated() {
                if idx < candidates.count {
                    btn.setTitle(candidates[idx], for: .normal)
                    btn.isHidden = false
                } else {
                    btn.setTitle("", for: .normal)
                    btn.isHidden = true
                }
            }
        }
    }
}
