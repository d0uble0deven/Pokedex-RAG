import { Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell/AppShell';
import Home from './pages/Home/Home';
import Pokedex from './pages/Pokedex/Pokedex';
import PokemonDetail from './pages/PokemonDetail/PokemonDetail';
import Cards from './pages/Cards/Cards';
import TeamBuilder from './pages/TeamBuilder/TeamBuilder';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="pokedex" element={<Pokedex />} />
        <Route path="pokedex/:id" element={<PokemonDetail />} />
        <Route path="cards" element={<Cards />} />
        <Route path="team" element={<TeamBuilder />} />
      </Route>
    </Routes>
  );
}
