/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    // add song service
    async addSong({ title, year, performer, genre, duration }) {
        const id = `song-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO songs VALUES($1,$2,$3, $4, $5,$6, $7, $8) RETURNING id',
            values: [
                id,
                title,
                year,
                performer,
                genre,
                duration,
                createdAt,
                updatedAt,
            ],
        };

        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    // fetch songs service
    // get song by id service
    // update song by id service
    // delete song by id service
}

module.exports = SongsService;
