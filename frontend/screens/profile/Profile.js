import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

const Profile = ({ navigation }) => {
  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState("Kiệt Lưu");
  const [email, setEmail] = useState("kietluu@gmail.com");
  const [phone, setPhone] = useState("0987654321");

  const handleSave = () => {
    setIsEdit(false);

    Alert.alert("Success", "Profile updated successfully");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setIsEdit(!isEdit)}
        >
          <Text style={styles.editText}>{isEdit ? "Cancel" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=12",
          }}
          style={styles.avatar}
        />

        <Text style={styles.username}>{name}</Text>

        <Text style={styles.useremail}>{email}</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Name */}
        <Text style={styles.label}>Full Name</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          editable={isEdit}
          style={[styles.input, !isEdit && styles.disabledInput]}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          editable={isEdit}
          style={[styles.input, !isEdit && styles.disabledInput]}
        />

        {/* Phone */}
        <Text style={styles.label}>Phone</Text>

        <TextInput
          value={phone}
          onChangeText={setPhone}
          editable={isEdit}
          keyboardType="phone-pad"
          style={[styles.input, !isEdit && styles.disabledInput]}
        />

        {/* Save Button */}
        {isEdit && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },

  editBtn: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  editText: {
    color: "#fff",
    fontWeight: "bold",
  },

  avatarContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  username: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },

  useremail: {
    marginTop: 5,
    fontSize: 16,
    color: "#6b7280",
  },

  form: {
    marginTop: 40,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 20,
  },

  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 55,
    fontSize: 16,
    color: "#111827",
  },

  disabledInput: {
    opacity: 0.7,
  },

  saveBtn: {
    backgroundColor: "#8b5cf6",
    marginTop: 35,
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
