const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    // add song service
    async addSong({ title, year, performer, genre, duration }) {
        const id = `song-${nanoid(16)}`;
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO songs VALUES($1,$2,$3, $4, $5,$6, $7, $7) RETURNING id',
            values: [
                id,
                title,
                year,
                performer,
                genre,
                duration,
                createdAt,
            ],
        };

        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    // fetch songs service
    async getAllSongs() {
        const result = await this._pool.query(
            'SELECT id, title, performer FROM songs',
        );

        return result.rows;
    }

    // get song by id service
    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows[0];
    }

    // update song by id service
    async editSongById(
        id,
        { title, year, performer, genre, duration },
    ) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "updatedAt" = $6 WHERE id = $7 RETURNING id',
            values: [
                title,
                year,
                performer,
                genre,
                duration,
                updatedAt,
                id,
            ],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
    }

    // delete song by id service
    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
    }
}

module.exports = SongsService;
