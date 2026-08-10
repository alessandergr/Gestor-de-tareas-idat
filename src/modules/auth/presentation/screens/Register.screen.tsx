import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { firebaseAuth } from "@/config/firebase/firebase.config";
import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";
import { AuthContainer } from "../components/AuthContainer.component";

interface RegisterErrors {
  name: string;
  email: string;
  password: string;
  confirmation: string;
}

// Cambiamos los errores de Firebase por mensajes más fáciles de entender
const getFirebaseMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return "Ocurrió un error inesperado.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "Este correo ya se encuentra registrado.";
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/weak-password":
      return "La contraseña es demasiado débil.";
    case "auth/network-request-failed":
      return "Revisa tu conexión a internet.";
    default:
      return "No se pudo crear la cuenta.";
  }
};

export const RegisterScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<RegisterErrors>({
    name: "",
    email: "",
    password: "",
    confirmation: "",
  });

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    let nameError = "";
    let emailError = "";
    let passwordError = "";
    let confirmationError = "";

    // Revisamos los datos antes de crear la cuenta
    if (cleanName.length < 3) {
      nameError = "Ingrese un nombre válido";
    }

    if (!cleanEmail) {
      emailError = "Ingrese su correo";
    } else if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      emailError = "Ingrese un correo válido";
    }

    if (password.length < 6) {
      passwordError =
        "La contraseña debe tener al menos 6 caracteres";
    }

    if (!confirmation) {
      confirmationError = "Confirme su contraseña";
    } else if (confirmation !== password) {
      confirmationError = "Las contraseñas no coinciden";
    }

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmation: confirmationError,
    });

    // Si algún dato está mal no intentamos registrarlo
    if (
      nameError ||
      emailError ||
      passwordError ||
      confirmationError
    ) {
      return;
    }

    setIsLoading(true);

    try {
      // Firebase crea la cuenta y deja iniciada la sesión automáticamente
      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        cleanEmail,
        password,
      );

      // Guardamos el nombre para mostrarlo después en el perfil
      await updateProfile(credential.user, {
        displayName: cleanName,
      });

      Alert.alert(
        "Cuenta creada",
        "Tu cuenta fue registrada correctamente.",
      );

      // No hacemos otro redirect: RootLayout detecta la sesión y abre las tareas
    } catch (error: unknown) {
      Alert.alert(
        "No se pudo registrar",
        getFirebaseMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Crear cuenta"
      subtitle="Registra tus datos para comenzar"
    >
      <View style={styles.form}>
        <InputField
          label="Nombre"
          placeholder="Ingresa tu nombre"
          value={name}
          error={errors.name}
          editable={!isLoading}
          onChangeText={(value) => {
            setName(value);
            setErrors((current) => ({
              ...current,
              name: "",
            }));
          }}
        />

        <InputField
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          value={email}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => ({
              ...current,
              email: "",
            }));
          }}
        />

        <InputField
          label="Contraseña"
          placeholder="Mínimo 6 caracteres"
          value={password}
          error={errors.password}
          secureTextEntry
          editable={!isLoading}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({
              ...current,
              password: "",
            }));
          }}
        />

        <InputField
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={confirmation}
          error={errors.confirmation}
          secureTextEntry
          editable={!isLoading}
          onChangeText={(value) => {
            setConfirmation(value);
            setErrors((current) => ({
              ...current,
              confirmation: "",
            }));
          }}
        />

        <View style={styles.button}>
          <CustomButton
            title={isLoading ? "Creando cuenta..." : "Registrarme"}
            disabled={isLoading}
            onPress={handleRegister}
          />
        </View>

        {/* Si ya tiene una cuenta puede regresar al login */}
        <View style={styles.loginRow}>
          <Text style={{ color: palette.texts.secondary }}>
            ¿Ya tienes una cuenta?
          </Text>

          <Pressable
            disabled={isLoading}
            onPress={() => router.replace("/login")}
          >
            <Text
              style={[
                styles.link,
                {
                  color: palette.colors.primary.default,
                  opacity: isLoading ? 0.5 : 1,
                },
              ]}
            >
              Inicia sesión
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  button: {
    height: 54,
    marginTop: 4,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  link: {
    fontWeight: "700",
  },
});