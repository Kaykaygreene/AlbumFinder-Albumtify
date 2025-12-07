import "./App.css";
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Card,
  Row,
} from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AlbumPage from "./AlbumPage";
import { Link } from "react-router-dom";
import Favorites from "./Favorites"; // <-- make sure the path is correct
import { Carousel } from "react-bootstrap";
import searchimage from './assets/fav.jpg';
import artist1 from "./assets/artist1.jpg";
import artist2 from "./assets/artist2.jpg";
import artist3 from "./assets/artist3.jpg";
import artist4 from "./assets/artist4.jpg";
import artist5 from "./assets/artist5.jpg";
import artist6 from "./assets/artist6.jpg";
import artist7 from "./assets/artist7.jpg";
import artist8 from "./assets/artist8.jpg";
import artist9 from "./assets/artist9.jpg";
import artist10 from "./assets/artist10.jpg";
import artist11 from "./assets/artist11.jpg";
import artist12 from "./assets/artist12.jpg";


const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]); // ⬅ ADDED
  const [loading, setLoading] = useState(false); // ⬅ ADDED
  const [error, setError] = useState(""); // ⬅ ADDED
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [newReleases, setNewReleases] = useState([]);

useEffect(() => {
  var authParams = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "grant_type=client_credentials&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret,
  };
  fetch("https://accounts.spotify.com/api/token", authParams)
    .then((result) => result.json())
    .then((data) => {
      setAccessToken(data.access_token);

      // ⭐ FETCH NEW RELEASES
      fetch("https://api.spotify.com/v1/browse/new-releases?limit=12", {
        headers: {
          Authorization: "Bearer " + data.access_token,
        },
      })
        .then((res) => res.json())
        .then((releaseData) => {
          setNewReleases(releaseData.albums.items);
        });
    });

  const saved = localStorage.getItem("favorites");
  if (saved) {
    setFavorites(JSON.parse(saved));
  }
}, []);

  async function search(forcedName) {
    const query = forcedName || searchInput;

    if (!query) {
      setError("Please enter an artist name.");
      return;
    }

    setLoading(true);
    setError("");
    setTopTracks([]); // ⬅ RESET TOP TRACKS

    var artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    try {
      // Get Artist
      const res = await fetch(
        "https://api.spotify.com/v1/search?q=" + query + "&type=artist",
        artistParams
      );
      const data = await res.json();

      if (!data.artists.items.length) {
        setError("Artist not found.");
        setAlbums([]);
        setTopTracks([]);
        setLoading(false);
        return;
      }

      var artistID = data.artists.items[0].id;

      // Get Albums
      const albumRes = await fetch(
        "https://api.spotify.com/v1/artists/" +
          artistID +
          "/albums?include_groups=album&market=US&limit=50",
        artistParams
      );
      const albumData = await albumRes.json();
      setAlbums(albumData.items);

      // ⬅ GET TOP TRACKS
      const topTracksRes = await fetch(
        `https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=US`,
        artistParams
      );
      const topTracksData = await topTracksRes.json();
      setTopTracks(topTracksData.tracks.slice(0, 5)); // top 5 tracks
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  }
function toggleFavorite(album) {
  let updatedFavorites;
  if (favorites.find((fav) => fav.id === album.id)) {
    // remove if already favorite
    updatedFavorites = favorites.filter((fav) => fav.id !== album.id);
  } else {
    updatedFavorites = [...favorites, album];
  }
  setFavorites(updatedFavorites);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}

// Function to check if album is favorite
function isFavorite(albumId) {
  return favorites.some((fav) => fav.id === albumId);
}
  return (
    <>
      <Routes>
        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <Container style={{ marginBottom: "30px", textAlign: "center" }}>
{/* HEADER ROW */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "10px 20px",
    marginBottom: "10px",
  }}
>
  {/* Left spacer */}
  <div></div>

  {/* Centered title */}
  <h1
    style={{
      fontSize: "45px",
      margin: "0 auto",
      fontWeight: "bold",
      color: "#3c94e1ff",
      textAlign: "center",
    }}
  >
    Albumtify
  </h1>

  {/* Right favorites link */}
  <div style={{ textAlign: "right" }}>
    <Link
      to="/favorites"
      style={{
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
        textDecoration: "none",
      }}
    >
      ❤️ Favorites
    </Link>
  </div>
</div>



                <div className="welcome-section intro-box">
                  <h3>✨ Welcome to Albumtify!</h3>
                  <img
                    src="public/logo.png"
                    alt="Music banner"
                    className="intro-img"
                  />
                  <p>
                    Albumtify lets you discover albums from your favorite Spotify artists instantly. 
                    Search for any artist and explore their albums, from the latest releases to timeless classics. 
                    Whether you’re a casual listener or a music enthusiast, Albumtify makes it easy to explore, listen, 
                    and find inspiration in your favorite tunes.
                  </p>
                  <p>
                    Our clean and modern interface ensures a smooth experience, while the powerful Spotify API 
                    brings you up-to-date information about artists and albums in real-time. Start searching now 
                    and dive into the music you love!
                  </p>
                </div>
{/* ⭐ NEW RELEASES SECTION ⭐ */}
{newReleases.length > 0 && (
  <Container className="new-releases-section"
   style={{ marginTop: "40px" }}>
    <h2
      style={{
        color: "white",
        textAlign: "center",
        marginBottom: "20px",
        fontWeight: "bold",
      }}
    >
      🎧 New Releases
    </h2>

    <Row
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {newReleases.map((album) => (
        <Card
          key={album.id}
          style={{
            width: "200px",
            margin: "10px",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(`/album/${album.id}`, { state: album })
          }
        >
          <Card.Img
            src={album.images[0].url}
            style={{
               width: "100%",
               height: "220px",       
              objectFit: "cover",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          />

          <Card.Body style={{ textAlign: "center" }}>
            <Card.Title
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: "black",
                marginBottom: "5px",
              }}
            >
              {album.name}
            </Card.Title>

            <p style={{ color: "gray", fontSize: "14px" }}>
              {album.artists[0].name}
            </p>
          </Card.Body>
        </Card>
      ))}
    </Row>
  </Container>
)}

  <div className="trending-section" style={{ marginTop: "40px" }}>
  <h3 style={{ color: "black", textAlign: "center", marginBottom: "20px" }}>🔥 Trending Artists</h3>

  <Carousel interval={3000} indicators={false}>
    {[
  { name: "Taylor Swift", img: artist1 },
  { name: "Bad Bunny", img: artist2 },
  { name: "SZA", img: artist3 },
  { name: "Drake", img: artist4 },
  { name: "Ariana Grande", img: artist5 },
  { name: "Kendrick Lamar", img: artist6 },
  { name: "Billie Eilish", img: artist7 },
  { name: "Sabrina Carpenter", img: artist8 },
  { name: "Tate McRae", img: artist9 },
  { name: "Tyler, The Creator", img: artist10 },
  { name: "Chris Brown", img: artist11 },
  { name: "Mariah The Scientist", img: artist12 },
].map((artist) => (
      <Carousel.Item key={artist.name} style={{ cursor: "pointer" }} onClick={() => {
        setSearchInput(artist.name);
        search(artist.name);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}>
        <img
          className="d-block mx-auto"
          src={artist.img}
          alt={artist.name}
          style={{
            width: "50%",
            height: "550px",
            objectFit: "cover",
            borderRadius: "10px"
            
          }}
        />
        <Carousel.Caption>
          <h5>{artist.name}</h5>
        </Carousel.Caption>
      </Carousel.Item>
    ))}
  </Carousel>
</div>

<div className="search-section">
 

                <p
                  style={{
                    color: "#ffffffff",
                    fontSize: "25px",
                    marginBottom: "20px",
                    letterSpacing: "1px",
                  }}
                >
                  Search any artist and explore their albums 🎧
                </p>


                <div style={{ display: "flex", justifyContent: "center" }}>
                  <InputGroup style={{ width: "500px" }}>
                    <FormControl
                      placeholder="Search For Artist"
                      type="input"
                      aria-label="Search for an Artist"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") search();
                      }}
                      onChange={(event) => setSearchInput(event.target.value)}
                      style={{
                        borderRadius: "5px",
                        padding: "12px 15px",
                        fontSize: "18px",
                      }}
                    />
                    <Button
                      onClick={search}
                      style={{
                        padding: "12px 20px",
                        fontSize: "18px",
                      }}
                    >
                      Search
                    </Button>
                    
                  </InputGroup>
                  {/* 🎵 Image after search section */}

                  
                </div>
                <div style={{ textAlign: "center", marginTop: "30px" }}>
  <img
    src={searchimage}
    alt="Music banner"
    style={{
      width: "80%",
      maxWidth: "600px",
      borderRadius: "10px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    }}
  />
</div>
                </div>


                {error && (
                  <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
                )}

                {loading && (
                  <p style={{ color: "white", marginTop: "15px" }}>
                    Loading albums...
                  </p>
                )}
              </Container>

              <Container>
                {/* ALBUMS */}
                <Row
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    alignContent: "center",
                  }}
                >
                  {albums.map((album) => (
                    <Card
                      key={album.id}
                      className="album-card"
                      style={{
                        backgroundColor: "white",
                        margin: "10px",
                        borderRadius: "5px",
                        marginBottom: "30px",
                        width: "220px",
                      }}
                    >
                      <Card.Img
                        width={200}
                        src={album.images[0].url}
                        style={{
                          borderRadius: "4%",
                          display: "block",
                          margin: "10px auto 0 auto",
                        }}
                      />

<Card.Body
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  <Card.Title
    style={{
      whiteSpace: "wrap",
      fontWeight: "bold",
      maxWidth: "200px",
      fontSize: "18px",
      marginTop: "10px",
      color: "black",
      textAlign: "center",
    }}
  >
    {album.name}
  </Card.Title>

  <Card.Text style={{ color: "black", textAlign: "center" }}>
    Release Date: <br /> {album.release_date}
  </Card.Text>

  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    <Button
      style={{
        backgroundColor: "black",
        color: "white",
        fontWeight: "bold",
        fontSize: "15px",
        borderRadius: "5px",
        padding: "10px 20px",
      }}
      onClick={() =>
        navigate(`/album/${album.id}`, { state: album })
      }
    >
      Album Link
    </Button>

    {/* Heart Button */}
    <Button
      style={{
        backgroundColor: isFavorite(album.id) ? "black" : "#ddd",
        color: isFavorite(album.id) ? "white" : "black",
        fontWeight: "bold",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        padding: "0",
      }}
      onClick={() => toggleFavorite(album)}
    >
      ❤️
    </Button>
  </div>
</Card.Body>

                    </Card>
                  ))}
                </Row>
 {/* TOP TRACKS */}
{topTracks.length > 0 && (
  <Container style={{ marginTop: "50px", textAlign: "center", color:"white" }}>
    <h3>🎵 Top Tracks</h3>
    <Row
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      {topTracks.map((track) => (
        <Card
  key={track.id}
  className="top-track-card"
  style={{
    width: "180px",
    padding: "8px",
    borderRadius: "5px",
    textAlign: "center",
    cursor: "pointer",
  }}
  onClick={() =>
    navigate(`/album/${track.album.id}`, { state: track.album })
  }
>
  <Card.Img
    src={track.album.images[0].url}
    className="top-track-img"
    style={{
      borderRadius: "4%",
      marginBottom: "10px",
      height: "200px",
      objectFit: "cover",
      
    }}
  />
  <Card.Title style={{ fontSize: "16px", marginBottom: "5px" }}>
    {track.name}
  </Card.Title>
  {track.preview_url && (
    <audio
      controls
      style={{ width: "100%" }}
      onClick={(e) => e.stopPropagation()}
    >
      <source src={track.preview_url} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  )}
</Card>

      ))}
    </Row>
  </Container>
)}

              
                <footer
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    textAlign: "center",
                    padding: "20px",
                    marginTop: "40px",
                    width: "100vw",
                    marginLeft: "calc(-50vw + 50%)",
                  }}
                >
                  <p>© 2025 Albumtify. All rights reserved.</p>
                  <p>Made by Karlene Greene with ❤️ using React & Spotify API</p>
                </footer>
              </Container>
            </>
          }
        />

        <Route path="/album/:id" element={<AlbumPage />} />
      <Route  path="/favorites"  element={<Favorites favorites={favorites} />}
/>

      </Routes>
    </>
  );
}

export default App;
