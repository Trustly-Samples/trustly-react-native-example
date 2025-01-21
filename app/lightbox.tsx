import { View } from 'react-native';
import { TrustlyLightbox } from 'trustly-react-native';
import EstablishData from '../app/constants/EstablishData';
import Styles from './app.styles';
import { useLocalSearchParams } from 'expo-router'

export default function Index() {
  const { paymentProviderId } = useLocalSearchParams()
  return (
    <View style={Styles.lightboxContainer}>
      <TrustlyLightbox establishData={EstablishData} paymentProviderId={paymentProviderId} />
    </View>
  );
};