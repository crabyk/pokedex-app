import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";
import PokedexList from "./PokedexList";
import Loading from "../Loading";
import logo from "./pokeball-logo.png";
import Footer from "./Footer";

export default function Pokedex() {
  const [loading, setLoading] = useState(true);

  const pokemonApiUrl = "https://pogoapi.net/api/v1/pokemon_types.json";
  const [pokemon, setPokemon] = useState([]);

  const getDefaultRegion = () => {
    return "all";
  };

  const [region, setRegion] = useState(getDefaultRegion);

  const handleRegionChange = (e) => {
    const buttons = document.querySelectorAll(".pokedexRegionFilterBtn");
    buttons.forEach((button) => {
      if (button.classList.contains("activeFilterBtn")) {
        button.classList.remove("activeFilterBtn");
      }
    });
    setRegion(e.target.value);
    e.currentTarget.classList.add("activeFilterBtn");
  };

  const [searchTerm, setSearchTerm] = useState();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = document.getElementById("pokedexSearchInput").value;
    setSearchTerm(searchValue);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const [doShinySprites, setDoShinySprites] = useState(false);

  const handleShinyChange = (e) => {
    e.preventDefault();
    setDoShinySprites(e.target.checked);
  };

  function checkAllPokemon() {
    return region.startsWith("all") && !searchTerm;
  }

  const clearInput = (e) => {
    e.preventDefault();
    document.getElementById("pokedexSearchInput").value = "";
    handleSearch(e);
  };

  useEffect(() => {
    setLoading(true);
    let cancel;

    axios
      .get(pokemonApiUrl, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((result) => {
        /* removing duplicates (same pokemon id) */
        var poke = result.data.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.pokemon_id === item.pokemon_id)
        );
        setPokemon(poke);
        setLoading(false);
      });

    return () => {
      cancel();
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <button
        className="btnScrollToTop"
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
      >
        <i className="fas fa-chevron-up"></i>
      </button>
      <div className="pokedexTitle">
        <img src={logo} alt="pokeball" className="logo"></img>
        <p>Pokédex</p>
        <img src={logo} alt="pokeball" className="logo"></img>
      </div>
      <div className="pokedexFilter">
        <h2>Filter</h2>
        <div className="pokedexSearch">
          <div className="pokedexSearchBox">
            <input
              type="text"
              id="pokedexSearchInput"
              onKeyDown={handleSearchEnter}
              /*onChange={(e) => setSearchTerm(e.target.value)}*/ // instant search
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch(e); // if search box empty, refresh pokedex
                }
              }}
            ></input>
            <div className="pokedexSearchBtn" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </div>
          </div>
          <i className="fas fa-times" onClick={clearInput}></i>
        </div>
        <div className="pokedexRegionFilter">
          <button
            value="all"
            className="pokedexRegionFilterBtn activeFilterBtn"
            onClick={handleRegionChange}
          >
            All
          </button>
          <button
            value="kanto"
            className="pokedexRegionFilterBtn"
            onClick={handleRegionChange}
          >
            Kanto
          </button>
          <button
            value="johto"
            className="pokedexRegionFilterBtn"
            onClick={handleRegionChange}
          >
            Johto
          </button>
          <button
            value="hoenn"
            className="pokedexRegionFilterBtn"
            onClick={handleRegionChange}
          >
            Hoenn
          </button>
          <button
            value="sinnoh"
            className="pokedexRegionFilterBtn"
            onClick={handleRegionChange}
          >
            Sinnoh
          </button>
          <button
            value="unova"
            className="pokedexRegionFilterBtn"
            onClick={handleRegionChange}
          >
            Unova
          </button>
          <button
            value="kalos"
            className="pokedexRegionFilterBtn"
            onClick={handleRegionChange}
          >
            Kalos
          </button>
          <button
            value="alola"
            className="pokedexRegionFilterBtn"
            onClick={handleRegionChange}
          >
            Alola
          </button>
        </div>
        <div className="pokedexShinyFilter">
          <div className="round">
            <input
              type="checkbox"
              className="checkboxShiny"
              id="checkboxShiny"
              checked={doShinySprites}
              onChange={handleShinyChange}
              key={doShinySprites}
              disabled={checkAllPokemon()}
            ></input>
            <label htmlFor="checkboxShiny"></label>
            <span
              id="shinyLabel"
              className={checkAllPokemon() ? "disabledShinyLabel" : ""}
            >
              Display shiny sprites?
            </span>
          </div>
        </div>
      </div>
      <PokedexList
        pokemon={pokemon}
        region={region}
        searchTerm={searchTerm}
        doShinySprites={doShinySprites}
      />
      <Footer></Footer>
    </>
  );
}
