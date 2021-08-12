const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
    constructor(_collaborationService) {
        this._pool = new Pool();
        this._collaborationService = _collaborationService;
    }

    async addPlaylist({ name, owner }) {
        const id = `playlists-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('Playlists gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylistsByOwner(owner) {
        const query = {
            text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id INNER JOIN users ON users.id = playlists.owner   WHERE playlists.owner = $1 OR collaborations.user_id = $1',
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deletePlaylists(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError(
                'Playlists gagal dihapus. Id tidak ditemukan',
            );
        }
    }

    async addPlaylistsSong({ playlistId, songId }) {
        const id = `playlists-song-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError(
                'Lagu gagal ditambahkan ke playlist',
            );
        }

        return result.rows[0].id;
    }

    async getSongsFromPlaylistsByPlaylistId(playlistId) {
        const query = {
            text: 'SELECT songs.id, songs.title, songs.performer FROM playlists INNER JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id INNER JOIN songs ON playlistsongs.song_id = songs.id WHERE playlists.id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deleteSongFromPlaylistsBySongIdAndPlaylistId(
        songId,
        playlistId,
    ) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
            values: [songId, playlistId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Lagu tidak ditemukan');
        }
    }

    async verifyPlaylistsOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Playlists tidak ditemukan');
        }
        const playlist = result.rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError(
                'Anda tidak berhak mengakses resource ini',
            );
        }
    }

    async verifyPlaylistsAcess(playlistId, userId) {
        try {
            await this.verifyPlaylistsOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(
                    playlistId,
                    userId,
                );
            } catch {
                throw error;
            }
        }
    }
}

module.exports = PlaylistsService;
