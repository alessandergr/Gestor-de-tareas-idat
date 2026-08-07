import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
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

export default function ProfileScreen() {
  const router = useRouter();
  const { palette, toggleTheme } = useThemeContext();

  const user = firebaseAuth.currentUser;
  const isDarkMode = palette.schema === "dark";

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      router.replace("/login");
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text
          style={[
            styles.screenTitle,
            { color: palette.texts.primary },
          ]}
        >
          Mi perfil
        </Text>

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: palette.colors.surface,
              borderColor: palette.colors.border,
              ...palette.shadows.sm,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              {
                backgroundColor:
                  palette.colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={42}
              color={palette.colors.primary.default}
            />
          </View>

          <Text
            style={[
              styles.name,
              { color: palette.texts.primary },
            ]}
          >
            {user?.displayName ?? "Usuario"}
          </Text>

          <Text
            style={[
              styles.email,
              { color: palette.texts.secondary },
            ]}
          >
            {user?.email ?? "Sin correo registrado"}
          </Text>

          <View
            style={[
              styles.profileInformation,
              {
                backgroundColor:
                  palette.colors.surfaceSecondary,
              },
            ]}
          >
            <Text
              style={[
                styles.informationLabel,
                { color: palette.texts.secondary },
              ]}
            >
              Descripción
            </Text>

            <Text
              style={[
                styles.informationText,
                { color: palette.texts.primary },
              ]}
            >
              Usuario que organiza y administra sus
              tareas personales desde la aplicación.
            </Text>

            <Text
              style={[
                styles.informationLabel,
                styles.characteristicsLabel,
                { color: palette.texts.secondary },
              ]}
            >
              Características
            </Text>

            <Text
              style={[
                styles.informationText,
                { color: palette.texts.primary },
              ]}
            >
              Cuenta autenticada · Gestión de tareas ·
              Sincronización de información
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: palette.texts.secondary },
          ]}
        >
          Preferencias
        </Text>

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
  profileCard: {
    alignItems: "center",
    padding: 24,
    borderWidth: 1,
    borderRadius: 18,
  },
  avatar: {
    width: 82,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 41,
  },
  name: {
    marginTop: 14,
    fontSize: 21,
    fontWeight: "700",
  },
  email: {
    marginTop: 4,
    fontSize: 14,
  },
  profileInformation: {
    width: "100%",
    marginTop: 18,
    padding: 15,
    borderRadius: 14,
  },
  informationLabel: {
    marginBottom: 4,
    fontSize: 13,
    fontWeight: "700",
  },
  characteristicsLabel: {
    marginTop: 14,
  },
  informationText: {
    fontSize: 14,
    lineHeight: 20,
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