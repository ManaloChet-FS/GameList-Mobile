import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import GameForm from "@/components/GameForm";

export default function Page() {
  const [errorTxt, setErrorTxt] = useState<string>("");

  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const router = useRouter();

  const handleError = (err: any): void => {
    const message = err.response ? err.response.data.error : err.message;
    setErrorTxt(message);
  }

  useEffect(() => {
    (async function getGame(){
      try {
        const { data } = await axios.get(`https://gamelist-dwa-production.up.railway.app/api/v1/games/${id}`);
        setGame(data);
      } catch (err: any) {
        console.log(err);
        handleError(err);
      }
    })();
  }, [])
  
  const deleteGame = async () => {
    try {
      await axios.delete(`https://gamelist-dwa-production.up.railway.app/api/v1/games/${id}`);
      // Sends user back to directory page
      router.replace("/");
    } catch(err: any) {
      console.log(err);
      handleError(err);
    }
  }

  if (!game) return null;

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.text}>Release Date: {game.releaseDate}</Text>
        <Text style={styles.text}>Genre: {game.genre}</Text>
        <View style={styles.timestampContaier}>
          <Text style={styles.subText}>Entry created: {new Date(game.createdAt).toLocaleString()}</Text>
          <Text style={styles.subText}>Last updated: {new Date(game.updatedAt).toLocaleString()}</Text>
        </View>
        {errorTxt ? <Text style={styles.error}>{errorTxt}</Text> : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.delete]} onPress={deleteGame}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showForm ? <GameForm setShowForm={setShowForm} game={game} refresh={null} setRefresh={null} /> : null}
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    maxWidth: 400,
    boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
    margin: 16,
  },
  title: {
    fontSize: 32,
    color: "#f4f4f4",
    fontWeight: "bold"
  },
  text: {
    color: "#f4f4f4",
    fontSize: 24,
  },
  timestampContaier: {
    marginTop: 8
  },
  subText: {
    color: "#f4f4f4",
    fontSize: 14
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 16,
    marginTop: 12
  },
  button: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "#f4f4f4",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  delete: {
    backgroundColor: "#ef233c"
  },
  error: {
    color: "red",
    textAlign: "center",
    marginVertical: 16
  }

})