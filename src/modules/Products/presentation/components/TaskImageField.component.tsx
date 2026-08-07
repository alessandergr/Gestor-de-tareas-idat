import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CustomButton } from "@/core/components/CustomButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";

interface TaskImageFieldProps {
  imageUri: string;
  onChangeImage: (uri: string) => void;
}

export const TaskImageField = ({
  imageUri,
  onChangeImage,
}: TaskImageFieldProps) => {
  const { palette } = useThemeContext();

  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Debes permitir el acceso a la cámara.",
      );
      return;
    }

    const result =
      await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.7,
      });

    if (
      !result.canceled &&
      result.assets[0]?.uri
    ) {
      onChangeImage(result.assets[0].uri);
    }
  };

  const chooseFromGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Debes permitir el acceso a tus imágenes.",
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.7,
      });

    if (
      !result.canceled &&
      result.assets[0]?.uri
    ) {
      onChangeImage(result.assets[0].uri);
    }
  };

  const selectImageSource = () => {
    Alert.alert(
      imageUri
        ? "Cambiar fotografía"
        : "Agregar fotografía",
      "Selecciona una opción",
      [
        {
          text: "Cámara",
          onPress: () => {
            void takePhoto();
          },
        },
        {
          text: "Galería",
          onPress: () => {
            void chooseFromGallery();
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { color: palette.texts.primary },
        ]}
      >
        Evidencia fotográfica
      </Text>

      <Text
        style={[
          styles.description,
          { color: palette.texts.secondary },
        ]}
      >
        Agrega una fotografía opcional de la tarea.
      </Text>

      <View
        style={[
          styles.preview,
          {
            backgroundColor:
              palette.colors.surfaceSecondary,
            borderColor: palette.colors.border,
          },
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={{
              color: palette.texts.secondary,
            }}
          >
            Sin fotografía
          </Text>
        )}
      </View>

      <View style={styles.button}>
        <CustomButton
          title={
            imageUri
              ? "Cambiar foto"
              : "Agregar foto"
          }
          variant="outlined"
          onPress={selectImageSource}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
  },
  preview: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 14,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    height: 58,
  },
});