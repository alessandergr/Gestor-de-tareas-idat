import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { firebaseAuth } from "@/config/firebase/firebase.config";
import { Background } from "@/core/components/Background.component";
import { CustomButton } from "@/core/components/CustomButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import {
  getUserProfile,
  type UserProfileData,
} from "@/modules/auth/data/services/user-profile.service";
import { ProfileCard } from "@/modules/auth/presentation/components/ProfileCard.component";
import { useProfilePhoto } from "@/modules/auth/presentation/hooks/useProfilePhoto.hook";

export default function ProfileScreen() {
  const { palette, toggleTheme } = useThemeContext();
  const user = firebaseAuth.currentUser;
  const isDarkMode = palette.schema === "dark";

  // Acá guardamos los datos del perfil que vienen desde Firestore
  const [profile, setProfile] =
    useState<UserProfileData | null>(null);

  useEffect(() => {
    if (!user) return;

    // Buscamos el perfil usando el UID de la cuenta que tiene sesión abierta
    void getUserProfile(user.uid)
      .then(setProfile)
      .catch(() => undefined);
  }, [user]);

  // Este hook se encarga de cámara, Cloudinary y guardar la nueva foto
  const { isUploadingPhoto, takePhoto } = useProfilePhoto({
    userId: user?.uid,
    onPhotoUpdated: (photoUrl) => {
      setProfile((current) =>
        current ? { ...current, photoUrl } : current,
      );
    },
  });

  const handleLogout = async () => {
    try {
      // RootLayout detecta que ya no hay usuario y vuelve al login
      await signOut(firebaseAuth);
    } catch {
      Alert.alert(
        "No se pudo cerrar sesión",
        "Intenta nuevamente.",
      );
    }
  };

  return (
    <Background>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.screenTitle,
            { color: palette.texts.primary },
          ]}
        >
          Mi perfil
        </Text>

        {/* La tarjeta muestra la información y abre la cámara al tocar el avatar */}
        <ProfileCard
          profile={profile}
          fallbackName={user?.displayName ?? "Usuario"}
          fallbackEmail={
            user?.email ?? "Sin correo registrado"
          }
          isUploadingPhoto={isUploadingPhoto}
          onPhotoPress={() => void takePhoto()}
        />

        <Text
          style={[
            styles.sectionTitle,
            { color: palette.texts.secondary },
          ]}
        >
          Preferencias
        </Text>

        {/* Desde acá cambiamos entre modo claro y oscuro */}
        <View
          style={[
            styles.optionCard,
            {
              backgroundColor: palette.colors.surface,
              borderColor: palette.colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.optionIcon,
              {
                backgroundColor:
                  palette.colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name={
                isDarkMode
                  ? "moon-outline"
                  : "sunny-outline"
              }
              size={22}
              color={palette.colors.primary.default}
            />
          </View>

          <View style={styles.optionText}>
            <Text
              style={[
                styles.optionTitle,
                { color: palette.texts.primary },
              ]}
            >
              Modo oscuro
            </Text>

            <Text
              style={[
                styles.optionDescription,
                { color: palette.texts.secondary },
              ]}
            >
              Cambia la apariencia de la aplicación
            </Text>
          </View>

          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{
              false: palette.colors.border,
              true: palette.colors.primary.light,
            }}
            thumbColor={
              isDarkMode
                ? palette.colors.primary.default
                : palette.colors.surface
            }
          />
        </View>

        {/* Cierra solamente la sesión de la cuenta actual */}
        <View style={styles.logoutButton}>
          <CustomButton
            title="Cerrar sesión"
            color="error"
            variant="outlined"
            onPress={() => void handleLogout()}
          />
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 30,
  },
  screenTitle: {
    marginTop: 18,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "700",
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "700",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 15,
  },
  optionIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  optionText: {
    flex: 1,
    marginHorizontal: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  optionDescription: {
    marginTop: 3,
    fontSize: 13,
  },
  logoutButton: {
    height: 54,
    marginTop: 28,
  },
});