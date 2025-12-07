import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

export default function AlbumPage() {
  const navigate = useNavigate();
  const { state: album } = useLocation();

  if (!album) return <p>No album data found.</p>;

  return (
    <Container style={{ textAlign: "center", marginTop: "40px", color:"white" }}>
      <h1>{album.name}</h1>

      <img
        src={album.images[0].url}
        alt="Album Cover"
        style={{
          width: "300px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      />

      <p>
       
        <strong>Release Date:</strong> {album.release_date}
      </p>

      <Button
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "10px 20px",
          marginTop: "20px",
        }}
        onClick={() => window.open(album.external_urls.spotify, "_blank")}
      >
        Open on Spotify
      </Button>

      <br />

      <Button
        variant="secondary"
        style={{ marginTop: "20px" }}
        onClick={() => navigate(-1)}
      >
        ⬅ Back to Albums
      </Button>
    </Container>
  );
}
