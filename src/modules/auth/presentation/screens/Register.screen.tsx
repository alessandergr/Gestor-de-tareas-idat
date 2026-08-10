import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile, } from "firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View, } from "react-native";

import { firebaseAuth } from "@/config/firebase/firebase.config";
import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";

import { saveUserProfile, type UserGender, } from "@/modules/auth/data/services/user-profile.service";
import { AuthContainer } from "../components/AuthContainer.component";

interface RegisterErrors {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  confirmation: string;
}

const GENDERS: UserGender[] = [
  "Masculino",
  "Femenino",
  "Otro",
];

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<UserGender | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<RegisterErrors>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    password: "",
    confirmation: "",
  });

  const handleRegister = async () => {
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim();

    const nextErrors: RegisterErrors = {
      firstName:
        cleanFirstName.length < 2
          ? "Ingrese un nombre válido"
          : "",
      lastName:
        cleanLastName.length < 2
          ? "Ingrese un apellido válido"
          : "",
      gender:
        !gender
          ? "Seleccione su género"
          : "",
      email:
        !cleanEmail
          ? "Ingrese su correo"
          : !/^\S+@\S+\.\S+$/.test(cleanEmail)
            ? "Ingrese un correo válido"
            : "",
      password:
        password.length < 6
          ? "La contraseña debe tener al menos 6 caracteres"
          : "",
      confirmation:
        !confirmation
          ? "Confirme su contraseña"
          : confirmation !== password
            ? "Las contraseñas no coinciden"
            : "",
    };

    setErrors(nextErrors);

    // Si algún dato está mal, no intentamos crear la cuenta
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        cleanEmail,
        password,
      );

      // Firebase Auth guarda el nombre completo del usuario
      await updateProfile(credential.user, {
        displayName: `${cleanFirstName} ${cleanLastName}`,
      });

      // Firestore guarda los datos extra que usaremos en el perfil
      await saveUserProfile({
        uid: credential.user.uid,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        gender: gender as UserGender,
        email: cleanEmail,
      });

      Alert.alert(
        "Cuenta creada",
        "Tu cuenta fue registrada correctamente.",
      );
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
          value={firstName}
          error={errors.firstName}
          editable={!isLoading}
          onChangeText={(value) => {
            setFirstName(value);
            setErrors((current) => ({
              ...current,
              firstName: "",
            }));
          }}
        />

        <InputField
          label="Apellido"
          placeholder="Ingresa tu apellido"
          value={lastName}
          error={errors.lastName}
          editable={!isLoading}
          onChangeText={(value) => {
            setLastName(value);
            setErrors((current) => ({
              ...current,
              lastName: "",
            }));
          }}
        />

        <View style={styles.genderSection}>
          <Text
            style={[
              styles.genderLabel,
              { color: palette.texts.primary },
            ]}
          >
            Género
          </Text>

          <View style={styles.genderRow}>
            {GENDERS.map((option) => {
              const selected = gender === option;

              return (
                <Pressable
                  key={option}
                  disabled={isLoading}
                  onPress={() => {
                    setGender(option);
                    setErrors((current) => ({
                      ...current,
                      gender: "",
                    }));
                  }}
                  style={[
                    styles.genderButton,
                    {
                      backgroundColor: selected
                        ? palette.colors.primary.default
                        : palette.colors.surfaceSecondary,
                      borderColor: selected
                        ? palette.colors.primary.default
                        : palette.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected
                        ? palette.texts.primaryButton
                        : palette.texts.primary,
                      fontWeight: "600",
                    }}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {errors.gender ? (
            <Text
              style={[
                styles.error,
                { color: palette.colors.error },
              ]}
            >
              {errors.gender}
            </Text>
          ) : null}
        </View>

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

        {/* Si ya tiene cuenta puede volver al login */}
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
  genderSection: {
    gap: 8,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  genderRow: {
    flexDirection: "row",
    gap: 8,
  },
  genderButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  error: {
    fontSize: 13,
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