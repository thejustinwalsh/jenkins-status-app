//
//  MacAppDelegate.mm
//  app
//
//  Created by Justin Walsh on 9/19/24.
//

// TODO: Why is USE_HERMES not defined here?
#ifndef USE_HERMES
#define USE_HERMES 1
#endif

#import "MacAppDelegate.h"
#import <React/RCTColorSpaceUtils.h>
#import <React/RCTLog.h>
#import <React/RCTRootView.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <React/RCTUtils.h>
#import <ReactCommon/RCTHost.h>
#import <objc/runtime.h>
#import <react/featureflags/ReactNativeFeatureFlags.h>
#import <react/featureflags/ReactNativeFeatureFlagsDefaults.h>
#import <react/renderer/graphics/ColorComponents.h>
#import "RCTAppDelegate+Protected.h"
#import "RCTAppSetupUtils.h"


#if RN_DISABLE_OSS_PLUGIN_HEADER
#import <RCTTurboModulePlugin/RCTTurboModulePlugin.h>
#else
#import <React/CoreModulesPlugins.h>
#endif
#import <React/RCTComponentViewFactory.h>
#import <React/RCTComponentViewProtocol.h>
#if USE_HERMES
#import <ReactCommon/RCTHermesInstance.h>
#else
#import <ReactCommon/RCTJscInstance.h>
#endif
#import <react/nativemodule/defaults/DefaultTurboModules.h>

@interface MacAppDelegate () <RCTComponentViewFactoryComponentProvider, RCTHostDelegate>
@end

@implementation MacAppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
  NSApplication *application = [notification object];
  NSDictionary *launchOptions = [notification userInfo];
  
  [self _setUpFeatureFlags];

  RCTSetNewArchEnabled(self.bridgelessEnabled);
  [RCTColorSpaceUtils applyDefaultColorSpace:self.defaultColorSpace];
  RCTAppSetupPrepareApp(application, self.turboModuleEnabled);

  self.rootViewFactory = [self createRCTRootViewFactory];

  RCTPlatformView *rootView = [self.rootViewFactory viewWithModuleName:self.moduleName // [macOS]
                                                     initialProperties:self.initialProps
                                                         launchOptions:launchOptions];

  [RCTComponentViewFactory currentComponentViewFactory].thirdPartyFabricComponentsProvider = self;
  
  self.window = [self createWindow:rootView];
}

- (NSWindow *)createWindow:(NSView*)rootView
{
  NSRect frame = NSMakeRect(0,0,1280,720);
  NSWindow* window = [[NSWindow alloc] initWithContentRect:NSZeroRect
                      styleMask:NSWindowStyleMaskTitled | NSWindowStyleMaskResizable | NSWindowStyleMaskClosable | NSWindowStyleMaskMiniaturizable
                        backing:NSBackingStoreBuffered
                        defer:NO];
  window.title = self.moduleName;
  window.autorecalculatesKeyViewLoop = YES;
  
  NSViewController *rootViewController = [NSViewController new];
  rootViewController.view = rootView;
  rootView.frame = frame;
  window.contentViewController = rootViewController;
  [window makeKeyAndOrderFront:self];
  [window center];
  
  return window;
}

