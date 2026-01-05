import React, { useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { TrustlyWidget, TrustlyLightbox } from 'trustly-react-native';

export default function App() {
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
      urlScheme: "trustlyrnexample://", 
      universalLink: "https://alpha-merchant.tools.devent.trustly.one/start/oauth/app/" 
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

  React.useEffect(() => {
    if (!openLightbox && nextScreen) {
      setScreen(nextScreen);
      setNextScreen(null);
    }
  }, [openLightbox, nextScreen]);

  if (screen === 'success') {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Payment completed successfully!</Text>
        <Button title="Back to Home" onPress={() => setScreen('home')} />
      </View>
    );
  }

  if (screen === 'cancel') {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Payment was cancelled.</Text>
        <Button title="Back to Home" onPress={() => setScreen('home')} />
      </View>
    );
  }

  // Home Screen
  return (
    <View style={styles.container}>

      {/* Widget + Lightbox integration */}
      <TrustlyWidget 
        establishData={establishData} 
        onBankSelected={(bankId: string, updatedEstablishData: object) => {
          return <TrustlyLightbox
            establishData={updatedEstablishData}
            paymentProviderId={bankId}
            onReturn={handleReturn}
            onCancel={handleCancel}
          />
        }} 
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
    backgroundColor: '#fff',
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
