import { DarkerGrotesque_700Bold } from "@expo-google-fonts/darker-grotesque";
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
      router.replace("/login");
    }
  }, [isAuthenticated]);

  /* FONT LOADING */
  const [loaded, error] = useFonts({
    DGBold: DarkerGrotesque_700Bold,
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
