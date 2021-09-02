import React from 'react';
import { StyleSheet, SafeAreaView, Dimensions, } from 'react-native';
import WebView from "react-native-webview";
import {useWebViewActivity} from "./hooks/useWebViewActivity";
import GestureRecognizer from 'react-native-swipe-gestures';
import QRScanner from './screens/QRScanner';
import QRScannerUI from './screens/QRScannerUI';
import CameraView from "./screens/Camera";

const dimensions = Dimensions.get('window');


export default function App() {

  //const [permission, askForPermission] = usePermissions(Permissions.CAMERA, { ask: true });

  const {
    showQRScanner,
    onCloseQRScanner,
    showQRScannerUI,
    onCloseQRScannerUI,
    qrScannerUIPos,
    onQRScaned,
    showCamera,
    minShots,
    onTakePhotos,
    onCloseCamera,
    onRefresh,
    ...webViewProps
  } = useWebViewActivity()

  return (
    <SafeAreaView style={styles.container}>

      <GestureRecognizer >
        <WebView
          {...webViewProps}
          style={styles.webView}
          originWhitelist={['*']}
          allowsInlineMediaPlayback
          scalesPageToFit
          mediaPlaybackRequiresUserAction={false}
          geolocationEnabled
          javaScriptEnabled
          startInLoadingState
          // @ts-ignore
          javaScriptEnabledAndroid
          useWebkit
        />
      </GestureRecognizer>
      <QRScanner visible={showQRScanner} onClose={onCloseQRScanner} onScanned={onQRScaned} />
      <QRScannerUI visible={showQRScannerUI} onClose={onCloseQRScannerUI} onScanned={onQRScaned} pos={qrScannerUIPos as [number, number]} />
      <CameraView visible={showCamera} onClose={onCloseCamera} minShots={minShots}  onShoot={onTakePhotos}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 26,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    display: 'flex',
  },
  webView: {
    flex: 1,
    width: dimensions.width,
  }
});
