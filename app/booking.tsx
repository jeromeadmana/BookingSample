import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useMemo, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type BedSize = "single" | "singleLong" | "queen" | "kingSingle" | "double" | "king";
type Category = "mattress" | "bases";

interface ItemState {
  mattress: Record<BedSize, number>;
  bases: Record<BedSize, number>;
}

export default function Booking() {
  // Contact Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // Pickup & Drop Off
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickupTime, setPickupTime] = useState<string>("08:00");
  const dropOffAddress = "123 Static Street, City";

  // Items to Recycle
  const [items, setItems] = useState<ItemState>({
    mattress: { single: 0, singleLong: 0, queen: 0, kingSingle: 0, double: 0, king: 0 },
    bases: { single: 0, singleLong: 0, queen: 0, kingSingle: 0, double: 0, king: 0 },
  });

  // Summary calculation
  const summary = useMemo(() => {
    const totalItems =
      Object.values(items.mattress).reduce((a, b) => a + b, 0) +
      Object.values(items.bases).reduce((a, b) => a + b, 0);

    return {
      totalItems,
      deliveryFee: totalItems * 10,
      recyclingFee: totalItems * 5,
      estimateDistance: "10 km",
    };
  }, [items]);

  // Update numeric item count
  const updateItem = (category: Category, type: BedSize, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setItems((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: parseInt(numericValue) || 0,
      },
    }));
  };

  // Render mattress/bases grid
  const renderItemGrid = (category: Category) => {
    const pairs: [BedSize, BedSize][] = [
      ["single", "kingSingle"],
      ["singleLong", "double"],
      ["queen", "king"],
    ];

    return pairs.map(([left, right]) => (
      <View key={`${category}-${left}`} style={styles.itemRow}>
        <View style={styles.itemColumn}>
          <Text>{left}</Text>
          <TextInput
            style={styles.itemInput}
            keyboardType="numeric"
            value={String(items[category][left])}
            onChangeText={(val) => updateItem(category, left, val)}
          />
        </View>
        <View style={styles.itemColumn}>
          <Text>{right}</Text>
          <TextInput
            style={styles.itemInput}
            keyboardType="numeric"
            value={String(items[category][right])}
            onChangeText={(val) => updateItem(category, right, val)}
          />
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/images/logo.avif")} style={styles.logo} />
      </View>

      {/* Contact Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>

      {/* Pickup & Drop Off */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup & Drop Off</Text>
        <TextInput
          style={styles.input}
          placeholder="Pickup Address"
          value={pickupAddress}
          onChangeText={setPickupAddress}
        />

        {/* Date Picker */}
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{pickupDate ? pickupDate.toDateString() : "Select Pickup Date"}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={pickupDate || new Date()}
            mode="date"
            display="default"
            onChange={(_event: any, selectedDate?: Date) => {
              setShowDatePicker(false);
              if (selectedDate) setPickupDate(selectedDate);
            }}
          />
        )}

        {/* Time Picker - consistent design */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pickupTime}
            onValueChange={(val: string) => setPickupTime(val)}
            style={styles.picker}
            itemStyle={{ height: 44 }}
          >
            {["08:00", "09:00", "10:00", "11:00", "12:00"].map((time) => (
              <Picker.Item label={time} value={time} key={time} />
            ))}
          </Picker>
        </View>

        <Text style={styles.staticText}>Drop-off Address: {dropOffAddress}</Text>
      </View>

      {/* Items to Recycle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items to Recycle</Text>

        <Text style={styles.subTitle}>Mattresses</Text>
        {renderItemGrid("mattress")}

        <Text style={styles.subTitle}>Bases</Text>
        {renderItemGrid("bases")}
      </View>

      {/* Quote Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quote Summary</Text>
        <Text>Estimate Distance: {summary.estimateDistance}</Text>
        <Text>Total Items: {summary.totalItems}</Text>
        <Text>Delivery Fee: ${summary.deliveryFee}</Text>
        <Text>Recycling Fee: ${summary.recyclingFee}</Text>
      </View>

      {/* Book Button */}
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 120, height: 120, resizeMode: "contain" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  subTitle: { fontSize: 16, fontWeight: "500", marginTop: 10, marginBottom: 5 },
  staticText: { fontSize: 14, marginTop: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  picker: { height: 44, width: "100%" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  itemColumn: { flex: 1, marginHorizontal: 5 },
  itemInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  bookButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
