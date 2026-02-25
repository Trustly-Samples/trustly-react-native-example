import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, useColorScheme, Platform } from 'react-native';
import { TrustlyWidget, TrustlyLightbox } from '@trustlyinc/trustly-react-native';

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme ? '#000' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';
  const [screen, setScreen] = useState<'home' | 'success' | 'cancel'>('home');
  const [openLightbox, setOpenLightbox] = useState(false);
  const [nextScreen, setNextScreen] = useState<'success' | 'cancel' | null>(null);

  const establishData = {
    accessId: "A48B73F694C4C8EE6306",
    merchantId: "110005514",
    currency: "USD",
    amount: "1.00",
    merchantReference: "cac73df7-52b4-47d7-89d3-9628d4cfb65e",
    paymentType: "Retrieval",
    returnUrl: "/returnUrl",
    cancelUrl: "/cancelUrl",
    requestSignature: "HT5mVOqBXa8ZlvgX2USmPeLns5o=",
    customer: { name: "John", address: { country: "US" } },
    metadata: {
      integrationContenxt: "InAppBrowser",
      urlScheme: "trustlyrnexample://",
      deepLinkStrategy: "deeplink-url",
      deepLinkUrl: Platform.OS === "android" ? 
      "intent://alpha-merchant.tools.devent.trustly.one/start/oauth/app/#Intent;scheme=https;end" : 
      "https://alpha-merchant.tools.devent.trustly.one/start/oauth/app/",
    },
    description: "First Data Mobile Test",
    env: "sandbox",
  };

  const handleReturn = () => {
    console.log('Return from Lightbox');
    setNextScreen('success');
    setOpenLightbox(false);
  };

  const handleCancel = () => {
    setNextScreen('cancel');
    setOpenLightbox(false);
  };

  const handleBankSelected = (bankId: string, updatedEstablishData: object) => {
    return <TrustlyLightbox
      establishData={updatedEstablishData}
      paymentProviderId={bankId}
      onReturn={handleReturn}
      onCancel={handleCancel}
    />;
  };

  React.useEffect(() => {
    if (!openLightbox && nextScreen) {
      setScreen(nextScreen);
      setNextScreen(null);
    }
  }, [openLightbox, nextScreen]);

  if (screen === 'success') {
    return (
      <View style={[styles.screen, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Payment completed successfully!</Text>
        <Button title="Back to Home" onPress={() => setScreen('home')} />
      </View>
    );
  }

  if (screen === 'cancel') {
    return (
      <View style={[styles.screen, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Payment was cancelled.</Text>
        <Button title="Back to Home" onPress={() => setScreen('home')} />
      </View>
    );
  }

  // Home Screen
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Widget + Lightbox integration */}
      <TrustlyWidget
        establishData={establishData}
        onBankSelected={handleBankSelected}
      />

      {/* Lightbox integration */}
      <Button title="Open Lightbox" onPress={() => setOpenLightbox(true)} />

      {openLightbox && (
        <TrustlyLightbox
          establishData={establishData}
          onReturn={handleReturn}
          onCancel={handleCancel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});
