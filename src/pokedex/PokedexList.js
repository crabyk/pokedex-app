import React from "react";

export default function PokedexList({
  pokemon,
  region,
  searchTerm,
  doShinySprites,
}) {
  function importAll(r) {
    let images = {};
    r.keys().forEach((item) => {
      images[item.replace("./", "").replace(".png", "")] = r(item);
    });
    return images;
  }

  const sprites = importAll(require.context("./sprites", false, /\.(png)$/));
  const shinySprites = importAll(
    require.context("./sprites/shiny", false, /\.(png)$/)
  );
  const types = importAll(require.context("./icons", false, /\.(png)$/));

  function GetTypeImages({ pokemon }) {
    if (pokemon.type.length === 1) {
      return (
        <div className="pokemonTypeList">
          <div className="pokemonType">
            <img src={types[pokemon.type[0]]} alt={pokemon.type[0]}></img>
            {pokemon.type[0]}
          </div>
        </div>
      );
    } else {
      return (
        <div className="pokemonTypeList">
          <div className="pokemonType">
            <img src={types[pokemon.type[0]]} alt={pokemon.type[0]}></img>
            {pokemon.type[0]}
          </div>
          <div className="pokemonType">
            <img src={types[pokemon.type[1]]} alt={pokemon.type[1]}></img>
            {pokemon.type[1]}
          </div>
        </div>
      );
    }
  }

  function GetPokemonImages({ pokemon }) {
    if (doShinySprites) {
      return (
        <div className="pokemonSprite">
          <img
            src={shinySprites[pokemon.pokemon_id]}
            alt={pokemon.pokemon_id}
          ></img>
        </div>
      );
    } else {
      return (
        <div className="pokemonSprite">
          <img src={sprites[pokemon.pokemon_id]} alt={pokemon.pokemon_id}></img>
        </div>
      );
    }
  }

  return (
    <div className="pokedex">
      {pokemon
        .filter((pokemon) => {
          switch (region) {
            case "kanto":
              return pokemon.pokemon_id <= 151;
            case "johto":
              return pokemon.pokemon_id >= 152 && pokemon.pokemon_id <= 251;
            case "hoenn":
              return pokemon.pokemon_id >= 252 && pokemon.pokemon_id <= 386;
            case "sinnoh":
              return pokemon.pokemon_id >= 387 && pokemon.pokemon_id <= 493;
            case "unova":
              return pokemon.pokemon_id >= 494 && pokemon.pokemon_id <= 649;
            case "kalos":
              return pokemon.pokemon_id >= 650 && pokemon.pokemon_id <= 721;
            case "alola":
              return pokemon.pokemon_id >= 722 && pokemon.pokemon_id <= 809;
            default:
              return pokemon.pokemon_id <= 809;
            //return pokemon;
          }
        })
        .filter((pokemon) => {
          if (!searchTerm) {
            return pokemon;
          } else {
            return pokemon.pokemon_name
              .toLowerCase()
              .startsWith(searchTerm.toLowerCase());
          }
        })
        .map((pokemon) => (
          <div key={pokemon.pokemon_id} className="pokedexCard">
            <div className="pokemonId">#{pokemon.pokemon_id}</div>
            <div className="pokemonName">{pokemon.pokemon_name}</div>
            <GetPokemonImages pokemon={pokemon} />
            <GetTypeImages pokemon={pokemon} />
          </div>
        ))}
    </div>
  );
}
