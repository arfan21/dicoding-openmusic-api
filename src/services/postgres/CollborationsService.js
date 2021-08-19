/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addCollaboration(playlistsId, userId) {
        const id = `collab-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistsId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Kolaborasi gagal ditambahkan');
        }
        await this._cacheService.delete(`playlist-${userId}`);
        return result.rows[0].id;
    }

    async deleteCollaboration(playlistsId, userId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
            values: [playlistsId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Kolaborasi gagal dihapus');
        }
        await this._cacheService.delete(`playlist-${userId}`);
    }

    async verifyCollaborator(playlistsId, userId) {
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistsId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Kolaborasi gagal diverifikasi');
        }
    }
}

module.exports = CollaborationsService;
