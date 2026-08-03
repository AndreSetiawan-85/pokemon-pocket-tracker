"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Pokemon = {
  id: number;
  name: string;
  image: string | null;
  types: string[];
  region: string | null;
  generation: string | null;
  category: string | null;
  evolution: string | null;
  height: string | null;
  weight: string | null;
  ability: string | null;
  description: string | null;
  cardCount: number;
};

type Props = {
  pokemon: Pokemon[];
};

export default function PokemonTabs({
  pokemon,
}: Props) {
  const [tab, setTab] = useState<
    "all" | "released" | "missing"
  >("all");

  const [search, setSearch] = useState("");

  const released = useMemo(
    () =>
      pokemon.filter(
        (item) => item.cardCount > 0
      ),
    [pokemon]
  );

  const missing = useMemo(
    () =>
      pokemon.filter(
        (item) => item.cardCount === 0
      ),
    [pokemon]
  );

  const displayed = useMemo(() => {
    let result = pokemon;

    if (tab === "released") {
      result = released;
    }

    if (tab === "missing") {
      result = missing;
    }

    return result.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [
    tab,
    pokemon,
    released,
    missing,
    search,
  ]);

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm text-gray-500">
            Total Pokémon
          </p>

          <p className="text-3xl font-bold">
            {pokemon.length}
          </p>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm text-gray-500">
            Released
          </p>

          <p className="text-3xl font-bold text-green-600">
            {released.length}
          </p>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm text-gray-500">
            No Card Available
          </p>

          <p className="text-3xl font-bold text-red-600">
            {missing.length}
          </p>
        </div>
      </div>

      <input
        type="text"
        className="
          mt-8
          w-full
          h-16
          rounded-lg
          border
          border-gray-300
          px-4
          text-sm
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
        "
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setTab("all")}
          className={`rounded-lg border px-5 py-2 ${
            tab === "all"
              ? "bg-blue-600 text-white"
              : ""
          }`}
        >
          All
        </button>

        <button
          onClick={() => setTab("released")}
          className={`rounded-lg border px-5 py-2 ${
            tab === "released"
              ? "bg-green-600 text-white"
              : ""
          }`}
        >
          Released
        </button>

        <button
          onClick={() => setTab("missing")}
          className={`rounded-lg border px-5 py-2 ${
            tab === "missing"
              ? "bg-red-600 text-white"
              : ""
          }`}
        >
          No Card Available
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-8 md:grid-cols-5">
        {displayed.map((item) => (
          <Link
            key={item.id}
            href={`/pokemon/${item.name}`}
          >
            <div className="rounded-lg border p-4 transition hover:shadow-lg">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto h-32 w-32 object-contain"
                />
              )}

              <h2 className="mt-2 text-center font-bold capitalize">
                #{item.id} {item.name}
              </h2>

              {item.cardCount > 0 ? (
                <p className="mt-2 text-center text-green-600">
                  ✅ {item.cardCount} cards
                </p>
              ) : (
                <p className="mt-2 text-center text-red-600">
                  ❌ No Card Available
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}