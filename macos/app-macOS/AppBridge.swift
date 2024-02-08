//
//  AppBridge.swift
//  app-macOS
//
//  Created by Justin Walsh on 2/2/24.
//

import Foundation
import LaunchAtLogin

@objc(AppBridge)
class AppBridge: RCTEventEmitter {  
  @objc static override func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc override func supportedEvents() -> [String] { ["keyDown", "keyUp"] }
  
  @objc func launchAtLogin(_ isEnabled: Bool) {
    LaunchAtLogin.isEnabled = isEnabled
  }

  @objc func isLaunchAtLoginEnabled(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    resolve(LaunchAtLogin.isEnabled)
  }
  
  @objc func setBackgroundColor(_ hex: String) {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.setBackgroundColor(hex)
    }
  }

  @objc func resize(_ width: Int, height: Int) {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.resize(width, height: height)
    }
  }
  
  @objc func closeApp() {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.closeApp()
    }
  }

  // Key handlers

  func sendKeyDownEvent(key: String?, keyCode: UInt16) {
    sendEvent(withName: "keyDown", body: [
      "key": key ?? "",
      "keyCode": keyCode,
    ])
  }

  func sendKeyUpEvent(key: String?, keyCode: UInt16) {
    sendEvent(withName: "keyUp", body: [
      "key":  key ?? "",
      "keyCode": keyCode,
    ])
  }
  
  @objc func consumeKeys(_ willConsume: Bool) {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.consumeKeys = willConsume
    }
  }
}
