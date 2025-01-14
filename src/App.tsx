import React, { Component } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import { ACCESS_ID, MERCHANT_ID, MERCHANT_REFERENCE } from './env';
import { widget, lightbox } from "./trustly";
import { EstablishData } from './types';
import { shouldOpenInAppBrowser } from "./oauth-utils";
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { MaskedTextInput } from "react-native-mask-text";

// Component to show the loading indicator
const LoadingIndicator = () => (
  <ActivityIndicator color="#333" size="small" style={styles.loading} />
);

// Component to handle amount input
const AmountInput = ({ onChangeAmount }) => (
  <MaskedTextInput
    type="currency"
    options={{ prefix: '', decimalSeparator: '.', groupSeparator: ',', precision: 2 }}
    onChangeText={onChangeAmount}
    style={styles.input}
    keyboardType="numeric"
  />
);

// Component to render result screen after transaction
const ResultScreen = ({ title, returnParameters, onBackToWidget }) => (
  <SafeAreaView style={styles.backgroundStyle}>
    <Text style={styles.amountText}>{title}</Text>
    <Text style={styles.amountText}>{returnParameters}</Text>
    <TouchableOpacity style={styles.payButton} onPress={onBackToWidget}>
      <Text style={{ color: '#fff' }}>Back to widget</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

export default class App extends Component {
  trustlyWebView = null;

  // Initialize payment data
  establishData: EstablishData = {
    accessId: ACCESS_ID,
    merchantId: MERCHANT_ID,
    currency: "USD",
    amount: "0.00",
    merchantReference: MERCHANT_REFERENCE,
    paymentType: "Retrieval",
    returnUrl: "/returnUrl",
    cancelUrl: "/cancelUrl",
    description: "First Data Mobile Test",
    customer: {
      name: "John",
      address: { country: "US" },
    },
    metadata: {
      integrationContext: "InAppBrowserNotify",
      urlScheme: "in-app-browser-rn://",
    },
  };

  state = {
    amount: '0.00',
    title: '',
    lightboxComponent: '',
    step: '',
    returnParameters: '',
  };

  constructor(props) {
    super(props);
  }

  // Open the provided URL in InAppBrowser or default browser if not available
  async openLink(url: string) {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(url, '', {
          ephemeralWebSession: true,
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          toolbarColor: '#6200EE',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          headers: { 'my-custom-header': 'my custom header value' },
        });

        this.handleOAuthResult(result);
      } else {
        Linking.openURL(url); // Fallback to default browser
      }
    } catch (error) {
      console.log(error); // Log errors if any
    }
  }

  // Safely parse the JSON message, if parsing fails, return the string
  getMessageValue = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  };

  // Handle messages received from the Trustly WebView
  handleTrustlyMessages = (msg: any) => {
    let message = msg.nativeEvent.data;
    if (typeof message !== 'string') return; // Ensure the message is a string

    const [command, payloadRaw] = message.split("|");
    const payload = this.getMessageValue(payloadRaw); // Parse payload

    switch (command) {
      case "PayWithMyBank.createTransaction":
        this.establishData.amount = this.state.amount; // Update amount
        this.establishData.paymentProviderId = payload; // Set payment provider ID
        this.buildLightBoxScreen(); // Proceed to the lightbox screen
        break;

      case "message":
        if (payload.type === "PayWithMyBank.OpenExternalBrowser" && shouldOpenInAppBrowser(payload.url)) {
          this.openLink(payload.url); // Open the URL in the in-app browser
        }
        break;

      case "event":
        if (payload.type === "new_location") {
          const url = payload.data;
          if (url.includes("cancelUrl")) {
            this.setState({ title: 'CANCEL PAGE', returnParameters: url, step: 'trx-return' });
          }
          if (url.includes("returnUrl")) {
            this.setState({ title: 'SUCCESS PAGE', returnParameters: url, step: 'trx-return' });
          }
        }
        break;
    }
  };

  // Handle the OAuth result
  handleOAuthResult = (result: any) => {
    if (result.type === 'success') {
      this.trustlyWebView.injectJavaScript('window.Trustly.proceedToChooseAccount();'); // Proceed with the transaction
    }
  };

  // Update the amount when the user inputs a new value
  onChangeAmount = (amount: string) => {
    this.setState({ amount });
  };

  // Reset to the widget screen when the user presses "Back to widget"
  onPressBackToWidget = () => {
    this.setState({ step: 'widget', amount: '0.00', returnParameters: '' });
  };

  // JavaScript message for Trustly widget
  getTrustlyWidgetMessage = `
    window.addEventListener(
      "message",
      function (event) {
        if(event.data.includes("createTransaction")) {
          window.ReactNativeWebView.postMessage(event.data);
        }
      },
      false
    );
  `;

  // JavaScript message for Trustly lightbox
  getTrustlyLightboxMessage = `
    Trustly.addPanelListener((command, obj) => {
      window.ReactNativeWebView.postMessage(\`\${command}|\${JSON.stringify(obj)}\`);
    });
  `;

  // Build and return the widget screen
  buildWidgetScreen = () => (
    <SafeAreaView style={styles.backgroundStyle}>
      <Text style={styles.amountText}>Amount:</Text>
      <AmountInput onChangeAmount={this.onChangeAmount} />
      <WebView
        ref={(ref) => (this.trustlyWebView = ref)}
        source={{ html: widget(ACCESS_ID, this.establishData) }}
        renderLoading={LoadingIndicator}
        injectedJavaScript={this.getTrustlyWidgetMessage}
        onMessage={this.handleTrustlyMessages}
        javaScriptEnabled
        startInLoadingState
        style={styles.widget}
      />
    </SafeAreaView>
  );

  // Build and return the lightbox screen
  buildLightBoxScreen = async () => {
    const html = await lightbox(ACCESS_ID, this.establishData); // Get the lightbox HTML
    this.setState({
      lightboxComponent: (
        <SafeAreaView style={styles.backgroundStyle}>
          <WebView
            ref={(ref) => (this.trustlyWebView = ref)}
            source={{ html }}
            renderLoading={LoadingIndicator}
            injectedJavaScript={this.getTrustlyLightboxMessage}
            onMessage={this.handleTrustlyMessages}
            javaScriptEnabled
            startInLoadingState
            style={styles.widget}
          />
        </SafeAreaView>
      ),
      step: 'lightbox', // Set the step to 'lightbox' to show this screen
    });
  };

  // Render the correct screen based on the current step
  renderScreen = () => {
    const { step, lightboxComponent } = this.state;
    if (step === 'lightbox') return lightboxComponent;
    if (step === 'trx-return') return <ResultScreen title={this.state.title} returnParameters={this.state.returnParameters} onBackToWidget={this.onPressBackToWidget} />;
    return this.buildWidgetScreen();
  };

  render() {
    return this.renderScreen(); // Render the appropriate screen
  }
}

// Styles for various UI elements
const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: Colors.lighter,
    flex: 1,
  },
  widget: { width: '100%', height: '100%' },
  loading: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    height: '100%',
    width: '100%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  amountText: {
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#147EFB',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    margin: 15,
  },
});
