//
//  AppBridge.h
//  app
//
//  Created by Justin Walsh on 2/2/24.
//


#import "NativeAppBridge.h"
#import <UserNotifications/UserNotifications.h>
#import "app-Swift.h"

@implementation NativeAppBridge

RCT_EXPORT_MODULE("AppBridge")

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params { 
  return std::make_shared<facebook::react::NativeAppBridgeSpecJSI>(params);
}

- (void)closeApp { 
  dispatch_async(dispatch_get_main_queue(), ^{
      AppDelegate *appDelegate = (AppDelegate *)NSApplication.sharedApplication.delegate;
      [appDelegate closeApp];
  });
}

- (void)consumeKeys:(BOOL)state { 
  AppDelegate *appDelegate = (AppDelegate *)NSApplication.sharedApplication.delegate;
  AppBridge *bridge = [appDelegate getBridge];
  [bridge consumeKeys:state];
}

- (void)isLaunchAtLoginEnabled:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
  AppDelegate *appDelegate = (AppDelegate *)NSApplication.sharedApplication.delegate;
  AppBridge *bridge = [appDelegate getBridge];
  [bridge isLaunchAtLoginEnabled:resolve reject:reject];
}

- (void)launchAtLogin:(BOOL)isEnabled {
  AppDelegate *appDelegate = (AppDelegate *)NSApplication.sharedApplication.delegate;
  AppBridge *bridge = [appDelegate getBridge];
  [bridge launchAtLogin:isEnabled];
}

- (void)resize:(double)width height:(double)height { 
  AppDelegate *appDelegate = (AppDelegate *)NSApplication.sharedApplication.delegate;
  AppBridge *bridge = [appDelegate getBridge];
  [bridge resize:width height:height];
}

- (void)sendNotification:(NSString *)title message:(NSString *)message url:(NSString *)url { 
  AppDelegate *appDelegate = (AppDelegate *)NSApplication.sharedApplication.delegate;
  AppBridge *bridge = [appDelegate getBridge];
  [bridge sendNotification:title payload:message url:url];
}

- (void)setBackgroundColor:(NSString *)hex { 
  AppDelegate *appDelegate = (AppDelegate *)NSApplication.sharedApplication.delegate;
  AppBridge *bridge = [appDelegate getBridge];
  [bridge setBackgroundColor:hex];
}

@end
