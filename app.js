require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID, // made possible thanks to dotenv -> process.env.
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
// create a route/index

app.get("/", (req, res) => {
  res.render("index");
});

/* app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;
  res.render("artist-search");
  console.log(artistName);
  spotifyApi
  .searchArtists(artistName)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}); */

app.get("/artist-search", async (req, res) => {
  const data = await spotifyApi.searchArtists(req.query.artistName);
  console.log(data.body.artists);
  const allArtists = data.body.artists.items;
  res.render("artist-search-results", {allArtists});
});

app.get("/albums/:artistId", async (req, res, next) => {
  const album = await spotifyApi.getArtistAlbums(req.params.artistId);
  const discography = album.body.items;
  res.render("albums", {discography});
});

app.get("/tracks/:albumId", async (req, res, next) => {
  const track = await spotifyApi.getAlbumTracks(req.params.albumId);
  const allTracks = track.body.items;
  res.render("tracks", {allTracks});
});



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
