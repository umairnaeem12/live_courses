import jwt from "jsonwebtoken";

export function muxSignedPlaybackUrl(playbackId: string, ttlSeconds = 600) {
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
        { aud: "v", sub: playbackId, exp: now + ttlSeconds },
        process.env.MUX_SIGNING_KEY!,
        { header: { alg: "HS256", kid: process.env.MUX_SIGNING_KEY_ID!, typ: "JWT" } }
    );
    return {
        hls: `https://stream.mux.com/${playbackId}.m3u8?token=${token}`,
        dash: `https://stream.mux.com/${playbackId}.mpd?token=${token}`,
        expiresIn: ttlSeconds,
    };
}
