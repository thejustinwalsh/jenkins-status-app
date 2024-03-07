//
//  AppDelegate.swift
//  app-macOS
//
//  Created by Justin Walsh on 2/2/24.
//

import Foundation
import Cocoa
import SwiftUI
import UserNotifications

class WindowDelegate: NSObject, NSWindowDelegate {
  var resignHandler: (() -> Void)?

  init(resignHandler: (() -> Void)?) {
    self.resignHandler = resignHandler
  }

  func windowDidResignKey(_ notification: Notification) {
    resignHandler?()
  }

  func windowDidResignMain(_ notification: Notification) {
    resignHandler?()
  }
}

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var windowDelegate: WindowDelegate!
  var popover: NSWindow!
  var statusBarItem: NSStatusItem!
  var viewController: NSViewController!
  var rootView: RCTRootView!
  var bridge: AppBridge?
  var popoverWidth: Int = 400
  var popoverHeight: Int = 400
  
  public var consumeKeys: Bool = false;

  func applicationDidFinishLaunching(_ aNotification: Notification) {
    let jsCodeLocation: URL
    #if DEBUG
      jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
    #endif
    
    viewController = NSViewController()
    rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "app", initialProperties: nil, launchOptions: nil)
    viewController.view = rootView
    rootView.backgroundColor = NSColor.black

    popover = NSWindow(
      contentRect: NSRect(x: 0, y: 0, width: popoverWidth, height: popoverHeight),
      styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
      backing: .buffered,
      defer: false
    )
    popover.titlebarAppearsTransparent = true
    popover.titleVisibility = .hidden
    popover.isMovableByWindowBackground = false
    popover.isReleasedWhenClosed = false
    popover.styleMask.remove(.resizable)
    popover.collectionBehavior = [.transient, .ignoresCycle]
    popover.standardWindowButton(.closeButton)?.isHidden = true
    popover.standardWindowButton(.zoomButton)?.isHidden = true
    popover.standardWindowButton(.miniaturizeButton)?.isHidden = true
    popover.contentViewController = viewController
    
    self.windowDelegate = WindowDelegate(resignHandler: { self.hidePopover() })
    popover.delegate = self.windowDelegate
    
    // Menu Bar Item
    statusBarItem = NSStatusBar.system.statusItem(withLength: CGFloat(NSStatusItem.variableLength))
    if let button = self.statusBarItem.button {
      button.action = #selector(togglePopover(_:))
      
      let icon = ZStack(alignment: .center) {
        Image(systemName: "mustache.fill")
          .font(.title2)
      }
      let iconView = NSHostingView(rootView: icon)
      iconView.frame = NSRect(x: 0, y: 0, width: 30, height: 22)
      button.addSubview(iconView)
      button.frame = iconView.frame
    }

    // Global Key Handler
    NSEvent.addLocalMonitorForEvents(matching: .keyDown) {
      if let appBridge = self.getBridge() {
        let key = String(utf8String: $0.characters?.cString(using: String.Encoding.utf8) ?? [CChar(0)])
        appBridge.sendKeyDownEvent(key: key, keyCode: $0.keyCode)
      }
      
      return self.consumeKeys ? nil : $0
    }
    
    // Notifications
    UNUserNotificationCenter.current().delegate = self
    UNUserNotificationCenter.current().getNotificationSettings { (settings) in
      if settings.authorizationStatus != .authorized {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { (authorized, error) in
          if (!authorized) {
            print("Notifications Disabled")
          }
        }
      }
    }
  }
  
  @objc func setBackgroundColor(_ hex: String) {
    let hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)
    let scanner = Scanner(string: hexString)
    if (hexString.hasPrefix("#")) {
      scanner.currentIndex = hexString.index(after: hexString.startIndex)
    }
    var color: UInt64 = 0
    scanner.scanHexInt64(&color)
    let r = CGFloat((color & 0xFF0000) >> 16) / 255.0
    let g = CGFloat((color & 0x00FF00) >> 8) / 255.0
    let b = CGFloat(color & 0x0000FF) / 255.0

    rootView.backgroundColor = NSColor(red: r, green: g, blue: b, alpha: 1)
  }

  @objc func resize(_ width: Int, height: Int) {
    popoverWidth = width;
    popoverHeight = height;
    popover.setContentSize(NSSize(width: popoverWidth, height: popoverHeight))
  }

  @objc func togglePopover(_ sender: AnyObject?) {
    if self.popover.isVisible && self.popover.isKeyWindow {
      self.popover.close()
      
      if let appBridge = self.getBridge() {
        appBridge.sendPopoverStateEvent(isVisible: false)
      }
    } else {
      self.popover.makeKeyAndOrderFront(self)
      self.popover.center()
      if !NSApp.isActive {
        NSApp.activate(ignoringOtherApps: true)
      }
      let screen: NSScreen = NSScreen.main!
      let midScreenX = self.statusBarItem.button!.window!.frame.origin.x - (CGFloat)(popoverWidth - 200)
      let posScreenY = screen.frame.height
      let origin = CGPoint(x: Int(midScreenX), y: Int(posScreenY))
      let size = CGSize(width: popoverWidth, height: popoverHeight)
      let frame = NSRect(origin: origin, size: size)
      self.popover.setFrame(frame, display: true)

      if let appBridge = self.getBridge() {
        appBridge.sendPopoverStateEvent(isVisible: true)
      }
    }
  }

  @objc func hidePopover() {
    if self.popover.isVisible {
      self.popover.close()
    }
  }

  @objc func closeApp() {
    NSApp.terminate(nil)
  }
  
  @objc func getBridge() -> AppBridge? {
    if let cachedBridge = bridge { return cachedBridge }
        
    if self.rootView.bridge.moduleIsInitialized(AppBridge.classForCoder()) {
      if let appBridge = self.rootView.bridge.module(for: AppBridge.classForCoder()) as? AppBridge {
        return appBridge
      }
    }
    
    return nil
  }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    return completionHandler([.list, .sound])
  }
}
