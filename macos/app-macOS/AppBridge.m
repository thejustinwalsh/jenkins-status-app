//
//  AppBridge.h
//  app
//
//  Created by Justin Walsh on 2/2/24.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AppBridge, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(launchAtLogin: (BOOL)isEnabled)

RCT_EXTERN_METHOD(isLaunchAtLoginEnabled: resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setBackgroundColor: (NSString)hex)

RCT_EXTERN_METHOD(resize: (NSInteger)width height: (NSInteger)height)

RCT_EXTERN_METHOD(closeApp)

RCT_EXTERN_METHOD(consumeKeys: (BOOL)willConsume)

RCT_EXTERN_METHOD(sendNotification: (NSString)title payload:(NSString)payload url:(NSString)url)

@end
