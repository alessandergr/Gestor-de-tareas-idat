interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: {
    message?: string;
  };
}

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/ewrr1hkb/image/upload";

const UPLOAD_PRESET = "gestor_tareas";

// Esta función sirve para subir cualquier imagen de la aplicación
const uploadImage = async (
  imageUri: string,
  name: string,
): Promise<string> => {
  const formData = new FormData();

  formData.append(
    "file",
    {
      uri: imageUri,
      name: `${name}-${Date.now()}.jpg`,
      type: "image/jpeg",
    } as unknown as Blob,
  );

  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const result =
    (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !result.secure_url) {
    throw new Error(
      result.error?.message ?? "No se pudo subir la imagen",
    );
  }

  // Cloudinary devuelve la URL que luego guardamos en Firestore
  return result.secure_url;
};

// Las tareas siguen usando la misma función que ya teníamos
export const uploadTaskImage = (
  imageUri: string,
): Promise<string> => {
  return uploadImage(imageUri, "tarea");
};

// Esta nueva función será para la foto del perfil
export const uploadProfileImage = (
  imageUri: string,
): Promise<string> => {
  return uploadImage(imageUri, "perfil");
};