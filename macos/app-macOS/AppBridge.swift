//
//  AppBridge.swift
//  app-macOS
//
//  Created by Justin Walsh on 2/2/24.
//

import Foundation
import LaunchAtLogin
import UserNotifications

@objc(AppBridge)
class AppBridge: NSObject {
  @objc func launchAtLogin(_ isEnabled: Bool) {
    LaunchAtLogin.isEnabled = isEnabled
  }

  @objc func isLaunchAtLoginEnabled(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
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
    //sendEvent(withName: "keyDown", body: [
    //  "key": key ?? "",
    //  "keyCode": keyCode,
    //])
  }

  func sendKeyUpEvent(key: String?, keyCode: UInt16) {
    //sendEvent(withName: "keyUp", body: [
    //  "key":  key ?? "",
    //  "keyCode": keyCode,
    //])
  }

  // Window state

  func sendPopoverStateEvent(isVisible: Bool) {
    //sendEvent(withName: "popover", body: [
    //  "isVisible": isVisible,
    //])
  }
  
  @objc func consumeKeys(_ willConsume: Bool) {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.consumeKeys = willConsume
    }
  }

  // ~/Library/Preferences/com.apple.ncprefs.plist
  // defaults write com.apple.ncprefs.plist ... (auth)
  @objc func sendNotification(_ title: NSString, payload: NSString, url: NSString) {
    let notify = UNUserNotificationCenter.current()
    notify.getNotificationSettings { (settings) in
      if settings.authorizationStatus == .authorized {
        let content = UNMutableNotificationContent()
        content.title = title as String
        content.body = payload as String
        content.sound = UNNotificationSound.default
        
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        notify.add(request);
      }
    }
  }
}