- (RCTRootViewFactory *)createRCTRootViewFactory
{
  __weak __typeof(self) weakSelf = self;
  RCTBundleURLBlock bundleUrlBlock = ^{
    RCTAppDelegate *strongSelf = weakSelf;
    return strongSelf.bundleURL;
  };
  
  RCTRootViewFactoryConfiguration *configuration =
  [[RCTRootViewFactoryConfiguration alloc] initWithBundleURLBlock:bundleUrlBlock
                                                   newArchEnabled:self.fabricEnabled
                                               turboModuleEnabled:self.turboModuleEnabled
                                                bridgelessEnabled:self.bridgelessEnabled];
  
  configuration.createRootViewWithBridge = ^RCTPlatformView *(RCTBridge *bridge, NSString *moduleName, NSDictionary *initProps) { // [macOS]
    return [weakSelf createRootViewWithBridge:bridge moduleName:moduleName initProps:initProps];
  };
  
  configuration.createBridgeWithDelegate = ^RCTBridge *(id<RCTBridgeDelegate> delegate, NSDictionary *launchOptions) {
    return [weakSelf createBridgeWithDelegate:delegate launchOptions:launchOptions];
  };

  configuration.customizeRootView = ^(RCTPlatformView *_Nonnull rootView) { // [macOS]
    [weakSelf customizeRootView:(RCTRootView *)rootView];
  };

  configuration.sourceURLForBridge = ^NSURL *_Nullable(RCTBridge *_Nonnull bridge)
  {
    return [weakSelf sourceURLForBridge:bridge];
  };

  configuration.hostDidStartBlock = ^(RCTHost *_Nonnull host) {
    [weakSelf hostDidStart:host];
  };

  configuration.hostDidReceiveJSErrorStackBlock =
      ^(RCTHost *_Nonnull host,
        NSArray<NSDictionary<NSString *, id> *> *_Nonnull stack,
        NSString *_Nonnull message,
        NSUInteger exceptionId,
        BOOL isFatal) {
        [weakSelf host:host didReceiveJSErrorStack:stack message:message exceptionId:exceptionId isFatal:isFatal];
      };

  if ([self respondsToSelector:@selector(extraModulesForBridge:)]) {
    configuration.extraModulesForBridge = ^NSArray<id<RCTBridgeModule>> *_Nonnull(RCTBridge *_Nonnull bridge)
    {
      return [weakSelf extraModulesForBridge:bridge];
    };
  }

  if ([self respondsToSelector:@selector(extraLazyModuleClassesForBridge:)]) {
    configuration.extraLazyModuleClassesForBridge =
        ^NSDictionary<NSString *, Class> *_Nonnull(RCTBridge *_Nonnull bridge)
    {
      return [weakSelf extraLazyModuleClassesForBridge:bridge];
    };
  }

  if ([self respondsToSelector:@selector(bridge:didNotFindModule:)]) {
    configuration.bridgeDidNotFindModule = ^BOOL(RCTBridge *_Nonnull bridge, NSString *_Nonnull moduleName) {
      return [weakSelf bridge:bridge didNotFindModule:moduleName];
    };
  }

  return [[RCTRootViewFactory alloc] initWithConfiguration:configuration andTurboModuleManagerDelegate:self];
}

class RCTAppDelegateFeatureFlags : public facebook::react::ReactNativeFeatureFlagsDefaults {
 public:
  RCTAppDelegateFeatureFlags(bool fuseboxEnabled)
  {
    fuseboxEnabled_ = fuseboxEnabled;
  }

  bool fuseboxEnabledDebug() override
  {
    return fuseboxEnabled_;
  }

 private:
  bool fuseboxEnabled_;
};

class RCTAppDelegateBridgelessFeatureFlags : public RCTAppDelegateFeatureFlags {
 public:
  RCTAppDelegateBridgelessFeatureFlags(bool fuseboxEnabled) : RCTAppDelegateFeatureFlags(fuseboxEnabled) {}

  bool useModernRuntimeScheduler() override
  {
    return true;
  }
  bool enableMicrotasks() override
  {
    return true;
  }
  bool batchRenderingUpdatesInEventLoop() override
  {
    return true;
  }
};

- (void)_setUpFeatureFlags
{
  if ([self bridgelessEnabled]) {
    facebook::react::ReactNativeFeatureFlags::override(
        std::make_unique<RCTAppDelegateBridgelessFeatureFlags>([self unstable_fuseboxEnabled]));
  } else {
    facebook::react::ReactNativeFeatureFlags::override(
        std::make_unique<RCTAppDelegateFeatureFlags>([self unstable_fuseboxEnabled]));
  }
}
  
- (void)host:(nonnull RCTHost *)host didReceiveJSErrorStack:(nonnull NSArray<NSDictionary<NSString *,id> *> *)stack message:(nonnull NSString *)message exceptionId:(NSUInteger)exceptionId isFatal:(BOOL)isFatal {}

- (void)hostDidStart:(nonnull RCTHost *)host {}

- (NSURL * _Nullable)sourceURLForBridge:(nonnull RCTBridge *)bridge { 
  return [self bundleURL];
}

- (void)encodeWithCoder:(nonnull NSCoder *)coder {
}

@end
