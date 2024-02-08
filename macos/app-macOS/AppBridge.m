//
//  AppBridge.h
//  app
//
//  Created by Justin Walsh on 2/2/24.
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(AppBridge, NSObject)

RCT_EXTERN_METHOD(launchAtLogin: (BOOL)isEnabled)

RCT_EXTERN_METHOD(isLaunchAtLoginEnabled: resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setBackgroundColor: (NSString)hex)

RCT_EXTERN_METHOD(resize: (NSInteger)width height: (NSInteger)height)

RCT_EXTERN_METHOD(closeApp)

@end
