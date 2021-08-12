/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UserService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname }) {
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
            // check error when username duplicate
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

    async verifyUserCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AuthenticationError(
                'Kredensial yang Anda berikan salah',
            );
        }

        const { id, password: hashedPassword } = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError(
                'Kredensial yang Anda berikan salah',
            );
        }
        return id;
    }
}

module.exports = UserService;
