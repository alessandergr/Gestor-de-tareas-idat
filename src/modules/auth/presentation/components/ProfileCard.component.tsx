import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeContext } from "@/core/contexts/theme.context";
import type { UserProfileData } from "../../data/services/user-profile.service";

interface ProfileCardProps {
  profile: UserProfileData | null;
  fallbackName: string;
  fallbackEmail: string;
  isUploadingPhoto: boolean;
  onPhotoPress: () => void;
}

interface ProfileFieldProps {
  label: string;
  value: string;
}

// Este bloque evita repetir el mismo diseño para cada dato del usuario
const ProfileField = ({ label, value }: ProfileFieldProps) => {
  const { palette } = useThemeContext();

  return (
    <View style={styles.profileField}>
      <Text
        style={[
          styles.informationLabel,
          { color: palette.texts.secondary },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.informationText,
          { color: palette.texts.primary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

// Acá dejamos junta toda la información visual del perfil
export const ProfileCard = ({
  profile,
  fallbackName,
  fallbackEmail,
  isUploadingPhoto,
  onPhotoPress,
}: ProfileCardProps) => {
  const { palette } = useThemeContext();

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : fallbackName;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.colors.surface,
          borderColor: palette.colors.border,
          ...palette.shadows.sm,
        },
      ]}
    >
      {/* El avatar se puede tocar para agregar o cambiar la foto */}
      <Pressable
        disabled={isUploadingPhoto}
        onPress={onPhotoPress}
        style={[
          styles.avatar,
          {
            backgroundColor: palette.colors.surfaceSecondary,
          },
        ]}
      >
        {isUploadingPhoto ? (
          <ActivityIndicator
            color={palette.colors.primary.default}
          />
        ) : profile?.photoUrl ? (
          <Image
            source={{ uri: profile.photoUrl }}
            style={styles.avatarImage}
          />
        ) : (
          <Ionicons
            name="person-outline"
            size={42}
            color={palette.colors.primary.default}
          />
        )}

        <View
          style={[
            styles.cameraBadge,
            {
              backgroundColor: palette.colors.primary.default,
            },
          ]}
        >
          <Ionicons
            name="camera"
            size={14}
            color={palette.texts.primaryButton}
          />
        </View>
      </Pressable>

      <Text
        style={[
          styles.name,
          { color: palette.texts.primary },
        ]}
      >
        {fullName || "Usuario"}
      </Text>

      <Text
        style={[
          styles.email,
          { color: palette.texts.secondary },
        ]}
      >
        {profile?.email || fallbackEmail}
      </Text>

      {/* Estos datos vienen del perfil guardado en Firestore */}
      <View
        style={[
          styles.information,
          {
            backgroundColor: palette.colors.surfaceSecondary,
          },
        ]}
      >
        <ProfileField
          label="Nombre"
          value={profile?.firstName || "Sin registrar"}
        />

        <ProfileField
          label="Apellido"
          value={profile?.lastName || "Sin registrar"}
        />

        <ProfileField
          label="Género"
          value={profile?.gender || "Sin registrar"}
        />

        <ProfileField
          label="Descripción"
          value="Usuario que organiza y administra sus tareas personales desde la aplicación."
        />

        <ProfileField
          label="Características"
          value="Cuenta autenticada · Gestión de tareas · Sincronización de información"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 41,
  },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
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
  information: {
    width: "100%",
    marginTop: 18,
    padding: 15,
    gap: 14,
    borderRadius: 14,
  },
  profileField: {
    gap: 4,
  },
  informationLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  informationText: {
    fontSize: 14,
    lineHeight: 20,
  },
});