import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Brain Battery™ — 45-Second Cognitive & Reflex Challenge';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage({ searchParams }) {
    const resolvedParams = await searchParams;
    const rawBeat = resolvedParams?.beat;
    const rawFrom = resolvedParams?.from;

    const parsedScore = Number(rawBeat);
    const hasScore =
        rawBeat !== undefined &&
        rawBeat !== '' &&
        !Number.isNaN(parsedScore) &&
        parsedScore >= 0 &&
        parsedScore <= 100;

    const score = hasScore ? Math.round(parsedScore) : null;
    const challenger =
        typeof rawFrom === 'string' && rawFrom.trim()
            ? rawFrom.trim().slice(0, 24)
            : null;

    const mentalAge =
        score !== null ? Math.max(18, Math.round(52 - score * 0.32)) : null;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '56px 64px',
                    background:
                        'linear-gradient(135deg, #09090b 0%, #111827 55%, #064e3b 100%)',
                    color: '#ffffff',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Top Badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 22px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(16, 185, 129, 0.16)',
                            border: '1px solid rgba(52, 211, 153, 0.4)',
                            color: '#34d399',
                            fontSize: '22px',
                            fontWeight: 700,
                        }}
                    >
                        <span>45-SECOND COGNITIVE CHECK</span>
                    </div>

                    <div
                        style={{
                            fontSize: '26px',
                            fontWeight: 800,
                            color: '#a1a1aa',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Brain Battery™
                    </div>
                </div>

                {/* Center Scorecard / Hook */}
                {score !== null ? (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '40px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                maxWidth: '700px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#fbbf24',
                                }}
                            >
                                {challenger
                                    ? `${challenger.toUpperCase()} SET A CHALLENGE`
                                    : 'SCORE CHALLENGE SET'}
                            </div>

                            <div
                                style={{
                                    fontSize: '58px',
                                    fontWeight: 900,
                                    lineHeight: 1.08,
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                Can you beat {score}% in 45 seconds?
                            </div>

                            <div
                                style={{
                                    fontSize: '26px',
                                    color: '#d4d4d8',
                                }}
                            >
                                Estimated Mental Age: {mentalAge} yrs • Reflex, Focus & Memory
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '290px',
                                height: '290px',
                                borderRadius: '36px',
                                backgroundColor: 'rgba(9, 9, 11, 0.72)',
                                border: '2px solid rgba(52, 211, 153, 0.45)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#34d399',
                                    letterSpacing: '0.06em',
                                }}
                            >
                                BATTERY
                            </div>
                            <div
                                style={{
                                    fontSize: '96px',
                                    fontWeight: 900,
                                    lineHeight: 1,
                                    color: '#ffffff',
                                    marginTop: '8px',
                                }}
                            >
                                {score}%
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            maxWidth: '880px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '66px',
                                fontWeight: 900,
                                lineHeight: 1.08,
                                letterSpacing: '-0.03em',
                            }}
                        >
                            How sharp is your brain right now?
                        </div>
                        <div
                            style={{
                                fontSize: '30px',
                                color: '#d4d4d8',
                            }}
                        >
                            Test reflex speed, impulse control, and working memory. Check your Mental Age & challenge friends.
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                        paddingTop: '24px',
                        fontSize: '22px',
                        color: '#a1a1aa',
                    }}
                >
                    <span>No signup • Instant browser play</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>
                        Tap link to play →
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}