const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylist,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistByOwner,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}',
        handler: handler.deletePlaylist,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: handler.postPlaylistsSong,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: handler.getSongsFromPlaylistsByPlaylistId,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: handler.deleteSongFromPlaylistsBySongIdAndPlaylistId,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
];
module.exports = routes;
