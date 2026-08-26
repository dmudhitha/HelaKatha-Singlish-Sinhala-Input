#!/usr/bin/env python3
# linux/ibus_engine.py
# Native IBus Input Method Engine for HelaKatha (Zero Clipboard Dependency)

import os
import sys
import gi
gi.require_version('IBus', '1.0')
from gi.repository import IBus, GLib

# Add core engine directory to Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, os.path.join(PROJECT_ROOT, "core"))
sys.path.insert(0, CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from engine import TransliterationEngine

class HelaKathaEngine(IBus.Engine):
    def __init__(self):
        super().__init__()
        self.engine = TransliterationEngine()
        self.buffer = ""
        self.candidates = []
        self.lookup_table = IBus.LookupTable.new(5, 0, True, True)
        self.lookup_table.set_orientation(IBus.Orientation.VERTICAL)
        
    def do_process_key_event(self, keyval, keycode, state):
        # Ignore key release events
        if state & IBus.ModifierType.RELEASE_MASK:
            return False

        # Mask out system hotkeys (Ctrl/Alt/Super modifier combinations)
        modifiers = state & (IBus.ModifierType.CONTROL_MASK | IBus.ModifierType.ALT_MASK | IBus.ModifierType.SUPER_MASK)
        if modifiers != 0:
            if self.buffer:
                self.buffer = ""
                self.update_ui()
            return False

        val_char = IBus.keyval_to_unicode(keyval)
        char = chr(val_char) if val_char else None

        # Handle Escape
        if keyval == IBus.KEY_Escape:
            if self.buffer:
                self.buffer = ""
                self.update_ui()
                return True
            return False
        
        # Commit on Space or Enter
        if keyval in (IBus.KEY_space, IBus.KEY_Return, IBus.KEY_KP_Enter):
            if self.buffer:
                candidates = self.engine.get_candidates(self.buffer)
                if candidates:
                    selected_text = candidates[0] + (" " if keyval == IBus.KEY_space else "")
                    self.commit_text(IBus.Text.new_from_string(selected_text))
                self.buffer = ""
                self.update_ui()
                return True
            return False
            
        # Backspace deletes last character in preedit buffer
        if keyval == IBus.KEY_BackSpace:
            if self.buffer:
                self.buffer = self.buffer[:-1]
                self.update_ui()
                return True
            return False
            
        # Alphanumeric layout keys and punctuation
        if char and (char.isalnum() or char in (')', '/', '\\', '-', ':')):
            # Direct numeric candidate selection (1-5) when buffer is active
            if self.buffer and char in ('1', '2', '3', '4', '5'):
                index = int(char) - 1
                candidates = self.engine.get_candidates(self.buffer)
                if index < len(candidates):
                    self.commit_text(IBus.Text.new_from_string(candidates[index]))
                    self.buffer = ""
                    self.update_ui()
                    return True

            self.buffer += char
            self.update_ui()
            return True
            
        return False
        
    def update_ui(self):
        if self.buffer:
            self.candidates = self.engine.get_candidates(self.buffer)
            
            # Update Preedit Text (underlined in active text editor)
            preedit_str = self.candidates[0] if self.candidates else self.buffer
            text = IBus.Text.new_from_string(preedit_str)
            text.append_attribute(IBus.Attribute.new(IBus.AttrType.UNDERLINE, IBus.AttrUnderline.SINGLE, 0, len(preedit_str)))
            self.update_preedit_text(text, len(preedit_str), True)
            
            # Update Candidate Lookup Table
            self.lookup_table.clear()
            for candidate in self.candidates:
                self.lookup_table.append_candidate(IBus.Text.new_from_string(candidate))
                
            self.update_lookup_table(self.lookup_table, True)
        else:
            self.clear_preedit_text()
            self.hide_lookup_table()
            
class HelaKathaComponent:
    def __init__(self):
        self.mainloop = GLib.MainLoop()
        self.bus = IBus.Bus()
        self.factory = IBus.Factory.new(self.bus.get_connection())
        self.factory.add_engine("helakatha-singlish", HelaKathaEngine)
        self.bus.request_name("org.freedesktop.IBus.HelaKatha", 0)
        
    def run(self):
        self.mainloop.run()
        
if __name__ == "__main__":
    IBus.init()
    component = HelaKathaComponent()
    component.run()
