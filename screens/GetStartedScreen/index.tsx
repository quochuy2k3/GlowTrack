import { StyleSheet, Image, SafeAreaView } from 'react-native';
import { View, Text, Button } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import { LucideArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.vectorBgContainer}>
        <Image width={90} source={require('@/assets/images/Vectorbg3.png')} />
      </View>

      <View style={styles.headerContainer}>
        <Button
          backgroundColor="transparent"
          width={50}
          rounded={30}
          height={50}
          p={3}
          onPress={() => router.back()}
        >
          <LucideArrowLeft color="white" />
        </Button>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome</Text>
        </View>
      </View>

      <View style={styles.screenContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/logoNoBg.png')} style={styles.logo} />
        </View>

        <View style={styles.footerContainer}>
          <LinearGradient
            colors={['#FF9A8B', '#FFD07B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Button
              backgroundColor="transparent"
              width="100%"
              height="100%"
              onPress={() => router.push('/(signin)/(modals)/sign-in')}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </Button>
          </LinearGradient>

          <LinearGradient
            colors={['#A0E7E5', '#B4F8C8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Button
              backgroundColor="transparent"
              width="100%"
              height="100%"
              onPress={() => router.push('/(signin)/sign-up')}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </Button>
          </LinearGradient>
        </View>

        <View style={styles.copyrightContainer}>
          <Text style={styles.copyright}>© 2025, All rights reserved</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(254 246 235)',
  },
  vectorBgContainer: {
    position: 'absolute',
    top: variables.scale(-300),
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: variables.scale(500),
    height: variables.scale(500),
  },
  titleContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontFamily: commonColor.fontFamilyWinkySans,
    color: '#fff',
    fontSize: variables.scale(70),
  },
  screenContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: variables.scale(40),
  },
  gradientButton: {
    width: 140,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: variables.scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  copyrightContainer: {
    marginTop: variables.scale(100),
  },
  copyright: {
    fontSize: 12,
    color: '#888',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: variables.scale(20),
    marginTop: variables.scale(10),
  },
});
