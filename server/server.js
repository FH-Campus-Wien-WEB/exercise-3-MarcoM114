const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', (req, res) => {
    const movies = Object.values(movieModel);
    let allGenres = [];

    movies.forEach(movie => {
        if (movie.Genres && Array.isArray(movie.Genres)) {
            allGenres.push(...movie.Genres);
        }
    });

    const uniqueGenres = [...new Set(allGenres)].sort();
    res.json(uniqueGenres);
});

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
    // 1. Alle Filme aus dem Model-Objekt extrahieren
    let movies = Object.values(movieModel);

    // 2. Den Query-Parameter aus der URL lesen (z.B. /movies?genre=Drama)
    const genreFilter = req.query.genre;

    // 3. Filtern, falls ein Genre übergeben wurde
    if (genreFilter) {
        movies = movies.filter(movie => {
            // Prüfen, ob das Genres-Array existiert und das gesuchte Genre enthält
            // (Wir nutzen toLowerCase, um Fehler durch Groß-/Kleinschreibung zu vermeiden)
            return movie.Genres && movie.Genres.some(g => 
                g.toLowerCase() === genreFilter.toLowerCase()
            );
        });
    }
  // 4. Die (gefilterte oder vollständige) Liste senden
    res.send(movies);
});


// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
