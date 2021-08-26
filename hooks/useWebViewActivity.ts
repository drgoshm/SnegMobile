import WebView, {WebViewMessageEvent} from "react-native-webview";
import * as IntentLauncher from "expo-intent-launcher";
import React, {useEffect, useRef, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanResponderGestureState } from "react-native";
import * as Location from 'expo-location';
import {CameraCapturedPicture} from "expo-camera";

//const frontUri = 'http://sneg.chernogolovka.com/'
const frontUri = 'http://front.dev.sneg.chernogolovka.com/'
//const frontUri = 'http://192.168.50.224:3000/'

const runFirst = `
      window.isNativeApp = true;
      window.messageEvents = {}
      document.addEventListener("message",  (message) => {
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

  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  const [showQRScanner, setShowQRScanner] = useState(false)
  const onCloseQRScanner = () => setShowQRScanner(false);

  const [showQRScannerUI, setShowQRScannerUI] = useState(false)
  const [qrScannerUIPos, setQRScannerUIPos] = useState([0,0])
  const onCloseQRScannerUI = () => setShowQRScannerUI(false);

  const onQRScaned = (value: string) => {

    if(ref.current) {
      ref.current.postMessage(JSON.stringify({ action: 'QRScannerResult', data: value }))
    }
  }

  const [showCamera, setShowCamera] = useState(false)
  const [minShots, setMinShots] = useState<number>(2);
  const onCloseCamera = () => setShowCamera(false);
  const onTakePhotos = (pics: Array<CameraCapturedPicture>) => {
    if(ref.current) {
      ref.current.postMessage(JSON.stringify({
        action: 'photos',
        data: JSON.stringify(pics.map((pic, index) => ({
          filename: `photo_${(d => d.getFullYear() + d.getMonth() + d.getDate())(new Date())}_${index}.jpg`,
          content: pic.base64
        })))
      }))
    }
  }

  useEffect(() => {
    if(ref.current) {
      ref.current.postMessage('')
      
    }
  }, [])

  useEffect(() => {
    (async () => {
      console.log('Try to get permission to access location');
      try {
        let {status} = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        } else {
          setLocationPermission(true)
        }
      }
      catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    if(!locationPermission) return;
    const timer = setInterval(async () => {
      if(!locationPermission) return;
      let location = await Location.getCurrentPositionAsync({});
      if(ref.current) {
        ref.current.postMessage(JSON.stringify({
          action: 'location',
          data: location
        }))
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [locationPermission]);

  useEffect(() => {

    AsyncStorage.getItem('@credentials').then((value) => {
      if(value && ref.current) {
        console.log('cred:', value);
          ref.current.postMessage(JSON.stringify({
            action: 'SavedCredentials',
            data: JSON.parse(value),
          }))
      }
    });
  }, [])


  const onMessage = (event: WebViewMessageEvent) => {
    const query = JSON.parse(event.nativeEvent.data);
    if(query.action === 'callQRScanner')  setShowQRScanner(true)
    if(query.action === 'callQRScannerUI') {
      setQRScannerUIPos([query.top, query.height])
      setShowQRScannerUI(true)
    }
    if(query.action === 'stopQRScannerUI') {
      setShowQRScannerUI(false)
    }

    if(query.action === 'callCamera') {
      setShowCamera(true);
      setMinShots(query.minShots);
    }

    if(query.action === 'callLogin') {
      if(!query.username || !query.password) return;
        AsyncStorage.setItem('@credentials', JSON.stringify({
          username: query.username,
          password: query.password,
        }));
    }

    if(query.action === 'getCredentials') {
      AsyncStorage.getItem('@credentials').then((value) => {
        if(value && ref.current) {
          ref.current.postMessage(JSON.stringify({
            action: 'SavedCredentials',
            data: value
          }))
        }
      });
    }

    if(query.action === 'callSmartMerch') {
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
      });
    }
  };

  const onRefresh = (gestureState: PanResponderGestureState) => {
    if (ref.current) {
      setShowQRScannerUI(false);
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
    showQRScannerUI,
    onCloseQRScannerUI,
    qrScannerUIPos,
    onQRScaned,
    showCamera,
    minShots,
    onCloseCamera,
    onTakePhotos,
    source: { uri: frontUri },
    ref,
    injectedJavaScriptBeforeContentLoaded: runFirst,
    injectedJavaScript,
    onMessage,
    onRefresh,
    onNavigationStateChange,
  }
}