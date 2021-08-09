/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class UserService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname }) {
        // await this.verifyNewUsername(username);

        try {
            const id = `user-${nanoid(16)}`;
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = {
                text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
                values: [id, username, hashedPassword, fullname],
            };

            const result = await this._pool.query(query);

            if (!result.rowCount) {
                throw new InvariantError('User gagal ditambahkan');
            }
            return result.rows[0].id;
        } catch (error) {
            if (
                error?.message ===
                'duplicate key value violates unique constraint "users_username_key"'
            ) {
                throw new InvariantError(
                    'Gagal menambahkan user. Username sudah digunakan.',
                );
            }
            return error;
        }
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (result.rowCount > 0) {
            throw new InvariantError(
                'Gagal menambahkan user. Username sudah digunakan.',
            );
        }
    }
}

module.exports = UserService;
