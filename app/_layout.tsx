import {
  DarkerGrotesque_600SemiBold,
  DarkerGrotesque_700Bold,
} from "@expo-google-fonts/darker-grotesque";
import { DMSans_300Light } from "@expo-google-fonts/dm-sans";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthContextProvider, useAuth } from "../context/authContext";

SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    if (typeof isAuthenticated === "undefined") return;
    const inApp = segments[0] == "(app)";
    if (isAuthenticated && !inApp) {
      // Redirect to the home page
      router.replace("/(app)/home");
    } else if (!isAuthenticated) {
      // Redirect to login page
      router.replace("/startScreen");
    }
  }, [isAuthenticated]);

  /* FONT LOADING */
  const [loaded, error] = useFonts({
    DGBold: DarkerGrotesque_700Bold,
    DGSemiBold: DarkerGrotesque_600SemiBold,
    DMSans: DMSans_300Light,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
