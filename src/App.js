import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    fetchCharacters("");
  }, []);

  const fetchCharacters = (query) => {
    const url = query
      ? `https://rickandmortyapi.com/api/character/?name=${query}`
      : `https://rickandmortyapi.com/api/character?page=${Math.floor(Math.random() * 42) + 1}`;

    axios.get(url)
      .then(response => setCharacters(response.data.results || []))
      .catch(error => console.error("Erro ao buscar personagens", error));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    fetchCharacters(e.target.value);
  };

  const openCharacterDetails = (character) => {
    setSelectedCharacter(character);
  };

  const closeCharacterDetails = () => {
    setSelectedCharacter(null);
  };

  const traduzirStatus = (status) => {
    switch (status) {
      case "Alive": return "Vivo";
      case "Dead": return "Morto";
      default: return "Desconhecido";
    }
  };

  const traduzirGenero = (gender) => {
    switch (gender) {
      case "Male": return "Masculino";
      case "Female": return "Feminino";
      case "Genderless": return "Sem gênero";
      default: return "Desconhecido";
    }
  };

  return (
    <div className="container">
      <h1>Rick and Morty Characters</h1>
      <input
        type="text"
        placeholder="Buscar personagem..."
        value={search}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="grid-container">
        {characters.map(character => (
          <div key={character.id} className="card" onClick={() => openCharacterDetails(character)}>
            <img src={character.image} alt={character.name} />
            <h2>{character.name}</h2>
            <p>{traduzirStatus(character.status)} - {character.species}</p>
          </div>
        ))}
      </div>
      {selectedCharacter && (
        <div className="modal-overlay" onClick={closeCharacterDetails}>
          <div className="modal smaller-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeCharacterDetails}>X</button>
            <img src={selectedCharacter.image} alt={selectedCharacter.name} />
            <h2>{selectedCharacter.name}</h2>
            <p><strong>Status:</strong> {traduzirStatus(selectedCharacter.status)}</p>
            <p><strong>Espécie:</strong> {selectedCharacter.species}</p>
            <p><strong>Gênero:</strong> {traduzirGenero(selectedCharacter.gender)}</p>
            <p><strong>Origem:</strong> {selectedCharacter.origin.name}</p>
            <p><strong>Apareceu nos episódios:</strong></p>
            <ul>
              {selectedCharacter.episode.map((ep, index) => (
                <li key={index}>{ep.replace("https://rickandmortyapi.com/api/episode/", "Episódio ")}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;