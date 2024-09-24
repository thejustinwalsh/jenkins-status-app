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

class NotificationDelegate: NSObject, UNUserNotificationCenterDelegate {
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    return completionHandler([.list, .sound])
  }
}

@NSApplicationMain
class AppDelegate: MacAppDelegate {
  var appBridge: AppBridge! = AppBridge()
  var notificationDelegate: NotificationDelegate! = NotificationDelegate();
  var windowDelegate: WindowDelegate!
  var popover: NSWindow!
  var statusBarItem: NSStatusItem!
  var viewController: NSViewController!
  var rootView: NSView!;
  var popoverWidth: Int = 400
  var popoverHeight: Int = 400
  
  public var consumeKeys: Bool = false;
  
  override func bundleURL() -> URL? {
    let url: URL
    #if DEBUG
      url = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")!
    #else
      url = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
    #endif
    
    return url;
  }
  
  override func createWindow(_ rootView: NSView!) -> NSWindow! {
    viewController = NSViewController();
    
    self.rootView = rootView;
    viewController.view = self.rootView;
    
    if let layer = rootView.layer {
      layer.backgroundColor = NSColor.black.cgColor;
    }
    
    popover = NSWindow(
      contentRect: NSRect(x: 0, y: 0, width: popoverWidth, height: popoverHeight),
      styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
      backing: .buffered,
      defer: false
    );
    popover.titlebarAppearsTransparent = true;
    popover.titleVisibility = .hidden;
    popover.isMovableByWindowBackground = false;
    popover.isReleasedWhenClosed = false;
    popover.styleMask.remove(.resizable);
    popover.collectionBehavior = [.transient, .ignoresCycle];
    popover.standardWindowButton(.closeButton)?.isHidden = true;
    popover.standardWindowButton(.zoomButton)?.isHidden = true;
    popover.standardWindowButton(.miniaturizeButton)?.isHidden = true;
    popover.contentViewController = viewController;
    
    self.windowDelegate = WindowDelegate(resignHandler: { self.hidePopover() });
    popover.delegate = self.windowDelegate;
    
    return popover;
  }

  override func applicationDidFinishLaunching(_ aNotification: Notification) {
    self.moduleName = "app";
    super.applicationDidFinishLaunching(aNotification);
    
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
      let key = String(utf8String: $0.characters?.cString(using: String.Encoding.utf8) ?? [CChar(0)])
      self.appBridge.sendKeyDownEvent(key: key, keyCode: $0.keyCode)
      return self.consumeKeys ? nil : $0
    }
    
    // Notifications
    UNUserNotificationCenter.current().delegate = notificationDelegate
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
  
  func setBackgroundColor(_ hex: String) {
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

    if let layer = rootView.layer {
      layer.backgroundColor = NSColor(red: r, green: g, blue: b, alpha: 1).cgColor;
    }
  }

  func resize(_ width: Int, height: Int) {
    popoverWidth = width;
    popoverHeight = height;
    popover.setContentSize(NSSize(width: popoverWidth, height: popoverHeight))
  }

  @objc
  func togglePopover(_ sender: AnyObject?) {
    if self.popover.isVisible && self.popover.isKeyWindow {
      self.popover.close()
      
      //appBridge.sendPopoverStateEvent(isVisible: false)
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

      appBridge.sendPopoverStateEvent(isVisible: true)
    }
  }

  func hidePopover() {
    if self.popover.isVisible {
      self.popover.close()
    }
  }

  @objc
  func closeApp() {
    NSApp.terminate(nil)
  }
  
  @objc
  func getBridge() -> AppBridge {
    return self.appBridge;
  }
}

