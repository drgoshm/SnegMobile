import WebView, {WebViewMessageEvent} from "react-native-webview";
import * as IntentLauncher from "expo-intent-launcher";
import React, {useEffect, useRef, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanResponderGestureState } from "react-native";


const frontUri = '192.168.1.6:3000'// 'http://front.dev.sneg.chernogolovka.com/'

const runFirst = `
      window.isNativeApp = true;
      window.messageEvents = {}
      document.addEventListener("message",  (message) => {
          console.log(message)
           try {
             const response = JSON.parse(message.data);
             if(!response) return
             if(window.messageEvents[response.action])
             window.messageEvents[response.action](response.data);
           } catch(e) {
             console.log(e)
           }
        });  
      true; // note: this is required, or you'll sometimes get silent failures
    `;

const injectedJavaScript = `
        true;
      `;

type NavigationState = {
  url?: string;
  title?: string;
  loading?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;

}

export const useWebViewActivity = () => {

  const ref = useRef<WebView>(null)

  const [showQRScanner, setShowQRScanner] = useState(false)
  const onCloseQRScanner = () => setShowQRScanner(false);
  const onQRScaned = (value: string) => {
    if(ref.current) {
      ref.current.postMessage(JSON.stringify({ action: 'QRScannerResult', data: value }))
    }
    console.log(value)
  }

  useEffect(() => {
    if(ref.current) {
      ref.current.postMessage('')
    }
  }, [])

  const onMessage = (event: WebViewMessageEvent) => {

    const query = JSON.parse(event.nativeEvent.data);
    console.log(JSON.parse(event.nativeEvent.data))

    if(query.action === 'callQRScanner')  setShowQRScanner(true)

    //setToken

    //
/*
    IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      packageName: 'com.infotek.smartmerch',
      className: 'com.infotek.smartmerch.SmartmerchActivity',
      extra: {
        ACTION: "createVisit",
        DATA: ""
      }
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    });*/
  };

  const onRefresh = (gestureState: PanResponderGestureState) => {
    console.log(gestureState)
    if (ref.current) {
      ref.current.reload();
    }
  }

  const onNavigationStateChange = (newNavState: NavigationState) => {
    if (ref.current) {
      console.log(newNavState.url)
      //ref.current.stopLoading();
    }
  }

  return {
    showQRScanner,
    onCloseQRScanner,
    onQRScaned,
    source: { uri: frontUri },
    ref,
    injectedJavaScriptBeforeContentLoaded: runFirst,
    injectedJavaScript,
    onMessage,
    onRefresh,
    onNavigationStateChange,
  }
}