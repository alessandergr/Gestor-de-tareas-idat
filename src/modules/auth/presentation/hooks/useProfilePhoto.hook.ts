import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

import { uploadProfileImage } from "@/modules/Tasks/data/services/cloudinary-upload.service";
import { updateUserPhoto } from "../../data/services/user-profile.service";

interface UseProfilePhotoProps {
  userId?: string;
  onPhotoUpdated: (photoUrl: string) => void;
}

// Acá manejamos solamente la foto que se toma para el perfil
export const useProfilePhoto = ({
  userId,
  onPhotoUpdated,
}: UseProfilePhotoProps) => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const takePhoto = async () => {
    if (!userId) return;

    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Debes permitir el acceso a la cámara.",
      );
      return;
    }

    // Abrimos directamente la cámara, sin mostrar opción de galería
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]?.uri) return;

    setIsUploadingPhoto(true);

    try {
      // Subimos la foto y guardamos su URL en el perfil del usuario
      const photoUrl = await uploadProfileImage(
        result.assets[0].uri,
      );

      await updateUserPhoto(userId, photoUrl);
      onPhotoUpdated(photoUrl);
    } catch (error) {
      console.error("Error al guardar foto de perfil:", error);

      Alert.alert(
        "No se pudo guardar la foto",
        "Intenta nuevamente.",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return {
    isUploadingPhoto,
    takePhoto,
  };
};