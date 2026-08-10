interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: {
    message?: string;
  };
}

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/ewrr1hkb/image/upload";

const UPLOAD_PRESET = "gestor_tareas";

export const uploadTaskImage = async (
  imageUri: string,
): Promise<string> => {
  const formData = new FormData();

  // Preparamos la foto para mandarla a Cloudinary
  formData.append(
    "file",
    {
      uri: imageUri,
      name: `tarea-${Date.now()}.jpg`,
      type: "image/jpeg",
    } as unknown as Blob,
  );

  // Este preset permite subir la foto sin guardar claves privadas en la app
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const result =
    (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !result.secure_url) {
    throw new Error(
      result.error?.message ??
        "No se pudo subir la fotografía",
    );
  }

  // Cloudinary devuelve la URL que luego guardamos con la tarea
  return result.secure_url;
};