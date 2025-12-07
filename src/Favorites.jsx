import React from "react";
import { Container, Card, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Favorites({ favorites }) {
  const navigate = useNavigate();

  return (
    <Container style={{ marginTop: "30px", textAlign: "center", color:"white"}}>
      <h1>Your Favorites ❤️</h1>

      {favorites.length === 0 ? (
        <>
          <p>You haven’t added any favorites yet.</p>

          <Button
            variant="secondary"
            style={{ marginTop: "20px" }}
            onClick={() => navigate(-1)}
          >
            ⬅ Back to Albums
          </Button>
        </>
      ) : (
        
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
          }}
        >
          {favorites.map((album) => (
            <Card
              key={album.id}
              style={{
                backgroundColor: "white",
                margin: "10px",
                borderRadius: "5px",
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

                  <Button
                    style={{
                      backgroundColor: "gray",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "15px",
                      borderRadius: "5px",
                      padding: "10px 20px",
                    }}
                    onClick={() =>
                      navigate(-1) // goes back to the previous page
                    }
                  >
                    Back
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Row>
      )}
    </Container>
  );
}
