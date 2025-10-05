import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NavLink, Route, Routes, Link } from 'react-router-dom'
import { ListPage } from './pages/pokemon/ListPage'
import { GalleryPage } from './pages/pokemon/GalleryPage'
import { PokemonDetailPage } from './pages/pokemon/DetailPage'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="container headerRow">
          <Link to="/" className="navLink" aria-label="Home">Pokémon App</Link>
          <nav className="nav" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => `navLink${isActive ? ' active' : ''}`}>List</NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `navLink${isActive ? ' active' : ''}`}>Gallery</NavLink>
          </nav>
        </div>
      </header>

      <main className="container main">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/pokemon/:idOrName" element={<PokemonDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="container footer">React • TypeScript • Axios • Router</footer>
    </div>
  )
}

export default App;
