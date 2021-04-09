import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebView, {WebViewMessageEvent} from "react-native-webview";
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';
import {useWebViewActivity} from "./hooks/useWebViewActivity";
import GestureRecognizer from 'react-native-swipe-gestures';
import QRScanner from './screens/QRScanner';

export default function App() {

  //const [permission, askForPermission] = usePermissions(Permissions.CAMERA, { ask: true });

  const {
    showQRScanner,
    onCloseQRScanner,
    onQRScaned,
    onRefresh,
    ...webViewProps
  } = useWebViewActivity()

   return (
    <View style={styles.container}>

      <GestureRecognizer onSwipeLeft={onRefresh}>
        <WebView
          {...webViewProps}
          style={styles.webView}
        />
      </GestureRecognizer>
      <QRScanner visible={showQRScanner} onClose={onCloseQRScanner} onScanned={onQRScaned} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 26,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: {
    width: 360,
    flexGrow: 1,
  }
});
