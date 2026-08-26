//
//  main.swift
//  HelaKatha - macOS InputMethodKit Server
//

import Cocoa
import InputMethodKit

let kConnectionName = "HelaKatha_1_Connection"
var server: IMKServer?

class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        guard let identifier = Bundle.main.bundleIdentifier else { return }
        server = IMKServer(name: kConnectionName, bundleIdentifier: identifier)
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.run()
