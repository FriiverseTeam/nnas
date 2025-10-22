const { Router } = require('express');
const { create } = require('xmlbuilder');
const bcrypt = require('bcrypt');
const { getNNIDByUsername, getNNIDByTokenAuth } = require('../../../database');
const { generateToken } = require('../../../hash');

const router = Router();

router.post('/access_token/generate', async (req, res) => {
    const { grant_type, user_id, password, refresh_token } = req.body;

    if (!['password', 'refresh_token'].includes(grant_type)) {
		const response = create({
			error: {
				cause: 'grant_type',
				code: '0004',
				message: 'Invalid Grant Type'
			}
		}).end();
		return res.status(400).send(response);
	}

	let nnid = null;

	if (grant_type === 'password') {
		if (!user_id || user_id.trim() === '') {
			const response = create({
				error: {
					cause: 'user_id',
					code: '0002',
					message: 'user_id format is invalid'
				}
			}).end();
			return res.status(400).send(response);
		}

		if (!password || password.trim() === '') {
			const response = create({
				error: {
					cause: 'password',
					code: '0002',
					message: 'password format is invalid'
				}
			}).end();
			return res.status(400).send(response);
		}

		nnid = await getNNIDByUsername(user_id);

		if (!nnid || !await bcrypt.compare(password, nnid.password)) {
			const response = create({
				errors: {
					error: {
						code: '0106',
						message: 'Invalid account ID or password'
					}
				}
			}).end({ pretty: true });
			return res.status(400).send(response);
		}
	} else {
		if (!refresh_token || refresh_token.trim() === '') {
			const response = create({
				error: {
					cause: 'refresh_token',
					code: '0106',
					message: 'Invalid Refresh Token'
				}
			}).end();
			return res.status(400).send(response);
		}

		try {
			nnid = await getNNIDByTokenAuth(refresh_token);

			if (!nnid) {
				const response = create({
					error: {
						cause: 'refresh_token',
						code: '0106',
						message: 'Invalid Refresh Token'
					}
				}).end();
				return res.status(400).send(response);
			}
		} catch (error) {
			const response = create({
				error: {
					cause: 'refresh_token',
					code: '0106',
					message: 'Invalid Refresh Token'
				}
			}).end();
			return res.status(400).send(response);
		}
	}

	if (nnid.deleted) {
		const response = create({
			error: {
				code: '0112',
				message: nnid.username
			}
		}).end();
        return res.status(400).send(response);
	}

	if (nnid.account_level < 0) {
		const response = create({
			errors: {
				error: {
					code: '0108',
					message: 'Account has been banned'
				}
			}
		}).end();
		return res.status(400).send(response);
	}

	const expiresInMs = 3600 * 1000;
	const now = Date.now();
	const expiresIn = 3600;

	const [accessTokenBuffer, refreshTokenBuffer] = await Promise.all([
		generateToken(process.env.AES_KEY, {
			system_type: 0x1,
			token_type: 0x1,
			pid: nnid.pid,
			expire_time: BigInt(now + expiresInMs)
		}),
		generateToken(process.env.AES_KEY, {
			system_type: 0x1,
			token_type: 0x2,
			pid: nnid.pid,
			expire_time: BigInt(now + expiresInMs)
		})
	]);

	const response = create({
		OAuth20: {
			access_token: {
				token: accessTokenBuffer?.toString('hex') ?? '',
				refresh_token: refreshTokenBuffer?.toString('hex') ?? '',
				expires_in: expiresIn
			}
		}
	}).end();

	res.send(response);
});

module.exports = router;