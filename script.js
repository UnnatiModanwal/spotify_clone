document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.querySelector('.play-pause');
    const playPauseIcon = playPauseBtn.querySelector('i');
    const mainContentArea = document.querySelector('.main-content .content-area');
    const navLinks = document.querySelectorAll('.navigation ul li a');
    const nowPlayingAlbumArt = document.querySelector('.now-playing-bar .song-info img');
    const nowPlayingSongTitle = document.querySelector('.now-playing-bar .song-info .text h4');
    const nowPlayingArtistName = document.querySelector('.now-playing-bar .song-info .text p');
    const backButton = document.querySelector('.header .nav-buttons .back');
    const forwardButton = document.querySelector('.header .nav-buttons .forward');
    const songProgressBar = document.getElementById('song-progress');
    const currentTimeSpan = document.querySelector('.current-time');
    const durationSpan = document.querySelector('.duration');

    let viewHistory = [];
    let historyIndex = -1;
    let currentSongDuration = 0;
    let currentPlaybackTime = 0;
    let playbackInterval;
    let currentPlayingItem = null; // To store the current album/playlist
    let currentSongIndex = -1; // To store the index of the current song within the playing item
    let audio = new Audio(); // Declare audio object globally

    const currentUser = {
        name: 'Unnati',
        avatar: 'covers/1.jpg', // Using one of your existing cover images as a placeholder
        bio: 'Passionate music lover and aspiring web developer.',
        followers: 120,
        following: 80,
        playlistsCount: 0, // This will be updated dynamically
        likedSongsCount: 0 // This will be updated dynamically
    };

    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');

    // Set initial profile details
    if (profileAvatar) profileAvatar.src = currentUser.avatar;
    if (profileName) profileName.textContent = currentUser.name;

    const allSongsData = [
        {
            id: 'song-1',
            title: 'Tere Hawale',
            artist: 'Arijit Singh, Shilpa Rao',
            audioSrc: 'songs/1.mp3',
            coverSrc: 'covers/1.jpg',
            duration: '4:47'
        },
        {
            id: 'song-2',
            title: 'Kesariya',
            artist: 'Pritam, Arijit Singh, Amitabh Bhattacharya',
            audioSrc: 'songs/2.mp3',
            coverSrc: 'covers/2.jpg',
            duration: '4:28'
        },
        {
            id: 'song-3',
            title: 'Deva Deva',
            artist: 'Pritam, Arijit Singh, Jonita Gandhi, Amitabh Bhattacharya',
            audioSrc: 'songs/3.mp3',
            coverSrc: 'covers/3.jpg',
            duration: '4:39'
        },
        {
            id: 'song-4',
            title: 'Apna Bana Le',
            artist: 'Sachin-Jigar, Arijit Singh, Amitabh Bhattacharya',
            audioSrc: 'songs/4.mp3',
            coverSrc: 'covers/4.jpg',
            duration: '4:21'
        },
        {
            id: 'song-5',
            title: 'Tu Milta Hai',
            artist: 'Pritam, Arijit Singh, Amitabh Bhattacharya',
            audioSrc: 'songs/5.mp3',
            coverSrc: 'covers/5.jpg',
            duration: '3:57'
        }
    ];

    // Mock Data
    const sections = [
        { id: 'good-morning', title: 'Good Morning', type: 'card-grid', cards: [
            { id: 'daily-mix-1', title: 'Daily Mix 1', artist: 'Various Artists', image: 'covers/1.jpg', type: 'playlist', songs: [allSongsData[0], allSongsData[1]] },
            { id: 'discover-weekly', title: 'Discover Weekly', artist: 'Spotify', image: 'covers/2.jpg', type: 'playlist', songs: [allSongsData[2], allSongsData[3]] },
            { id: 'release-radar', title: 'Release Radar', artist: 'Spotify', image: 'covers/3.jpg', type: 'playlist', songs: [allSongsData[4]] },
            { id: 'chill-vibes-playlist', title: 'Chill Vibes', artist: 'Relaxation Station', image: 'covers/5.jpg', type: 'playlist', songs: [] },
            { id: 'workout-jams', title: 'Workout Jams', artist: 'Motivation Beats', image: 'covers/3.jpg', type: 'playlist', songs: [] },
            { id: 'acoustic-covers', title: 'Acoustic Covers', artist: 'Various Artists', image: 'covers/1.jpg', type: 'playlist', songs: [] },
            { id: 'indie-vibes', title: 'Indie Vibes', artist: 'Various Artists', image: 'covers/2.jpg', type: 'playlist', songs: [
                {title: 'Dream Pop', artist: 'The Luminaries', id: 'dp-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Lo-Fi Beats', artist: 'Bedroom Producers', id: 'lfb-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Starlight Symphony', artist: 'Cosmic Rays', id: 'ss-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Echoing Trails', artist: 'Forest Sounds', id: 'et-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Urban Serenade', artist: 'City Sleepers', id: 'us-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]},
            { id: 'jazz-fusion', title: 'Jazz Fusion', artist: 'Various Artists', image: 'covers/4.jpg', type: 'playlist', songs: [
                {title: 'Smooth Riffs', artist: 'Fusion Collective', id: 'sr-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Groovy Lines', artist: 'Jazz Cats', id: 'gl-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Electric Dreams', artist: 'Synaptic Grooves', id: 'ed-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Midnight Stroll', artist: 'Urban Nocturnes', id: 'ms-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Bebop Bounce', artist: 'Swing Kings', id: 'bb-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]}
        ]},
        { id: 'made-for-you', title: 'Made for You', type: 'card-grid', cards: [
            { id: 'on-repeat', title: 'On Repeat', artist: 'Spotify', image: 'covers/4.jpg', type: 'playlist', songs: [
                {title: 'My Favorite Tune', artist: 'Pop Star', id: 'mft-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Catchy Hook', artist: 'Hitmaker', id: 'ch-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Sing Along Anthem', artist: 'Chart Dominators', id: 'saa-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Feel Good Song', artist: 'Joyful Jams', id: 'fgs-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]},
            { id: 'repeat-rewind', title: 'Repeat Rewind', artist: 'Spotify', image: 'covers/2.jpg', type: 'playlist', songs: [
                {title: 'Oldie But Goodie', artist: 'Classic Artist', id: 'obg-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Nostalgia Trip', artist: 'Retro Band', id: 'nt-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Throwback Thursday', artist: 'Vintage Sounds', id: 'tt-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Decade Dance', artist: 'Timeless Beats', id: 'dd-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]},
            { id: 'daily-drive', title: 'Daily Drive', artist: 'Spotify', image: 'covers/1.jpg', type: 'playlist', songs: [
                {title: 'Podcast Episode', artist: 'Daily News', id: 'pe-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Morning Commute', artist: 'Info Cast', id: 'mc-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Traffic Jam Tales', artist: 'Roadside Radio', id: 'tjt-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Commuter Chronicles', artist: 'Metro Narratives', id: 'cc-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]}
        ]},
        { id: 'recently-played', title: 'Recently Played', type: 'card-grid', cards: [
            { id: 'bohemian-rhapsody', title: 'Bohemian Rhapsody', artist: 'Queen', image: 'covers/2.jpg', type: 'album', songs: [
                {title: 'Bohemian Rhapsody', artist: 'Queen', id: 'br-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Killer Queen', artist: 'Queen', id: 'kq-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Don\'t Stop Me Now', artist: 'Queen', id: 'dsmn-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'We Will Rock You', artist: 'Queen', id: 'wwry-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Another One Bites the Dust', artist: 'Queen', id: 'aobtd-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]},
            { id: 'blinding-lights', title: 'Blinding Lights', artist: 'The Weeknd', image: 'covers/3.jpg', type: 'album', songs: [
                {title: 'Blinding Lights', artist: 'The Weeknd', id: 'bl-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Save Your Tears', artist: 'The Weeknd', id: 'syt-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'In Your Eyes', artist: 'The Weeknd', id: 'iye-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Heartless', artist: 'The Weeknd', id: 'h-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]},
            { id: 'levitating', title: 'Levitating', artist: 'Dua Lipa', image: 'covers/5.jpg', type: 'album', songs: [
                {title: 'Levitating', artist: 'Dua Lipa', id: 'l-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Don\'t Start Now', artist: 'Dua Lipa', id: 'dsn-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Physical', artist: 'Dua Lipa', id: 'p-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Break My Heart', artist: 'Dua Lipa', id: 'bmh-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]},
            { id: 'hot-hits', title: 'Hot Hits', artist: 'Various', image: 'covers/4.jpg', type: 'playlist', songs: [
                {title: 'Pop Anthem', artist: 'Chart Topper', id: 'pa-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Summer Jam', artist: 'Beach Vibes', id: 'sj-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Upbeat Melody', artist: 'Sunshine Crew', id: 'um-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
                {title: 'Feel Good Rhythms', artist: 'Good Times Band', id: 'fgr-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
            ]}
        ]}
    ];
    console.log('Sections array at startup:', sections);

    const browseCategories = [
        { name: 'Podcasts', color: '#E8115B' },
        { name: 'Made for You', color: '#1E3264' },
        { name: 'Charts', color: '#8D67AB' },
        { name: 'New Releases', color: '#006450' },
        { name: 'Discover', color: '#840000' },
        { name: 'Concerts', color: '#27856A' },
        { name: 'Mood', color: '#148A08' },
        { name: 'Party', color: '#503750' },
        { name: 'Hip-Hop', color: '#BC5900' },
        { name: 'Rock', color: '#8D67AB' },
        { name: 'Pop', color: '#E8115B' },
        { name: 'Electronic', color: '#1E3264' },
        { name: 'Workout', color: '#777777' },
        { name: 'Decades', color: '#AA4A44' }
    ];

    // User Playlists (loaded from localStorage or default)
    let userPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [
        { id: 'my-top-songs', name: 'My Top Songs', creator: 'You', image: 'covers/4.jpg', type: 'playlist', songs: [
            allSongsData[0],
            allSongsData[2],
            allSongsData[4]
        ]},
        { id: 'workout-mix', name: 'Workout Mix', creator: 'You', image: 'covers/3.jpg', type: 'playlist', songs: [
            {title: 'Beat 1', artist: 'Gym Tunes', id: 'b1-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Beat 2', artist: 'Workout Pro', id: 'b2-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'High Energy', artist: 'Fitness Freaks', id: 'he-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Power Up', artist: 'Muscle Movers', id: 'pu-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
        ]},
        { id: 'chill-vibes-playlist', name: 'Chill Vibes', creator: 'You', image: 'covers/5.jpg', type: 'playlist', songs: [
            {title: 'Relax Song', artist: 'Chill Group', id: 'rs-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Smooth Tune', artist: 'Relax Nation', id: 'st-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Mellow Moment', artist: 'Peaceful Sounds', id: 'mm-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Calm Rhythms', artist: 'Serenity Artists', id: 'cr-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
        ]},
        { id: 'road-trip', name: 'Road Trip', creator: 'You', image: 'covers/2.jpg', type: 'playlist', songs: [
            {title: 'On The Road', artist: 'Travelers', id: 'otr-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Highway Cruise', artist: 'Open Road Band', id: 'hc-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Adventure Anthem', artist: 'Explorers', id: 'aa-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Scenic Drive', artist: 'Journey Makers', id: 'sd-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
        ]},
        { id: 'focus-beats', name: 'Focus Beats', creator: 'You', image: 'covers/1.jpg', type: 'playlist', songs: [
            {title: 'Study Tune', artist: 'Concentration', id: 'stu-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Deep Work', artist: 'Mind Flow', id: 'dw-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Productivity Pulse', artist: 'Brain Boosters', id: 'pp-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Zen Zone', artist: 'Calm Creators', id: 'zz-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
        ]},
        { id: 'morning-coffee', name: 'Morning Coffee', creator: 'You', image: 'covers/4.jpg', type: 'playlist', songs: [
            {title: 'Smooth Jazz', artist: 'Morning Band', id: 'smj-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Cafe Lounge', artist: 'Acoustic Mornings', id: 'cl-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Sunrise Serenade', artist: 'Daybreak Duo', id: 'sus-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'},
            {title: 'Brewed Awakening', artist: 'Espresso Express', id: 'bae-1', audioSrc: '', coverSrc: 'covers/default.jpg', duration: '0:00'}
        ]}
    ];
    console.log('User playlists after load:', userPlaylists);

    // Liked Songs (loaded from localStorage or default)
    let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [
        allSongsData[0],
        allSongsData[1],
        allSongsData[2],
        allSongsData[3],
        allSongsData[4]
    ];

    let likedArtists = JSON.parse(localStorage.getItem('likedArtists')) || [
        { id: 'liked-artist-1', name: 'Taylor Swift', image: 'covers/1.jpg', type: 'artist' },
        { id: 'liked-artist-2', name: 'Dua Lipa', image: 'covers/5.jpg', type: 'artist' },
        { id: 'liked-artist-3', name: 'The Beatles', image: 'covers/2.jpg', type: 'artist' },
        { id: 'liked-artist-4', name: 'Adele', image: 'covers/3.jpg', type: 'artist' }
    ];
    console.log('Liked artists after load:', likedArtists);

    // Combined data for search and detail views
    let allContent = []; // Changed to let to allow re-assignment

    // Playback Queue (loaded from localStorage or default)
    let playbackQueue = JSON.parse(localStorage.getItem('playbackQueue')) || [];

    // Function to update allContent array
    const updateAllContent = () => {
        allContent = [...sections.flatMap(s => s.cards), ...userPlaylists, ...likedSongs, ...likedArtists];
    };

    updateAllContent(); // Initial call - moved to after localStorage loads

    // Render Functions
    const renderSection = (sectionData) => {
        const sectionElement = document.createElement('div');
        sectionElement.className = `content-section ${sectionData.id}`;
        sectionElement.innerHTML = `<h2>${sectionData.title}</h2><div class="cards-container"></div>`;
        const cardsContainer = sectionElement.querySelector('.cards-container');

        sectionData.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <img src="${card.image}" alt="${card.title}">
                <h4>${card.title}</h4>
                <p>${card.artist || card.creator || ''}</p>
            `;
            cardElement.addEventListener('click', () => navigateTo('detail', { type: card.type, id: card.id }));
            cardsContainer.appendChild(cardElement);
        });
        mainContentArea.appendChild(sectionElement);
    };

    const renderHomePage = () => {
        mainContentArea.innerHTML = ''; // Clear previous content
        sections.filter(s => s.type === 'card-grid').forEach(renderSection);
    };

    const renderSearchPage = (query = '') => {
        mainContentArea.innerHTML = '<h3>Search Spotify</h3><input type="text" id="search-input" placeholder="What do you want to listen to?" class="search-input" /><div class="browse-categories"><h4>Browse all</h4><div class="category-grid"></div></div><div id="search-results" class="cards-container"></div>';
        
        const searchInput = document.getElementById('search-input');
        searchInput.value = query;
        searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

        const categoryGrid = mainContentArea.querySelector('.category-grid');
        browseCategories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.style.backgroundColor = category.color;
            categoryCard.innerHTML = `<h4>${category.name}</h4>`;
            categoryGrid.appendChild(categoryCard);
        });

        if (query) {
            renderSearchResults(query);
        }
    };

    const renderSearchResults = (query) => {
        const searchResultsContainer = document.getElementById('search-results');
        searchResultsContainer.innerHTML = '';
        const lowerCaseQuery = query.toLowerCase();

        const filteredResults = allContent.filter(item => 
            item.title && item.title.toLowerCase().includes(lowerCaseQuery) ||
            item.name && item.name.toLowerCase().includes(lowerCaseQuery) ||
            (item.artist && item.artist.toLowerCase().includes(lowerCaseQuery)) ||
            (item.creator && item.creator.toLowerCase().includes(lowerCaseQuery))
        );

        if (filteredResults.length > 0) {
            filteredResults.forEach(item => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `
                    <img src="${item.image}" alt="${item.title || item.name}">
                    <h4>${item.title || item.name}</h4>
                    <p>${item.artist || item.creator || (item.type === 'artist' ? 'Artist' : '')}</p>
                `;
                cardElement.addEventListener('click', () => navigateTo('detail', { type: item.type, id: item.id }));
                searchResultsContainer.appendChild(cardElement);
            });
        } else if (query) {
            searchResultsContainer.innerHTML = '<p>No results found for "' + query + '".</p>';
        }
    };

    const renderLibraryPage = () => {
        mainContentArea.innerHTML = '<h3>Your Library</h3><div class="cards-container"></div><div class="content-section liked-songs-section"><h2>Liked Songs</h2><div class="liked-songs-container"></div></div><div class="content-section liked-artists-section"><h2>Liked Artists</h2><div class="liked-artists-container"></div></div>';
        
        // Render playlists
        const playlistsContainer = mainContentArea.querySelector('.cards-container');
        userPlaylists.forEach(playlist => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <img src="${playlist.image}" alt="${playlist.name}">
                <h4>${playlist.name}</h4>
                <p>Playlist &bull; ${playlist.creator}</p>
            `;
            cardElement.addEventListener('click', () => navigateTo('detail', { type: playlist.type, id: playlist.id }));
            playlistsContainer.appendChild(cardElement);
        });

        // Render liked songs
        const likedSongsContainer = mainContentArea.querySelector('.liked-songs-container');
        if (likedSongs.length > 0) {
            likedSongs.forEach(song => {
                const songElement = document.createElement('div');
                songElement.className = 'liked-item';
                songElement.innerHTML = `
                    <img src="${song.coverSrc}" alt="${song.title}">
                    <div class="info">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                    <button class="play-song-btn" data-title="${song.title}" data-artist="${song.artist}" data-image="${song.coverSrc}" data-song-id="${song.id}" data-song-audiosrc="${song.audioSrc}" data-song-duration="${song.duration}"><i class="fas fa-play"></i></button>
                `;
                songElement.querySelector('.play-song-btn').addEventListener('click', () => playSong(song, song.coverSrc));
                likedSongsContainer.appendChild(songElement);
            });
        } else {
            likedSongsContainer.innerHTML = '<p>No liked songs yet.</p>';
        }

        // Render liked artists
        const likedArtistsContainer = mainContentArea.querySelector('.liked-artists-container');
        if (likedArtists.length > 0) {
            likedArtists.forEach(artist => {
                const artistElement = document.createElement('div');
                artistElement.className = 'liked-item';
                artistElement.innerHTML = `
                    <img src="${artist.image}" alt="${artist.name}">
                    <div class="info">
                        <h4>${artist.name}</h4>
                        <p>Artist</p>
                    </div>
                `;
                artistElement.addEventListener('click', () => console.log(`Navigating to artist: ${artist.name}`));
                likedArtistsContainer.appendChild(artistElement);
            });
        } else {
            likedArtistsContainer.innerHTML = '<p>No liked artists yet.</p>';
        }
    };

    const renderDetailPage = (item) => {
        mainContentArea.innerHTML = `
            <div class="detail-header">
                <img src="${item.image}" alt="${item.title || item.name}">
                <div class="detail-info">
                    <p>${item.type === 'playlist' ? 'PLAYLIST' : (item.type === 'album' ? 'ALBUM' : (item.type === 'artist' ? 'ARTIST' : ''))}</p>
                    <h1>${item.title || item.name}</h1>
                    <p>${item.artist || item.creator || ''}</p>
                    ${(item.type === 'playlist' || item.type === 'album') ? 
                        `<button class="add-to-library-btn" data-item-id="${item.id}" data-item-type="${item.type}">
                            <i class="fas fa-plus"></i> Add to Library
                        </button>`
                        : ''}
                </div>
            </div>
            <div class="detail-songs">
                <h3>Songs</h3>
                <ul></ul>
            </div>
        `;
        const songList = mainContentArea.querySelector('.detail-songs ul');
        if (item.songs && item.songs.length > 0) {
            item.songs.forEach((song, index) => {
                const isLiked = likedSongs.some(ls => ls.id === song.id);
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${index + 1}. ${song.title} - ${song.artist}</span>
                    <button class="play-song-btn" data-song-id="${song.id}" data-song-title="${song.title}" data-song-artist="${song.artist}" data-song-image="${item.image}" data-song-audiosrc="${song.audioSrc}" data-song-duration="${song.duration}"><i class="fas fa-play"></i></button>
                    <button class="like-song-btn ${isLiked ? 'active' : ''}" data-song-id="${song.id}" data-song-title="${song.title}" data-song-artist="${song.artist}" data-song-image="${item.image}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="add-to-playlist-btn" data-song-id="${song.id}">
                        <i class="fas fa-plus"></i> Add to Playlist
                    </button>
                    <button class="add-to-queue-btn" data-song-id="${song.id}">
                        <i class="fas fa-list"></i> Add to Queue
                    </button>
                `;
                li.querySelector('.play-song-btn').addEventListener('click', (e) => {
                    const songToPlay = allSongsData.find(s => s.id === e.currentTarget.dataset.songId);
                    if (songToPlay) {
                        playSong(songToPlay, item.image, item);
                    }
                });
                
                const likeButton = li.querySelector('.like-song-btn');
                likeButton.addEventListener('click', (e) => {
                    const songId = e.currentTarget.dataset.songId;
                    const songTitle = e.currentTarget.dataset.songTitle;
                    const songArtist = e.currentTarget.dataset.songArtist;
                    const songImage = e.currentTarget.dataset.songImage;

                    const existingLikedSongIndex = likedSongs.findIndex(ls => ls.id === songId);
                    if (existingLikedSongIndex > -1) {
                        likedSongs.splice(existingLikedSongIndex, 1); // Unlike
                        e.currentTarget.classList.remove('active');
                        console.log(`Unliked: ${songTitle}`);
                        saveLikedSongsToLocalStorage();
                    } else {
                        likedSongs.push({ id: songId, title: songTitle, artist: songArtist, image: songImage, type: 'song' }); // Like
                        e.currentTarget.classList.add('active');
                        console.log(`Liked: ${songTitle}`);
                        saveLikedSongsToLocalStorage();
                    }
                });

                const addToPlaylistButton = li.querySelector('.add-to-playlist-btn');
                addToPlaylistButton.addEventListener('click', (e) => {
                    songToAdd = allSongsData.find(s => s.id === e.currentTarget.dataset.songId);
                    console.log('Song to add:', songToAdd);
                    if (songToAdd) {
                        openAddToPlaylistModal();
                    }
                });

                const addToQueueButton = li.querySelector('.add-to-queue-btn');
                addToQueueButton.addEventListener('click', (e) => {
                    const songId = e.currentTarget.dataset.songId;
                    const songToQueue = allSongsData.find(s => s.id === songId);
                    if (songToQueue) {
                        playbackQueue.push(songToQueue);
                        savePlaybackQueueToLocalStorage();
                        alert(`Added "${songToQueue.title}" to queue!`);
                        console.log('Playback queue:', playbackQueue);
                    }
                });

                songList.appendChild(li);
            });
        } else {
            songList.innerHTML = '<p>No songs available for this item.</p>';
        }

        // Add to Library button functionality
        const addToLibraryBtn = mainContentArea.querySelector('.add-to-library-btn');
        if (addToLibraryBtn) {
            const isItemInLibrary = userPlaylists.some(p => p.id === item.id);
            if (isItemInLibrary) {
                addToLibraryBtn.innerHTML = '<i class="fas fa-check"></i> Added to Library';
                addToLibraryBtn.classList.add('added');
            } else {
                addToLibraryBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Library';
                addToLibraryBtn.classList.remove('added');
            }

            addToLibraryBtn.addEventListener('click', () => {
                const itemId = addToLibraryBtn.dataset.itemId;
                const itemType = addToLibraryBtn.dataset.itemType;

                const indexInLibrary = userPlaylists.findIndex(p => p.id === itemId);

                if (indexInLibrary > -1) {
                    userPlaylists.splice(indexInLibrary, 1); // Remove from library
                    addToLibraryBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Library';
                    addToLibraryBtn.classList.remove('added');
                    console.log(`Removed ${item.title || item.name} from library.`);
                } else {
                    // Find the original item from allContent or sections.flatMap(s => s.cards)
                    const originalItem = allContent.find(i => i.id === itemId && i.type === itemType);
                    if (originalItem) {
                        userPlaylists.push(originalItem);
                        addToLibraryBtn.innerHTML = '<i class="fas fa-check"></i> Added to Library';
                        addToLibraryBtn.classList.add('added');
                        console.log(`Added ${item.title || item.name} to library.`);
                    }
                }
                // Re-render library if currently on that page to show changes
                if (historyIndex > -1 && viewHistory[historyIndex].id === 'your-library') {
                    renderLibraryPage();
                }
            });
        }
    };

    const navigateTo = (pageId, params = {}) => {
        const currentView = { id: pageId, params: params };
        if (historyIndex < viewHistory.length - 1) {
            viewHistory = viewHistory.slice(0, historyIndex + 1);
        }
        viewHistory.push(currentView);
        historyIndex++;
        updateNavigationButtons();

        // Render the requested page
        renderPage(pageId, params);
        // Update active navigation link based on the primary page (not detail view)
        if (pageId === 'home' || pageId === 'search' || pageId === 'your-library' || pageId === 'profile') {
            navLinks.forEach(nav => nav.classList.remove('active'));
            const activeLink = Array.from(navLinks).find(link => 
                link.querySelector('span').textContent.toLowerCase().replace(/ /g, '-') === pageId
            );
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } else {
            navLinks.forEach(nav => nav.classList.remove('active')); // Clear active for detail pages
        }
    };

    const goBack = () => {
        if (historyIndex > 0) {
            historyIndex--;
            const previousView = viewHistory[historyIndex];
            renderPage(previousView.id, previousView.params);
            updateNavigationButtons();
            // Update active navigation link after going back
            navLinks.forEach(nav => nav.classList.remove('active'));
            const activeLink = Array.from(navLinks).find(link => 
                link.querySelector('span').textContent.toLowerCase().replace(/ /g, '-') === previousView.id
            );
            if (activeLink) {
                activeLink.classList.add('active');
            } else if (previousView.id === 'detail') {
                // If coming back to a detail page, keep no nav active or activate previous primary nav
            }
        }
    };

    const goForward = () => {
        if (historyIndex < viewHistory.length - 1) {
            historyIndex++;
            const nextView = viewHistory[historyIndex];
            renderPage(nextView.id, nextView.params);
            updateNavigationButtons();
            // Update active navigation link after going forward
            navLinks.forEach(nav => nav.classList.remove('active'));
            const activeLink = Array.from(navLinks).find(link => 
                link.querySelector('span').textContent.toLowerCase().replace(/ /g, '-') === nextView.id
            );
            if (activeLink) {
                activeLink.classList.add('active');
            } else if (nextView.id === 'detail') {
                // If going forward to a detail page, keep no nav active or activate previous primary nav
            }
        }
    };

    const renderPage = (pageId, params = {}) => {
        switch (pageId) {
            case 'home':
                renderHomePage();
                break;
            case 'search':
                renderSearchPage(params.query);
                break;
            case 'your-library':
                renderLibraryPage();
                break;
            case 'detail':
                let detailItem = null;

                // Prioritize user playlists if the type is playlist
                if (params.type === 'playlist') {
                    detailItem = userPlaylists.find(p => p.id === params.id);
                }

                // Fallback to allContent if not found in userPlaylists or if type is not playlist
                if (!detailItem) {
                    detailItem = allContent.find(i => i.id === params.id && i.type === params.type);
                }
                
                if (!detailItem && params.type === 'song') {
                    detailItem = allSongsData.find(s => s.id === params.id);
                }
                if (!detailItem && params.type === 'artist') {
                    detailItem = likedArtists.find(a => a.id === params.id);
                }

                if (detailItem) {
                    console.log('Rendering detail for:', detailItem);
                    renderDetailPage(detailItem);
                } else {
                    mainContentArea.innerHTML = '<p>Item not found.</p>';
                }
                break;
            case 'profile':
                renderProfilePage();
                break;
            default:
                renderHomePage();
        }
    };

    const updateNavigationButtons = () => {
        backButton.disabled = historyIndex === 0;
        forwardButton.disabled = historyIndex === viewHistory.length - 1;
    };

    // Function to attach navigation link event listeners
    const attachNavListeners = () => {
        console.log('Attaching navigation listeners.');
        navLinks.forEach(link => {
            // Remove existing listener to prevent duplicates before adding
            link.removeEventListener('click', handleNavLinkClick);
            link.addEventListener('click', handleNavLinkClick);
        });

        backButton.removeEventListener('click', goBack);
        backButton.addEventListener('click', goBack);
        
        forwardButton.removeEventListener('click', goForward);
        forwardButton.addEventListener('click', goForward);
    };

    const handleNavLinkClick = (e) => {
        e.preventDefault();
        const target = e.currentTarget.querySelector('span').textContent.toLowerCase().replace(/ /g, '-');
        navigateTo(target);
    };

    // Playback Controls
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseIcon.classList.remove('fa-play-circle');
            playPauseIcon.classList.add('fa-pause-circle');
        } else {
            audio.pause();
            playPauseIcon.classList.remove('fa-pause-circle');
            playPauseIcon.classList.add('fa-play-circle');
        }
    });

    const playSong = (song, albumImage, item = null) => {
        // Pause any currently playing song
        if (!audio.paused) {
            audio.pause();
        }

        nowPlayingAlbumArt.src = albumImage || 'covers/default.jpg'; // Fallback image
        nowPlayingSongTitle.textContent = song.title;
        nowPlayingArtistName.textContent = song.artist;

        // Set the audio source and load it
        audio.src = song.audioSrc;
        audio.load();
        audio.play();

        // Update play/pause icon
        playPauseIcon.classList.remove('fa-play-circle');
        playPauseIcon.classList.add('fa-pause-circle');

        // Store current playing item and song index for next/prev functionality
        if (item) {
            currentPlayingItem = item;
            currentSongIndex = item.songs.findIndex(s => s.id === song.id); // Use song.id for accurate matching
        } else {
            // If a song is played directly without an album/playlist context
            currentPlayingItem = null;
            currentSongIndex = allSongsData.findIndex(s => s.id === song.id);
        }

        // Update duration and progress bar as song plays
        audio.addEventListener('loadedmetadata', () => {
            currentSongDuration = audio.duration;
            durationSpan.textContent = formatTime(currentSongDuration);
            songProgressBar.max = currentSongDuration; // Set max to actual duration in seconds
        });

        audio.addEventListener('timeupdate', () => {
            currentPlaybackTime = audio.currentTime;
            currentTimeSpan.textContent = formatTime(currentPlaybackTime);
            songProgressBar.value = currentPlaybackTime;
        });

        audio.addEventListener('ended', () => {
            playPauseIcon.classList.remove('fa-pause-circle');
            playPauseIcon.classList.add('fa-play-circle');
            // Optionally play next song automatically here
            if (repeatButton.classList.contains('active')) {
                playSong(song, albumImage, item); // Repeat current song
            } else if (playbackQueue.length > 0) { // Play from queue first
                const nextQueuedSong = playbackQueue.shift(); // Get and remove first song from queue
                savePlaybackQueueToLocalStorage();
                playSong(nextQueuedSong, nextQueuedSong.coverSrc, null); // Play queued song, no item context
            } else if (currentPlayingItem && currentSongIndex < currentPlayingItem.songs.length - 1) {
                const nextSong = currentPlayingItem.songs[currentSongIndex + 1];
                playSong(nextSong, currentPlayingItem.image, currentPlayingItem);
            } else if (!currentPlayingItem && currentSongIndex < allSongsData.length - 1) { // For direct song playback
                const nextSong = allSongsData[currentSongIndex + 1];
                playSong(nextSong, nextSong.coverSrc); // Use coverSrc for direct song playback
            } else {
                // No more songs or not in a playlist/album context
            }
        });

        console.log(`Now playing: ${song.title} by ${song.artist}`);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const volumeSlider = document.querySelector('.now-playing-bar .volume-control .slider');
    const userProfileBtn = document.getElementById('user-profile-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const shuffleButton = document.querySelector('.now-playing-bar .controls button:nth-child(1)');
    const prevButton = document.querySelector('.now-playing-bar .controls button:nth-child(2)');
    const nextButton = document.querySelector('.now-playing-bar .controls button:nth-child(4)');
    const repeatButton = document.querySelector('.now-playing-bar .controls button:nth-child(5)');
    const createPlaylistBtn = document.querySelector('.create-playlist-btn');
    const sidebarPlaylistsUl = document.querySelector('.sidebar .playlists ul');

    // Add to Playlist Modal elements
    const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
    const closeModalButton = addToPlaylistModal.querySelector('.close-button');
    const playlistsListDiv = addToPlaylistModal.querySelector('.playlists-list');
    const addToPlaylistConfirmBtn = document.getElementById('add-to-playlist-confirm-btn');

    let songToAdd = null; // To store the song object being added to a playlist

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100; // Set volume between 0 and 1
        console.log(`Volume: ${audio.volume * 100}%`);
    });

    songProgressBar.addEventListener('input', (e) => {
        const scrubTime = (e.target.value / 100) * currentSongDuration;
        audio.currentTime = scrubTime; // Update audio current time
        currentPlaybackTime = audio.currentTime;
        currentTimeSpan.textContent = formatTime(currentPlaybackTime);
        console.log(`Scrubbed to: ${formatTime(currentPlaybackTime)}`);
    });

    // User profile dropdown toggle
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from bubbling up to document and closing dropdown immediately
        dropdownContent.classList.toggle('show');
    });

    // Close the dropdown if the user clicks outside of it
    document.addEventListener('click', (e) => {
        if (!userProfileBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Add to Playlist Modal functionality
    closeModalButton.addEventListener('click', () => {
        addToPlaylistModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === addToPlaylistModal) {
            addToPlaylistModal.style.display = 'none';
        }
    });

    const openAddToPlaylistModal = () => {
        playlistsListDiv.innerHTML = ''; // Clear previous list
        userPlaylists.forEach(playlist => {
            const checkboxId = `playlist-${playlist.id}`;
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" id="${checkboxId}" value="${playlist.id}">
                ${playlist.name}
            `;
            playlistsListDiv.appendChild(label);
        });
        addToPlaylistModal.style.display = 'flex'; // Use flex to center the modal
    };

    addToPlaylistConfirmBtn.addEventListener('click', () => {
        const selectedPlaylists = [];
        playlistsListDiv.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            selectedPlaylists.push(checkbox.value);
        });
        console.log('Selected playlists for adding song:', selectedPlaylists);

        if (songToAdd && selectedPlaylists.length > 0) {
            selectedPlaylists.forEach(playlistId => {
                const targetPlaylist = userPlaylists.find(p => p.id === playlistId);
                if (targetPlaylist) {
                    console.log(`Attempting to add song ${songToAdd.title} to playlist ${targetPlaylist.name}`);
                    // Prevent adding duplicate songs to the same playlist
                    if (!targetPlaylist.songs.some(s => s.id === songToAdd.id)) {
                        targetPlaylist.songs.push(songToAdd);
                        console.log(`Added ${songToAdd.title} to playlist: ${targetPlaylist.name}`);
                    } else {
                        console.log(`${songToAdd.title} is already in playlist: ${targetPlaylist.name}`);
                    }
                    console.log('Updated playlist after adding/checking:', targetPlaylist);
                }
            });
            alert(`Song added to ${selectedPlaylists.length} playlist(s)!`);
            addToPlaylistModal.style.display = 'none';

            // Re-render library if currently on that page to show changes
            if (historyIndex > -1 && viewHistory[historyIndex].id === 'your-library') {
                renderLibraryPage();
            }
            // If currently on a playlist detail page, re-render to show changes
            if (historyIndex > -1 && viewHistory[historyIndex].id === 'detail' && viewHistory[historyIndex].params.type === 'playlist') {
                const currentPlaylistId = viewHistory[historyIndex].params.id;
                const updatedPlaylist = userPlaylists.find(p => p.id === currentPlaylistId);
                if (updatedPlaylist) {
                    renderDetailPage(updatedPlaylist);
                }
            }

            savePlaylistsToLocalStorage(); // Save changes
            console.log('Playlists saved to local storage:', userPlaylists);
            updateAllContent(); // Update allContent after playlist changes
            renderSidebarPlaylists(); // Update sidebar playlists after creation

        } else if (!songToAdd) {
            alert('No song selected to add.');
        } else {
            alert('Please select at least one playlist.');
        }
    });

    // Shuffle and Repeat button functionality
    shuffleButton.addEventListener('click', () => {
        shuffleButton.classList.toggle('active');
        console.log('Shuffle toggled!');
    });

    repeatButton.addEventListener('click', () => {
        repeatButton.classList.toggle('active');
        console.log('Repeat toggled!');
    });

    // Previous and Next song functionality (mock)
    prevButton.addEventListener('click', () => {
        console.log('Previous song');
        prevButton.classList.add('active');
        setTimeout(() => prevButton.classList.remove('active'), 100); // Remove active class after a short delay
        if (currentPlayingItem && currentSongIndex > 0) {
            const prevSong = currentPlayingItem.songs[currentSongIndex - 1];
            playSong(prevSong, currentPlayingItem.image, currentPlayingItem);
        } else if (!currentPlayingItem && currentSongIndex > 0) { // For direct song playback
            const prevSong = allSongsData[currentSongIndex - 1];
            playSong(prevSong, prevSong.coverSrc); // Use coverSrc for direct song playback
        } else if (currentPlayingItem && currentSongIndex === 0) {
            // If at the beginning of a playlist/album, restart current song or go to end of previous playlist/album
            playSong(currentPlayingItem.songs[currentSongIndex], currentPlayingItem.image, currentPlayingItem);
        } else if (!currentPlayingItem && currentSongIndex === 0) {
            // If at the beginning of allSongsData, restart current song
            playSong(allSongsData[currentSongIndex], allSongsData[currentSongIndex].coverSrc);
        }
    });

    nextButton.addEventListener('click', () => {
        console.log('Next song');
        nextButton.classList.add('active');
        setTimeout(() => nextButton.classList.remove('active'), 100); // Remove active class after a short delay
        if (playbackQueue.length > 0) {
            const nextQueuedSong = playbackQueue.shift(); // Get and remove first song from queue
            savePlaybackQueueToLocalStorage();
            playSong(nextQueuedSong, nextQueuedSong.coverSrc, null); // Play queued song, no item context
        } else if (currentPlayingItem && currentSongIndex < currentPlayingItem.songs.length - 1) {
            const nextSong = currentPlayingItem.songs[currentSongIndex + 1];
            playSong(nextSong, currentPlayingItem.image, currentPlayingItem);
        } else if (!currentPlayingItem && currentSongIndex < allSongsData.length - 1) { // For direct song playback
            const nextSong = allSongsData[currentSongIndex + 1];
            playSong(nextSong, nextSong.coverSrc); // Use coverSrc for direct song playback
        } else {
            // If at the end, loop back to the first song if repeat is active, or stop
            if (repeatButton.classList.contains('active')) {
                if (currentPlayingItem) {
                    playSong(currentPlayingItem.songs[0], currentPlayingItem.image, currentPlayingItem);
                } else {
                    playSong(allSongsData[0], allSongsData[0].coverSrc);
                }
            } else {
                // Stop playback or do nothing if not repeating
                audio.pause();
                audio.currentTime = 0;
                playPauseIcon.classList.remove('fa-pause-circle');
                playPauseIcon.classList.add('fa-play-circle');
                currentTimeSpan.textContent = formatTime(0);
                songProgressBar.value = 0;
            }
        }
    });

    // Create Playlist functionality
    createPlaylistBtn.addEventListener('click', () => {
        const playlistName = prompt('Enter playlist name:');
        if (playlistName && playlistName.trim() !== '') {
            const newPlaylist = {
                id: `user-playlist-${Date.now()}`,
                name: playlistName.trim(),
                creator: 'You',
                image: 'covers/1.jpg', // Placeholder for new playlist
                type: 'playlist',
                songs: []
            };
            userPlaylists.push(newPlaylist);
            console.log(`Created new playlist: ${newPlaylist.name}`);

            savePlaylistsToLocalStorage(); // Save changes
            renderSidebarPlaylists(); // Update sidebar playlists after creation

            // If currently on Your Library page, re-render to show new playlist
            if (historyIndex > -1 && viewHistory[historyIndex].id === 'your-library') {
                renderLibraryPage();
            }
        }
    });

    // Function to render playlists in the sidebar
    const renderSidebarPlaylists = () => {
        console.log('Rendering sidebar playlists. Current userPlaylists:', userPlaylists);
        sidebarPlaylistsUl.innerHTML = ''; // Clear existing playlists
        userPlaylists.forEach(playlist => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-playlist-id="${playlist.id}">${playlist.name}</a>`;
            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('detail', { type: 'playlist', id: playlist.id });
            });
            sidebarPlaylistsUl.appendChild(li);
        });
    };

    // Function to render the profile page
    const renderProfilePage = () => {
        // Update dynamic counts from actual data
        currentUser.playlistsCount = userPlaylists.length;
        currentUser.likedSongsCount = likedSongs.length;

        mainContentArea.innerHTML = `
            <div class="profile-header">
                <img src="${currentUser.avatar}" alt="${currentUser.name}'s Avatar" class="profile-page-avatar">
                <div class="profile-info">
                    <p>Profile</p>
                    <h1>${currentUser.name}</h1>
                    <div class="profile-stats">
                        <span>${currentUser.playlistsCount} Playlists</span>
                        <span>${currentUser.followers} Followers</span>
                        <span>${currentUser.following} Following</span>
                        <span>${currentUser.likedSongsCount} Liked Songs</span>
                    </div>
                    <p class="profile-bio">${currentUser.bio}</p>
                </div>
            </div>
            <div class="profile-content">
                <h2>Your Playlists</h2>
                <div class="cards-container" id="profile-playlists-container">
                    <!-- User playlists will be rendered here -->
                </div>
                <h2>Liked Songs</h2>
                <div class="liked-songs-container" id="profile-liked-songs-container">
                    <!-- Liked songs will be rendered here -->
                </div>
            </div>
        `;

        // Render user playlists on the profile page
        const profilePlaylistsContainer = document.getElementById('profile-playlists-container');
        if (userPlaylists.length > 0) {
            userPlaylists.forEach(playlist => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `
                    <img src="${playlist.image}" alt="${playlist.name}">
                    <h4>${playlist.name}</h4>
                    <p>Playlist &bull; ${playlist.creator}</p>
                `;
                cardElement.addEventListener('click', () => navigateTo('detail', { type: playlist.type, id: playlist.id }));
                profilePlaylistsContainer.appendChild(cardElement);
            });
        } else {
            profilePlaylistsContainer.innerHTML = '<p>No playlists created yet.</p>';
        }

        // Render liked songs on the profile page
        const profileLikedSongsContainer = document.getElementById('profile-liked-songs-container');
        if (likedSongs.length > 0) {
            likedSongs.forEach(song => {
                const songElement = document.createElement('div');
                songElement.className = 'liked-item'; // Reuse existing liked-item style
                songElement.innerHTML = `
                    <img src="${song.coverSrc}" alt="${song.title}">
                    <div class="info">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                    <button class="play-song-btn" data-title="${song.title}" data-artist="${song.artist}" data-image="${song.coverSrc}" data-song-id="${song.id}" data-song-audiosrc="${song.audioSrc}" data-song-duration="${song.duration}"><i class="fas fa-play"></i></button>
                `;
                songElement.querySelector('.play-song-btn').addEventListener('click', () => playSong(song, song.coverSrc));
                profileLikedSongsContainer.appendChild(songElement);
            });
        } else {
            profileLikedSongsContainer.innerHTML = '<p>No liked songs yet.</p>';
        }
    };

    // Initial render
    navigateTo('home');
    renderSidebarPlaylists(); // Render sidebar playlists on initial load
    attachNavListeners(); // Ensure navigation listeners are attached on initial load

    function savePlaylistsToLocalStorage() {
        localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
    }

    function saveLikedSongsToLocalStorage() {
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    }

    function savePlaybackQueueToLocalStorage() {
        localStorage.setItem('playbackQueue', JSON.stringify(playbackQueue));
    }
}); 