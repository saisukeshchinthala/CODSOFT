/**
 * CineMatch - Content-Based Movie Recommendation System
 */

// 1. Dataset Initialization
const movies = [
    { id: 1, title: "Inception", genres: ["Sci-Fi", "Action", "Thriller"], rating: 8.8, tags: ["dream", "mind-bending", "heist"], desc: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O." },
    { id: 2, title: "The Dark Knight", genres: ["Action", "Crime", "Drama"], rating: 9.0, tags: ["superhero", "batman", "joker", "vigilante"], desc: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice." },
    { id: 3, title: "Interstellar", genres: ["Sci-Fi", "Adventure", "Drama"], rating: 8.6, tags: ["space", "time-travel", "blackhole", "humanity"], desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
    { id: 4, title: "The Matrix", genres: ["Sci-Fi", "Action"], rating: 8.7, tags: ["simulation", "cyberpunk", "hackers", "dystopia"], desc: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence." },
    { id: 5, title: "Avengers: Endgame", genres: ["Action", "Sci-Fi", "Adventure"], rating: 8.4, tags: ["superhero", "marvel", "epic", "time-travel"], desc: "After the devastating events of Infinity War, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe." },
    { id: 6, title: "The Shawshank Redemption", genres: ["Drama"], rating: 9.3, tags: ["prison", "hope", "escape", "friendship"], desc: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency." },
    { id: 7, title: "Forrest Gump", genres: ["Drama", "Romance"], rating: 8.8, tags: ["life", "history", "running", "heartwarming"], desc: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold from the perspective of an Alabama man with an IQ of 75." },
    { id: 8, title: "The Godfather", genres: ["Crime", "Drama"], rating: 9.2, tags: ["mafia", "family", "mob", "italy"], desc: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son." },
    { id: 9, title: "Pulp Fiction", genres: ["Crime", "Drama"], rating: 8.9, tags: ["nonlinear", "tarantino", "cult", "los-angeles"], desc: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption." },
    { id: 10, title: "Parasite", genres: ["Thriller", "Drama", "Comedy"], rating: 8.6, tags: ["class-struggle", "twists", "family", "korea"], desc: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan." },
    { id: 11, title: "Spirited Away", genres: ["Animation", "Fantasy", "Adventure"], rating: 8.6, tags: ["anime", "magic", "studio-ghibli", "spirits"], desc: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts." },
    { id: 12, title: "Spider-Man: Into the Spider-Verse", genres: ["Animation", "Action", "Adventure"], rating: 8.4, tags: ["superhero", "multiverse", "stylish", "coming-of-age"], desc: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities." },
    { id: 13, title: "The Lord of the Rings: The Fellowship of the Ring", genres: ["Fantasy", "Adventure", "Action"], rating: 8.8, tags: ["rings", "magic", "epic", "journey"], desc: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron." },
    { id: 14, title: "Jurassic Park", genres: ["Adventure", "Sci-Fi", "Thriller"], rating: 8.2, tags: ["dinosaurs", "survival", "classic", "theme-park"], desc: "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose." },
    { id: 15, title: "Toy Story", genres: ["Animation", "Comedy", "Adventure"], rating: 8.3, tags: ["toys", "childhood", "pixar", "friendship"], desc: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room." },
    { id: 16, title: "Good Will Hunting", genres: ["Drama", "Romance"], rating: 8.3, tags: ["math", "genius", "therapy", "boston"], desc: "Will Hunting, a janitor at M.I.T., has a gift for mathematics, but needs help from a psychologist to find direction in his life." },
    { id: 17, title: "The Social Network", genres: ["Drama", "Biography"], rating: 7.8, tags: ["facebook", "tech", "startup", "college"], desc: "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea." },
    { id: 18, title: "Mad Max: Fury Road", genres: ["Action", "Sci-Fi", "Adventure"], rating: 8.1, tags: ["post-apocalyptic", "desert", "cars", "survival"], desc: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max." },
    { id: 19, title: "Gladiator", genres: ["Action", "Drama", "Adventure"], rating: 8.5, tags: ["rome", "revenge", "arena", "empire"], desc: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery." },
    { id: 20, title: "Fight Club", genres: ["Drama", "Thriller"], rating: 8.8, tags: ["rules", "psychological", "twist", "underground"], desc: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more." }
];

// Extract unique genres for the UI
const allGenres = [...new Set(movies.flatMap(m => m.genres))].sort();
let selectedGenres = new Set();

// DOM Elements
const genreContainer = document.getElementById('genreContainer');
const searchInput = document.getElementById('searchInput');
const ratingFilter = document.getElementById('ratingFilter');
const ratingValue = document.getElementById('ratingValue');
const recommendBtn = document.getElementById('recommendBtn');
const recommendationsContainer = document.getElementById('recommendationsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultCount = document.getElementById('resultCount');

// 2. Initialization
function init() {
    // Populate genre pills
    allGenres.forEach(genre => {
        const pill = document.createElement('div');
        pill.className = 'genre-pill';
        pill.textContent = genre;
        pill.addEventListener('click', () => toggleGenre(genre, pill));
        genreContainer.appendChild(pill);
    });

    // Event Listeners
    ratingFilter.addEventListener('input', (e) => {
        ratingValue.textContent = parseFloat(e.target.value).toFixed(1);
    });

    recommendBtn.addEventListener('click', handleRecommendations);
    
    searchInput.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') handleRecommendations();
    });
}

function toggleGenre(genre, element) {
    if (selectedGenres.has(genre)) {
        selectedGenres.delete(genre);
        element.classList.remove('active');
    } else {
        selectedGenres.add(genre);
        element.classList.add('active');
    }
}

// 3. Core Logic: Content-Based Filtering & Scoring
function getUserPreferences() {
    return {
        query: searchInput.value.toLowerCase().trim(),
        genres: Array.from(selectedGenres),
        minRating: parseFloat(ratingFilter.value)
    };
}

/**
 * Calculates a score for a movie based on user preferences.
 * +2 points for matching genres
 * +1 point for matching keywords/tags in search query
 * + movie rating / 2 (weighted addition based on rating)
 */
function calculateScore(item, userPreferences) {
    let score = 0;
    
    // 1. Matching genres (+2 points per match)
    if (userPreferences.genres.length > 0) {
        userPreferences.genres.forEach(prefGenre => {
            if (item.genres.includes(prefGenre)) {
                score += 2;
            }
        });
    }

    // 2. Matching search query keywords (+1 point per match)
    if (userPreferences.query) {
        const queryWords = userPreferences.query.split(/\s+/).filter(w => w.length > 0);
        let queryMatched = false;
        
        queryWords.forEach(word => {
            // Check tags
            if (item.tags.some(tag => tag.toLowerCase().includes(word))) {
                score += 1;
                queryMatched = true;
            }
            // Check title
            if (item.title.toLowerCase().includes(word)) {
                score += 1;
                queryMatched = true;
            }
            // Check genres for query
            if (item.genres.some(g => g.toLowerCase().includes(word))) {
                score += 1;
                queryMatched = true;
            }
        });
        
        // If query is provided but movie does not match at all, penalize heavily
        if (!queryMatched) {
            score -= 10;
        }
    }

    // 3. Rating weight
    // Divide by 2 so that rating provides a fractional boost up to ~5 points
    score += item.rating / 2;

    return score;
}

/**
 * Shuffles an array randomly to provide dynamic diversity
 */
function shuffleArray(array) {
    let newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

/**
 * Sort recommendations by score and apply diversity logic
 */
function sortRecommendations(scoredMovies) {
    // First, group movies by score (rounded to 1 decimal place to group similar scores)
    const grouped = {};
    
    scoredMovies.forEach(m => {
        const roundedScore = Math.floor(m.score * 10) / 10;
        if (!grouped[roundedScore]) grouped[roundedScore] = [];
        grouped[roundedScore].push(m);
    });
    
    // Sort the score groups descending
    const sortedScores = Object.keys(grouped).sort((a, b) => parseFloat(b) - parseFloat(a));
    
    let sortedAndDiverse = [];
    
    // Within each similar score bracket, shuffle the movies to provide diversity
    sortedScores.forEach(scoreKey => {
        const shuffledGroup = shuffleArray(grouped[scoreKey]);
        sortedAndDiverse = sortedAndDiverse.concat(shuffledGroup);
    });
    
    return sortedAndDiverse;
}

/**
 * Gets the top results, handles empty states, and removes duplicates
 */
function getTopResults(userPreferences, targetCount = 6) {
    // 1. Initial filter based on minimum rating
    let validMovies = movies.filter(m => m.rating >= userPreferences.minRating);
    
    // 2. Score movies
    let scoredMovies = validMovies.map(movie => {
        return {
            ...movie,
            score: calculateScore(movie, userPreferences)
        };
    });

    // Determine if user has any active filtering criteria
    let hasPreferences = userPreferences.genres.length > 0 || userPreferences.query.length > 0;
    
    if (hasPreferences) {
        // Only keep movies that gained score points from genres or queries.
        // Base score from rating alone is rating/2. If score isn't > rating/2, it means no match.
        scoredMovies = scoredMovies.filter(m => m.score > (m.rating / 2));
    }

    // 3. Apply sorting and diversity logic
    let sortedMovies = sortRecommendations(scoredMovies);

    // 4. Remove Duplicates (safety check based on ID)
    const uniqueIds = new Set();
    let uniqueMovies = [];
    
    for (let movie of sortedMovies) {
        if (!uniqueIds.has(movie.id)) {
            uniqueIds.add(movie.id);
            uniqueMovies.push(movie);
        }
    }

    // 5. Edge Case Handling: Fallbacks and Fillers
    let finalResults = uniqueMovies.slice(0, targetCount);

    if (finalResults.length === 0) {
        // Fallback: If absolutely no matches, show diverse top-rated items
        console.log("No exact matches found. Triggering fallback.");
        let topRated = movies
            .filter(m => m.rating >= userPreferences.minRating)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10); // get top 10
            
        // Provide top items shuffled for diversity
        finalResults = shuffleArray(topRated).slice(0, targetCount);
    } 
    else if (finalResults.length < targetCount && hasPreferences) {
        // Filler: If too few matches, try to find movies with similar genres to pad results
        console.log("Too few matches. Filling with similar categories.");
        
        // Find genres present in the final results to use as proxy preferences
        const fallbackGenres = new Set();
        finalResults.forEach(m => m.genres.forEach(g => fallbackGenres.add(g)));
        
        let fillerCandidates = movies.filter(m => 
            !uniqueIds.has(m.id) && // Not already in results
            m.rating >= userPreferences.minRating &&
            m.genres.some(g => fallbackGenres.has(g)) // Shares a genre
        );
        
        // Sort fillers by rating and shuffle top ones for diversity
        fillerCandidates.sort((a, b) => b.rating - a.rating);
        let topFillers = shuffleArray(fillerCandidates.slice(0, 10));
        
        const needed = targetCount - finalResults.length;
        finalResults = finalResults.concat(topFillers.slice(0, needed));
    }

    return finalResults;
}

// 4. UI Updates
function handleRecommendations() {
    recommendationsContainer.innerHTML = '';
    loadingIndicator.classList.remove('hidden');
    resultCount.classList.add('hidden');
    
    setTimeout(() => {
        const prefs = getUserPreferences();
        const results = getTopResults(prefs, 6);
        displayResults(results);
    }, 600);
}

function displayResults(results) {
    loadingIndicator.classList.add('hidden');
    recommendationsContainer.innerHTML = '';
    
    if (results.length === 0) {
        recommendationsContainer.innerHTML = `
            <div class="empty-state">
                <div class="icon">😔</div>
                <h3>No matches found</h3>
                <p>Try lowering your minimum rating or selecting different genres.</p>
            </div>
        `;
        resultCount.textContent = '0 found';
        resultCount.classList.remove('hidden');
        return;
    }

    resultCount.textContent = `${results.length} recommended`;
    resultCount.classList.remove('hidden');

    results.forEach((movie, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const genresHtml = movie.genres.map(g => `<span class="genre-tag">${g}</span>`).join('');
        const tagsStr = movie.tags.map(t => `#${t}`).join(' ');

        card.innerHTML = `
            <div class="movie-header">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-rating">⭐ ${movie.rating}</div>
            </div>
            <div class="movie-genres">
                ${genresHtml}
            </div>
            <p class="movie-desc">${movie.desc}</p>
            <div class="movie-keywords">${tagsStr}</div>
        `;
        
        recommendationsContainer.appendChild(card);
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
