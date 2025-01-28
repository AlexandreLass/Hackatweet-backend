const mongoose = require("mongoose");

const connectionString = process.env.CONNECTION_STRING;

let isConnected = false;  // Variable pour vérifier si la connexion est déjà établie

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Déjà connecté à MongoDB");
    return;
  }

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connexion réussie à MongoDB");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB", error);
    throw new Error("Impossible de se connecter à la base de données");
  }
};

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    // Ta logique ici
    res.status(200).json({ message: "Connexion réussie à la DB" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
