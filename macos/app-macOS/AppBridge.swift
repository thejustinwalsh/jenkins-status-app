//
//  AppBridge.swift
//  app-macOS
//
//  Created by Justin Walsh on 2/2/24.
//

import Foundation
import LaunchAtLogin

@objc(AppBridge)
class AppBridge: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func launchAtLogin(_ isEnabled: Bool) {
    LaunchAtLogin.isEnabled = isEnabled
  }

  @objc func isLaunchAtLoginEnabled(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    resolve(LaunchAtLogin.isEnabled)
  }
  
  @objc func closeApp() {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.closeApp()
    }
  }
}
