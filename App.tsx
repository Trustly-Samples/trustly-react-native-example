import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { TrustlyWidget, TrustlyLightbox } from 'trustly-react-native';

export default function App() {
  const [openTrustlyLightbox, setOpenTrustlyLightbox] = useState(false);
  const [paymentProviderId, setPaymentProviderId] = useState(null);

  const EstablishData = {
    accessId: "A48B73F694C4C8EE6306",
    merchantId: "110005514",
    currency: "USD",
    amount: "1.00",
    merchantReference: "cac73df7-52b4-47d7-89d3-9628d4cfb65e",
    paymentType: "Retrieval",
    returnUrl: "/returnUrl",
    cancelUrl: "/cancelUrl",
    requestSignature: "HT5mVOqBXa8ZlvgX2USmPeLns5o=",
    customer: {
      name: "John",
      address: {
        country: "US"
      }
    },
    metadata: {
      urlScheme: "demoapp://",
    },
    description: "First Data Mobile Test",
    env: "sandbox"
  };

  // Quando o usuário seleciona o banco no TrustlyWidget
  const handleBankSelected = (bankId: any) => {
    setPaymentProviderId(bankId);
    setOpenTrustlyLightbox(true);
  };

  // Quando o Lightbox retorna um resultado (sucesso, cancelado, etc)
  const handleReturn = (returnParameters: any) => {
    console.log('Returned:', returnParameters);
    setOpenTrustlyLightbox(false);
    setPaymentProviderId(null);
  };

  const handleCancel = (returnParameters: any) => {
    console.log('Cancelled:', returnParameters);
    setOpenTrustlyLightbox(false);
    setPaymentProviderId(null);
  };

  // Botão para abrir Lightbox diretamente (sem passar banco)
  const handleButtonPress = () => {
    setOpenTrustlyLightbox(true);
  };

  return (
    <View style={styles.widgetContainer}>
      <TrustlyWidget 
        establishData={EstablishData} 
        onBankSelected={handleBankSelected} 
      />

      <Button title="Go to Lightbox" onPress={handleButtonPress} />

      {openTrustlyLightbox && (
        <TrustlyLightbox
          establishData={EstablishData}
          paymentProviderId={paymentProviderId}
          onReturn={handleReturn}
          onCancel={handleCancel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  widgetContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});
