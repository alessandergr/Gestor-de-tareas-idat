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

  formData.append(
    "file",
    {
      uri: imageUri,
      name: `tarea-${Date.now()}.jpg`,
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
      result.error?.message ??
        "No se pudo subir la fotografía",
    );
  }

  return result.secure_url;
};