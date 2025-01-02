import { View, Button } from 'react-native';
import { TrustlyWidget } from 'trustly-react-native';
import EstablishData from './constants/EstablishData';
import { Link, router } from 'expo-router';
import Styles from './app.styles';

export default function Index() {
  return (
    <View style={Styles.widgetContainer}>
      <TrustlyWidget establishData={EstablishData} onBankSelected={(bankSelected: string) => {
        router.push({ pathname: '/lightbox', params: { paymentProviderId: bankSelected } })
      }} />
      <Link href="/lightbox" asChild>
        <Button title="Go to Lightbox" />
      </Link>
    </View>
  );
};