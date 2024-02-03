//
//  AppDelegate.swift
//  app-macOS
//
//  Created by Justin Walsh on 2/2/24.
//

import Foundation
import Cocoa
import SwiftUI

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
  var bridge: RCTBridge!
  var statusBarItem: NSStatusItem!
  var viewController: NSViewController!

  func applicationDidFinishLaunching(_ aNotification: Notification) {
    
    let jsCodeLocation: URL
    #if DEBUG
      jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
    #endif
    
    viewController = NSViewController()
    viewController.view = RCTRootView(bundleURL: jsCodeLocation, moduleName: "app", initialProperties: nil, launchOptions: nil)

    popover = NSWindow(
      contentRect: NSRect(x: 0, y: 0, width: 600, height: 400),
      styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
      backing: .buffered,
      defer: false
    )
    popover.titlebarAppearsTransparent = true
    popover.titleVisibility = .hidden
    popover.isMovableByWindowBackground = false
    popover.isReleasedWhenClosed = false
    popover.collectionBehavior = [.transient, .ignoresCycle]
    popover.standardWindowButton(.closeButton)?.isHidden = true
    popover.standardWindowButton(.zoomButton)?.isHidden = true
    popover.standardWindowButton(.miniaturizeButton)?.isHidden = true
    popover.contentViewController = viewController
    
    self.windowDelegate = WindowDelegate(resignHandler: { self.hidePopover() })
    popover.delegate = self.windowDelegate
    
    statusBarItem = NSStatusBar.system.statusItem(withLength: CGFloat(NSStatusItem.variableLength))
    if let button = self.statusBarItem.button {
      button.action = #selector(togglePopover(_:))
      
      let icon = ZStack(alignment: .center) {
        Image(systemName: "infinity.circle.fill")
          .font(.title2)
      }
      let iconView = NSHostingView(rootView: icon)
      iconView.frame = NSRect(x: 0, y: 0, width: 30, height: 22)
      button.addSubview(iconView)
      button.frame = iconView.frame
    }
  }

  @objc func togglePopover(_ sender: AnyObject?) {
    if self.popover.isVisible && self.popover.isKeyWindow {
      self.popover.close()
    } else {
      self.popover.makeKeyAndOrderFront(self)
      self.popover.center()
      if !NSApp.isActive {
        NSApp.activate(ignoringOtherApps: true)
      }
      let screen: NSScreen = NSScreen.main!
      let midScreenX = self.statusBarItem.button!.window!.frame.origin.x - 300
      let posScreenY = screen.frame.height
      let origin = CGPoint(x: Int(midScreenX), y: Int(posScreenY))
      let size = CGSize(width: 600, height: 700)
      let frame = NSRect(origin: origin, size: size)
      self.popover.setFrame(frame, display: true)
    }
  }

  @objc func hidePopover() {
    if self.popover.isVisible {
      self.popover.close()
    }
  }

  func closeApp() {
    NSApp.terminate(nil)
  }
  
  func getWindowObject() -> NSView {
    return viewController.view
  }
}
